#!/bin/bash

# Check if .env file exists, if not create it from .env.example
if [ ! -f ".env" ]; then
  echo "Creating .env file from .env.example..."
  cp .env.example .env
fi

# Get port and host from .env file or use defaults
if [ -f ".env" ]; then
  PORT=$(cat .env | grep PORT | cut -d '=' -f2)
  HOST=$(cat .env | grep HOST | cut -d '=' -f2)
fi
PORT=${PORT:-3001}
HOST=${HOST:-http://localhost}

# Kill any existing node processes on the port
echo "Checking for existing processes on port $PORT..."
pid=$(lsof -t -i:$PORT)
if [ ! -z "$pid" ]; then
  echo "Killing process $pid on port $PORT"
  kill -9 $pid
fi

# Start the server
echo "Starting mock server on $HOST:$PORT..."
node server.js
