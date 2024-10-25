package mediamtx

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestGetConfig(t *testing.T) {
	// Create test server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/v2/config/get" {
			t.Errorf("Expected path '/v2/config/get', got %s", r.URL.Path)
		}

		response := struct {
			Paths PathConfigs `json:"paths"`
		}{
			Paths: PathConfigs{
				"test": PathConfig{
					Source:         "rtsp://example.com/stream",
					SourceProtocol: "rtsp",
					RunOnDemand:    "yes",
				},
			},
		}

		json.NewEncoder(w).Encode(response)
	}))
	defer server.Close()

	// Create client with test server URL
	client := NewClient(server.URL)

	// Test GetConfig
	config, err := client.GetConfig()
	if err != nil {
		t.Fatalf("GetConfig failed: %v", err)
	}

	// Verify response
	if len(config) != 1 {
		t.Errorf("Expected 1 path config, got %d", len(config))
	}

	if path, ok := config["test"]; !ok {
		t.Error("Expected 'test' path in config")
	} else {
		if path.Source != "rtsp://example.com/stream" {
			t.Errorf("Expected source 'rtsp://example.com/stream', got '%s'", path.Source)
		}
	}
}

func TestGetPathStatuses(t *testing.T) {
	// Create test server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/v2/paths/list" {
			t.Errorf("Expected path '/v2/paths/list', got %s", r.URL.Path)
		}

		response := struct {
			Items []PathStatus `json:"items"`
		}{
			Items: []PathStatus{
				{
					Name:          "test",
					Source:        "rtsp://example.com/stream",
					TrackCount:    2,
					BytesReceived: 1000,
					BytesSent:     2000,
					StartTime:     time.Now(),
				},
			},
		}

		json.NewEncoder(w).Encode(response)
	}))
	defer server.Close()

	// Create client with test server URL
	client := NewClient(server.URL)

	// Test GetPathStatuses
	statuses, err := client.GetPathStatuses()
	if err != nil {
		t.Fatalf("GetPathStatuses failed: %v", err)
	}

	// Verify response
	if len(statuses) != 1 {
		t.Errorf("Expected 1 path status, got %d", len(statuses))
	}

	if status := statuses[0]; status.Name != "test" {
		t.Errorf("Expected name 'test', got '%s'", status.Name)
	}
}

func TestAddPath(t *testing.T) {
	// Create test server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/v2/config/paths/add" {
			t.Errorf("Expected path '/v2/config/paths/add', got %s", r.URL.Path)
		}

		if r.Method != "POST" {
			t.Errorf("Expected method 'POST', got '%s'", r.Method)
		}

		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	// Create client with test server URL
	client := NewClient(server.URL)

	// Test AddPath
	config := PathConfig{
		Source:         "rtsp://example.com/stream",
		SourceProtocol: "rtsp",
		RunOnDemand:    "yes",
	}

	err := client.AddPath("test", config)
	if err != nil {
		t.Fatalf("AddPath failed: %v", err)
	}
}

func TestRemovePath(t *testing.T) {
	// Create test server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/v2/config/paths/remove/test" {
			t.Errorf("Expected path '/v2/config/paths/remove/test', got %s", r.URL.Path)
		}

		if r.Method != "POST" {
			t.Errorf("Expected method 'POST', got '%s'", r.Method)
		}

		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	// Create client with test server URL
	client := NewClient(server.URL)

	// Test RemovePath
	err := client.RemovePath("test")
	if err != nil {
		t.Fatalf("RemovePath failed: %v", err)
	}
}
