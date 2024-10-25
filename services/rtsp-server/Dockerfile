FROM golang:1.21-alpine

WORKDIR /app

# Install required dependencies
RUN apk add --no-cache gcc musl-dev

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN go build -o main .

# Expose RTSP and HLS ports
EXPOSE 8554 8888

CMD ["./main"]
