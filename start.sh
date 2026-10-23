#!/bin/bash

# E-Ayurvedic Health Assistant Launcher for Linux / macOS
echo "==========================================================="
echo "        🌿 E-Ayurvedic Health Assistant Launcher 🌿"
echo "==========================================================="
echo ""

# Ensure local node binary is in PATH if installed in user space
export PATH=$HOME/.local/bin:$HOME/.local/node-v22.14.0-linux-x64/bin:$PATH

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not found in PATH."
    echo "Please install Node.js (v18+) from https://nodejs.org/"
    exit 1
fi

echo "[OK] Node.js $(node -v) detected."
echo ""

# Check dependencies
if [ ! -d "server/node_modules" ]; then
    echo "[1/3] Installing backend dependencies..."
    (cd server && npm install)
fi

if [ ! -d "client/node_modules" ]; then
    echo "[2/3] Installing frontend dependencies..."
    (cd client && npm install)
fi

echo "[3/3] Starting backend and frontend..."

# Start Backend
(cd server && npm start) &
SERVER_PID=$!

# Start Frontend
(cd client && npx vite --host 0.0.0.0 --port 5173) &
CLIENT_PID=$!

sleep 3

# Try opening in browser
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173 &
elif command -v open &> /dev/null; then
    open http://localhost:5173 &
fi

echo ""
echo "==========================================================="
echo "   Application is running!"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend:  http://localhost:5000"
echo "   Press Ctrl+C to stop both servers."
echo "==========================================================="

trap "kill $SERVER_PID $CLIENT_PID; exit" SIGINT SIGTERM
wait
