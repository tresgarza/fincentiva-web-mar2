#!/bin/bash
export NODE_ENV=development
export PORT=3000
export CORS_ORIGIN=http://localhost:5173

# Install dependencies if needed
npm install

# Start the server
npm run dev 