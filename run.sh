#!/bin/bash

# Prajanvi Website - Run Script
# This script starts a local server and opens the website in the default browser.

PORT=8000
DIRECTORY=$(dirname "$0")

echo "------------------------------------------------"
echo "Starting Prajanvi Website Server..."
echo "Directory: $DIRECTORY"
echo "Port: $PORT"
echo "------------------------------------------------"

# Kill any existing process on the port (optional, but helpful)
lsof -ti :$PORT | xargs kill -9 2>/dev/null

# Open the browser first (to be ready when the server starts)
echo "Opening your website at http://localhost:$PORT..."
open "http://localhost:$PORT"

# Start the simple Python server
# This will keep running in the terminal. Press Ctrl+C to stop.
python3 -m http.server $PORT --directory "$DIRECTORY"
