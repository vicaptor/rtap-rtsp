GO=go
BINARY_NAME=rtsp-server
BUILD_DIR=build

.PHONY: all build clean test run

all: clean build test

build:
	@echo "Building RTSP server..."
	@mkdir -p $(BUILD_DIR)
	$(GO) build -o $(BUILD_DIR)/$(BINARY_NAME) ./src

clean:
	@echo "Cleaning..."
	@rm -rf $(BUILD_DIR)
	@go clean

test:
	@echo "Running tests..."
	$(GO) test ./... -v

run: build
	@echo "Running RTSP server..."
	./$(BUILD_DIR)/$(BINARY_NAME)

deps:
	@echo "Downloading dependencies..."
	$(GO) mod download

tidy:
	@echo "Tidying dependencies..."
	$(GO) mod tidy
