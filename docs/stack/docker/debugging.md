---
title: Debugging
description: Diagnosing and fixing the most common Docker issues — OOM kills, port conflicts, permission errors, networking problems — plus a curated reference of debug commands.
---

# Debugging

Docker problems tend to fall into a small number of repeating patterns. This page covers the most common failure modes and the commands you reach for to diagnose them.

---

## Common Issues

### Container exits immediately

A container that exits the moment it starts usually means PID 1 crashed or the entrypoint command was not found.

```bash
# Check what happened
docker logs mycontainer

# If the container is already removed, run interactively to debug
docker run --rm -it --entrypoint /bin/sh myimage

# Check exit code
docker inspect mycontainer --format '{{.State.ExitCode}}'
# Exit code 1: application error
# Exit code 127: command not found
# Exit code 137: OOM kill (128 + 9)
# Exit code 143: graceful SIGTERM (128 + 15)
```

### OOM killed (exit code 137)

The container exceeded its memory limit and was killed by the kernel OOM killer.

```bash
# Confirm it was OOM killed
docker inspect mycontainer --format '{{.State.OOMKilled}}'
# true = OOM killed

# Check current memory usage of running containers
docker stats --no-stream

# Increase the limit (or fix the memory leak)
docker run --memory 1g myapp
```

### Port already in use

```bash
# Find which process is using the port
sudo lsof -i :8080
sudo ss -tlnp | grep :8080

# Find which container is using it
docker ps --format '{{.Names}} {{.Ports}}' | grep 8080

# Stop the conflicting container
docker stop <container-name>
```

### Permission denied on volume mounts

When a container runs as a non-root user but the bind-mounted directory is owned by root on the host:

```bash
# Check ownership of the mounted directory
ls -la /host/data

# Fix: match the UID inside the container
# If container uses UID 1000:
chown -R 1000:1000 /host/data

# Or: use --user to override at runtime
docker run --user $(id -u):$(id -g) myapp

# Or: in Dockerfile, create the directory and set ownership before USER switch
RUN mkdir -p /app/data && chown 1000:1000 /app/data
USER 1000
```

### Image pull errors

```bash
# 401 Unauthorized
docker login registry.example.com  # re-authenticate

# ECR token expired (tokens expire after 12 hours)
aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

# Manifest not found (image or tag does not exist)
docker pull registry.example.com/myapp:nonexistent-tag  # check tag name

# Network unreachable
docker pull --disable-content-trust nginx  # test with a public image
```

### Container cannot reach other containers (networking)

```bash
# Check if containers are on the same network
docker network inspect bridge
docker network inspect myapp-network

# Container-name DNS only works on custom networks, not default bridge
# Move containers to the same custom network:
docker network connect myapp-network mycontainer

# Test connectivity from inside the container
docker exec mycontainer ping db
docker exec mycontainer curl http://api:8080/health
docker exec mycontainer nslookup db
```

---

## Essential Debug Commands

### Inspect running containers

```bash
# List all containers (including stopped)
docker ps -a

# Show container details: IP, mounts, environment variables, restart policy
docker inspect mycontainer

# Get just the IP address
docker inspect mycontainer --format '{{.NetworkSettings.IPAddress}}'

# Get environment variables
docker inspect mycontainer --format '{{range .Config.Env}}{{.}}\n{{end}}'

# Real-time resource usage
docker stats
docker stats --no-stream  # single snapshot

# Processes inside a container
docker top mycontainer
```

### Logs

```bash
# Stream logs from a running container
docker logs -f mycontainer

# Last 100 lines
docker logs --tail 100 mycontainer

# Logs since a timestamp
docker logs --since 2026-06-20T10:00:00 mycontainer

# Logs with timestamps
docker logs -t mycontainer
```

### Execute commands inside a container

```bash
# Open an interactive shell (if shell is available)
docker exec -it mycontainer /bin/bash
docker exec -it mycontainer /bin/sh  # Alpine or distroless-adjacent

# Run a one-off command
docker exec mycontainer env
docker exec mycontainer ls -la /app
docker exec mycontainer cat /etc/hosts

# Check what files changed from the base image
docker diff mycontainer
```

### Copy files to/from containers

```bash
# Copy from container to host (useful for extracting logs or dumps)
docker cp mycontainer:/app/heapdump.hprof ./heapdump.hprof

# Copy from host to container
docker cp ./config.properties mycontainer:/app/config/
```

### Pause and resume

```bash
# Freeze a container (useful for debugging without losing state)
docker pause mycontainer
docker unpause mycontainer
```

### Disk and image management

```bash
# See disk usage by images, containers, volumes, and build cache
docker system df
docker system df -v  # verbose, per-item breakdown

# Remove stopped containers
docker container prune

# Remove unused images (not referenced by any container)
docker image prune
docker image prune -a  # also remove unused tagged images

# Remove unused volumes
docker volume prune

# Remove everything unused at once (careful!)
docker system prune -a --volumes

# View build cache
docker buildx du
docker buildx prune
```

### Docker events

```bash
# Stream real-time Docker events (start, stop, die, OOMKill, etc.)
docker events

# Filter for a specific container
docker events --filter container=mycontainer

# Filter for OOM kill events
docker events --filter event=oom

# Historical events (last hour)
docker events --since 1h --until 0
```

### Investigating image layers

```bash
# Show layers and sizes
docker history myimage:latest
docker history --no-trunc myimage:latest  # full commands

# Dive into layers interactively (install 'dive' tool)
dive myimage:latest
```
