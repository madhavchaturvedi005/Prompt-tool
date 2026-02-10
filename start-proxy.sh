#!/bin/bash

echo "🔒 Starting OpenAI Proxy Server..."
echo ""

# Check if .env exists in server directory
if [ ! -f "server/.env" ]; then
    echo "⚠️  Warning: server/.env not found!"
    echo ""
    echo "Please create server/.env with:"
    echo "   OPENAI_API_KEY=sk-your-key-here"
    echo "   PORT=3002"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd server
    npm install express cors dotenv
    cd ..
fi

echo "✅ Starting proxy on port 3002..."
echo ""
node server/openai-proxy.js
