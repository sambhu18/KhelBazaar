#!/bin/bash

echo "🚀 Starting E-Commerce Platform..."
echo ""

echo "📦 Installing Backend Dependencies..."
cd backend
npm install
echo ""

echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install
echo ""

echo "🔧 Starting Backend Server (Port 5001)..."
cd ../backend
npm run dev &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 3

echo "🌐 Starting Frontend Server (Port 3000)..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are running!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait