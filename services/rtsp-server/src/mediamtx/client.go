package mediamtx

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Client struct {
	BaseURL string
	client  *http.Client
}

type PathConfig struct {
	Source         string `json:"source"`
	SourceProtocol string `json:"sourceProtocol"`
	RunOnDemand    string `json:"runOnDemand"`
	RunOnDemandRestart bool `json:"runOnDemandRestart"`
}

type PathConfigs map[string]PathConfig

type PathStatus struct {
	Name          string    `json:"name"`
	Source        string    `json:"source"`
	TrackCount    int       `json:"trackCount"`
	BytesReceived int64     `json:"bytesReceived"`
	BytesSent     int64     `json:"bytesSent"`
	StartTime     time.Time `json:"startTime"`
}

func NewClient(baseURL string) *Client {
	return &Client{
		BaseURL: baseURL,
		client: &http.Client{
			Timeout: time.Second * 10,
		},
	}
}

func (c *Client) GetConfig() (PathConfigs, error) {
	resp, err := c.client.Get(fmt.Sprintf("%s/v2/config/get", c.BaseURL))
	if err != nil {
		return nil, fmt.Errorf("failed to get config: %w", err)
	}
	defer resp.Body.Close()

	var config struct {
		Paths PathConfigs `json:"paths"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&config); err != nil {
		return nil, fmt.Errorf("failed to decode config: %w", err)
	}

	return config.Paths, nil
}

func (c *Client) GetPathStatuses() ([]PathStatus, error) {
	resp, err := c.client.Get(fmt.Sprintf("%s/v2/paths/list", c.BaseURL))
	if err != nil {
		return nil, fmt.Errorf("failed to get path statuses: %w", err)
	}
	defer resp.Body.Close()

	var statuses struct {
		Items []PathStatus `json:"items"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&statuses); err != nil {
		return nil, fmt.Errorf("failed to decode path statuses: %w", err)
	}

	return statuses.Items, nil
}

func (c *Client) AddPath(name string, config PathConfig) error {
	payload := map[string]PathConfig{
		name: config,
	}

	resp, err := c.client.Post(
		fmt.Sprintf("%s/v2/config/paths/add", c.BaseURL),
		"application/json",
		json.NewEncoder(payload),
	)
	if err != nil {
		return fmt.Errorf("failed to add path: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to add path, status: %d", resp.StatusCode)
	}

	return nil
}

func (c *Client) RemovePath(name string) error {
	req, err := http.NewRequest(
		"POST",
		fmt.Sprintf("%s/v2/config/paths/remove/%s", c.BaseURL, name),
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := c.client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to remove path: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to remove path, status: %d", resp.StatusCode)
	}

	return nil
}
