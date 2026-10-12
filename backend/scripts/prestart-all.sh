#!/usr/bin/env bash
# Free the ports used by the backend + MCP before starting.
fuser -k 3001/tcp 2>/dev/null || true
fuser -k 8794/tcp 2>/dev/null || true
sleep 0.3
