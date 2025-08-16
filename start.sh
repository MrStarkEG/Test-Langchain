#!/bin/bash

# Backend startup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000 &

# Frontend startup  
cd ../frontend
npm install
npm run dev &

echo "Backend running on http://localhost:8000"
echo "Frontend running on http://localhost:3000"
wait