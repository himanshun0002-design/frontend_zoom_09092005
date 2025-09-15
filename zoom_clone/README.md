# Zoom Clone - Video Chat Application

A real-time video chat application built with Django, Django Channels, and WebRTC.

## Features

- Text chat functionality
- Video chat using WebRTC
- Real-time communication with WebSockets

## Tech Stack

- Backend: Django, Django Channels, Django REST Framework
- WebSockets: Django Channels (ASGI)
- Database: PostgreSQL (production), SQLite (development)
- Deployment: Render

## Deployment on Render

This application is configured for easy deployment on Render.com.

### Prerequisites

1. Create a Render account at [render.com](https://render.com)
2. Fork or clone this repository to your GitHub account

### Deployment Steps

1. **Connect your GitHub repository to Render**
   - In your Render dashboard, click "New" and select "Blueprint"
   - Connect your GitHub account and select this repository
   - Render will automatically detect the `render.yaml` configuration

2. **Configure Environment Variables**
   - Render will create the necessary services based on the `render.yaml` file
   - Add the following environment variables in the Render dashboard:
     - `SECRET_KEY`: A secure random string for Django
     - `DEBUG`: Set to "False" for production
     - `RENDER_EXTERNAL_HOSTNAME`: Your Render app URL (automatically set by Render)

3. **Deploy**
   - Render will automatically deploy your application
   - The build process will:
     - Install dependencies from `requirements.txt`
     - Run database migrations
     - Collect static files
     - Start the Daphne ASGI server

### Manual Deployment

If you prefer to deploy manually:

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure the following settings:
   - **Environment**: Python
   - **Build Command**: `./build.sh`
   - **Start Command**: `daphne -p $PORT -b 0.0.0.0 zoom_clone.asgi:application`
   - Add the required environment variables

4. Create a PostgreSQL database in Render and link it to your web service

## Local Development

1. Clone the repository
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Create a `.env` file based on `.env.sample`
6. Run migrations: `python manage.py migrate`
7. Start the development server: `python manage.py runserver`

## WebSocket Endpoints

- Text Chat: `ws://<domain>/ws/chat/<room_name>/`
- Video Chat: `ws://<domain>/ws/video/<room_name>/`