# Troubleshooting Guide

## Common Issues

### Service Health

#### RTSP Server Not Starting

1. Check logs:
```bash
docker compose logs rtsp-server
```

2. Verify ports:
```bash
netstat -tulpn | grep 8554
```

3. Check configuration:
```bash
cat services/rtsp-server/mediamtx.yml
```

#### Annotation Service Errors

1. Check MongoDB connection:
```bash
docker compose exec annotation-service npm run check-db
```

2. Verify Redis:
```bash
docker compose exec redis redis-cli ping
```

3. Check logs:
```bash
docker compose logs annotation-service
```

### Network Issues

#### API Gateway Connection Refused

1. Check Nginx status:
```bash
docker compose exec api-gateway nginx -t
```

2. Verify SSL certificates:
```bash
openssl x509 -in services/api-gateway/ssl/server.crt -text
```

3. Check configurations:
```bash
docker compose exec api-gateway cat /etc/nginx/nginx.conf
```

#### WebSocket Connection Failed

1. Check WebSocket endpoint:
```bash
curl -v -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://localhost:8080/ws
```

2. Verify Nginx WebSocket configuration:
```bash
grep -r "proxy_set_header Upgrade" services/api-gateway/
```

### Performance Issues

#### High CPU Usage

1. Check container stats:
```bash
docker stats
```

2. Profile services:
```bash
# Go pprof for RTSP server
go tool pprof http://localhost:9997/debug/pprof/profile

# Node.js profiling
node --prof annotation-service/dist/index.js
```

#### Memory Leaks

1. Monitor memory:
```bash
docker stats --format "table {{.Name}}\t{{.MemUsage}}"
```

2. Check for memory leaks:
```bash
# Node.js heap snapshot
node --inspect annotation-service/dist/index.js
```

### Storage Issues

#### MongoDB Disk Space

1. Check disk usage:
```bash
docker compose exec mongodb mongo --eval "db.stats()"
```

2. Clean old data:
```bash
# Create cleanup script
docker compose exec mongodb mongo cleanup.js
```

#### Stream Storage Full

1. Check disk usage:
```bash
du -sh /path/to/stream/storage
```

2. Clean old recordings:
```bash
./scripts/cleanup-streams.sh
```

## Monitoring Alerts

### High Error Rate

1. Check error logs:
```bash
grep ERROR /var/log/rtap/*.log
```

2. View Grafana dashboard:
   - Error rate panel
   - Service status panel

3. Check Prometheus alerts:
```bash
curl -s localhost:9090/api/v1/alerts
```

### Service Latency

1. Check service metrics:
```bash
curl localhost:9090/api/v1/query?query=http_request_duration_seconds
```

2. Monitor network:
```bash
docker compose exec api-gateway nginx -v
```

## Recovery Procedures

### Service Recovery

1. Restart service:
```bash
docker compose restart <service>
```

2. Verify health:
```bash
./scripts/wait-for-services.sh
```

### Data Recovery

1. Restore MongoDB:
```bash
./scripts/restore-mongo.sh <backup-file>
```

2. Restore stream data:
```bash
./scripts/restore-streams.sh <backup-dir>
```

### System Recovery

1. Full system restart:
```bash
docker compose down
docker compose up -d
```

2. Verify system:
```bash
./scripts/verify-system.sh
```

## Debug Mode

### Enable Debug Logging

1. RTSP Server:
```yaml
# mediamtx.yml
logLevel: debug
```

2. Annotation Service:
```bash
export DEBUG=rtap:*
```

3. API Gateway:
```nginx
error_log /var/log/nginx/error.log debug;
```

### Debug Tools

1. Network debugging:
```bash
tcpdump -i any port 8554 -w capture.pcap
```

2. API testing:
```bash
curl -v -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/health
```

3. WebSocket testing:
```bash
websocat ws://localhost:8080/ws
