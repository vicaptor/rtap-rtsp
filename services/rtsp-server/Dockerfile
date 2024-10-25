FROM alpine:3.18

# Install MediaMTX dependencies
RUN apk add --no-cache \
    ffmpeg \
    openssl

# Download and install MediaMTX
RUN wget https://github.com/bluenviron/mediamtx/releases/latest/download/mediamtx_linux_amd64.tar.gz && \
    tar -xvf mediamtx_linux_amd64.tar.gz && \
    mv mediamtx /usr/local/bin/ && \
    rm mediamtx_linux_amd64.tar.gz

# Create config directory
RUN mkdir -p /etc/mediamtx

# Copy configuration
COPY mediamtx.yml /etc/mediamtx/

EXPOSE 8554 1935 8888

CMD ["/usr/local/bin/mediamtx", "/etc/mediamtx/mediamtx.yml"]
