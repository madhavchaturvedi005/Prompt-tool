#!/bin/bash

echo "🚀 Starting Qdrant Backend Server..."
echo ""
echo "📝 Make sure your .env file has:"
echo "   - VITE_QDRANT_URL"
echo "   - VITE_QDRANT_API_KEY"
echo "   - VITE_OPENAI_API_KEY"
echo ""
echo "🔧 Starting server on port 3001..."
echo ""

npm run qdrant-server
