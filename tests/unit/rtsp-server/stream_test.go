package rtsp_test

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/vicaptor/rtap-rtsp/services/rtsp-server/src/mediamtx"
)

func TestStreamManagement(t *testing.T) {
	client := mediamtx.NewClient("http://localhost:9997")

	t.Run("Add Stream", func(t *testing.T) {
		config := mediamtx.PathConfig{
			Source:         "rtsp://example.com/stream",
			SourceProtocol: "rtsp",
			RunOnDemand:    "yes",
		}

		err := client.AddPath("test_stream", config)
		assert.NoError(t, err)
	})

	t.Run("Get Stream Status", func(t *testing.T) {
		time.Sleep(2 * time.Second) // Wait for stream to start
		
		paths, err := client.GetPathStatuses()
		assert.NoError(t, err)
		
		found := false
		for _, path := range paths {
			if path.Name == "test_stream" {
				found = true
				assert.Equal(t, "rtsp://example.com/stream", path.Source)
				break
			}
		}
		assert.True(t, found)
	})

	t.Run("Remove Stream", func(t *testing.T) {
		err := client.RemovePath("test_stream")
		assert.NoError(t, err)

		paths, err := client.GetPathStatuses()
		assert.NoError(t, err)
		
		found := false
		for _, path := range paths {
			if path.Name == "test_stream" {
				found = true
				break
			}
		}
		assert.False(t, found)
	})
}
