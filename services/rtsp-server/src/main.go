package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/vicaptor/rtap-rtsp/services/rtsp-server/mediamtx"
)

const Version = "0.3.0"

type StreamInfo struct {
	Name       string    `json:"name"`
	Source     string    `json:"source"`
	StartTime  time.Time `json:"startTime"`
	Clients    int       `json:"clients"`
	BytesSent  int64     `json:"bytesSent"`
	IsRecording bool     `json:"isRecording"`
}

type StreamStats struct {
	ActiveStreams int          `json:"activeStreams"`
	Streams      []StreamInfo `json:"streams"`
}

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true // In production, implement proper origin checking
		},
	}

	mtxClient *mediamtx.Client
	wsClients = make(map[*websocket.Conn]bool)
	wsLock    sync.RWMutex
)

func main() {
	// Initialize MediaMTX client
	mtxURL := os.Getenv("MEDIAMTX_API_URL")
	if mtxURL == "" {
		mtxURL = "http://localhost:9997"
	}
	mtxClient = mediamtx.NewClient(mtxURL)

	// Create router
	r := mux.NewRouter()

	// API routes
	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/health", healthCheckHandler).Methods("GET")
	api.HandleFunc("/streams", getStreamsHandler).Methods("GET")
	api.HandleFunc("/streams/{name}", getStreamHandler).Methods("GET")
	api.HandleFunc("/streams/{name}/start", startStreamHandler).Methods("POST")
	api.HandleFunc("/streams/{name}/stop", stopStreamHandler).Methods("POST")
	api.HandleFunc("/streams/{name}/record", toggleRecordingHandler).Methods("POST")

	// WebSocket route for real-time updates
	r.HandleFunc("/ws", wsHandler)

	// Start monitoring
	go monitorStreams()

	// Start HTTP server
	port := os.Getenv("API_PORT")
	if port == "" {
		port = "9997"
	}
	
	log.Printf("Starting RTSP server API on port %s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "healthy",
		"version": Version,
	})
}

func getStreamsHandler(w http.ResponseWriter, r *http.Request) {
	paths, err := mtxClient.GetPathStatuses()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	streams := make([]StreamInfo, len(paths))
	for i, path := range paths {
		streams[i] = StreamInfo{
			Name:      path.Name,
			Source:    path.Source,
			StartTime: path.StartTime,
			BytesSent: path.BytesSent,
		}
	}

	stats := StreamStats{
		ActiveStreams: len(streams),
		Streams:      streams,
	}
	json.NewEncoder(w).Encode(stats)
}

func getStreamHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	name := vars["name"]
	
	paths, err := mtxClient.GetPathStatuses()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for _, path := range paths {
		if path.Name == name {
			stream := StreamInfo{
				Name:      path.Name,
				Source:    path.Source,
				StartTime: path.StartTime,
				BytesSent: path.BytesSent,
			}
			json.NewEncoder(w).Encode(stream)
			return
		}
	}

	http.NotFound(w, r)
}

func startStreamHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	name := vars["name"]
	
	var config struct {
		Source string `json:"source"`
	}
	if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	pathConfig := mediamtx.PathConfig{
		Source:         config.Source,
		SourceProtocol: "rtsp",
		RunOnDemand:    "yes",
		RunOnDemandRestart: true,
	}

	if err := mtxClient.AddPath(name, pathConfig); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"status": "started",
		"stream": name,
	})
}

func stopStreamHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	name := vars["name"]
	
	if err := mtxClient.RemovePath(name); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"status": "stopped",
		"stream": name,
	})
}

func toggleRecordingHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	name := vars["name"]
	
	// TODO: Implement recording toggle through MediaMTX API
	// This requires additional MediaMTX configuration
	json.NewEncoder(w).Encode(map[string]string{
		"status": "recording_started",
		"stream": name,
	})
}

func broadcastStats(stats StreamStats) {
	wsLock.RLock()
	defer wsLock.RUnlock()

	for client := range wsClients {
		if err := client.WriteJSON(stats); err != nil {
			log.Printf("WebSocket write error: %v", err)
			client.Close()
			delete(wsClients, client)
		}
	}
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade failed: %v", err)
		return
	}

	wsLock.Lock()
	wsClients[conn] = true
	wsLock.Unlock()

	defer func() {
		wsLock.Lock()
		delete(wsClients, conn)
		wsLock.Unlock()
		conn.Close()
	}()

	// Handle WebSocket connection
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			log.Printf("WebSocket read error: %v", err)
			break
		}
	}
}

func monitorStreams() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		paths, err := mtxClient.GetPathStatuses()
		if err != nil {
			log.Printf("Failed to get path statuses: %v", err)
			continue
		}

		streams := make([]StreamInfo, len(paths))
		for i, path := range paths {
			streams[i] = StreamInfo{
				Name:      path.Name,
				Source:    path.Source,
				StartTime: path.StartTime,
				BytesSent: path.BytesSent,
			}
		}

		stats := StreamStats{
			ActiveStreams: len(streams),
			Streams:      streams,
		}

		broadcastStats(stats)
	}
}
