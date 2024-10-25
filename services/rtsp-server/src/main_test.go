package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
)

func TestHealthCheckHandler(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(healthCheckHandler)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	var response map[string]string
	if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
		t.Fatal(err)
	}

	if response["status"] != "healthy" {
		t.Errorf("handler returned wrong status: got %v want %v", response["status"], "healthy")
	}

	if response["version"] != Version {
		t.Errorf("handler returned wrong version: got %v want %v", response["version"], Version)
	}
}

func TestStartStreamHandler(t *testing.T) {
	payload := []byte(`{"source": "rtsp://example.com/stream"}`)

	req, err := http.NewRequest("POST", "/api/streams/test/start", bytes.NewBuffer(payload))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	router := mux.NewRouter()
	router.HandleFunc("/api/streams/{name}/start", startStreamHandler).Methods("POST")
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	var response map[string]string
	if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
		t.Fatal(err)
	}

	if response["status"] != "started" {
		t.Errorf("handler returned wrong status: got %v want %v", response["status"], "started")
	}

	if response["stream"] != "test" {
		t.Errorf("handler returned wrong stream name: got %v want %v", response["stream"], "test")
	}
}

func TestStopStreamHandler(t *testing.T) {
	req, err := http.NewRequest("POST", "/api/streams/test/stop", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	router := mux.NewRouter()
	router.HandleFunc("/api/streams/{name}/stop", stopStreamHandler).Methods("POST")
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	var response map[string]string
	if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
		t.Fatal(err)
	}

	if response["status"] != "stopped" {
		t.Errorf("handler returned wrong status: got %v want %v", response["status"], "stopped")
	}

	if response["stream"] != "test" {
		t.Errorf("handler returned wrong stream name: got %v want %v", response["stream"], "test")
	}
}
