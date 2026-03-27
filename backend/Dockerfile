# Backend Dockerfile for FarmDrive
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=main.py \
    FLASK_ENV=production

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy required files and install python dependencies
COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

# Make the start script executable
RUN chmod +x start.sh

# Expose the Flask default port
EXPOSE 5000

# Start the service using the start script (initializes DB then runs Gunicorn)
CMD ["./start.sh"]
