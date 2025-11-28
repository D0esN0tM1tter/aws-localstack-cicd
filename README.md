# Todo App with Flask and AWS LocalStack

A simple todo application with a Flask API backend and HTML/CSS/JavaScript frontend, using AWS S3 (via LocalStack) for storage.

## Features

- ✅ Add new todos with title, description, and priority
- 📋 View all todos in a clean, responsive interface
- 🔄 Auto-refresh and manual refresh functionality
- 🎨 Modern, gradient-based design
- 🐳 Docker containerized application
- ☁️ AWS S3 storage simulation with LocalStack

## Architecture

- **Backend**: Flask API with AWS S3 storage
- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **Storage**: LocalStack S3 bucket simulation
- **Containerization**: Docker and Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your system

### Running the Application

1. Clone the repository and navigate to the project directory

2. Start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - **Web Interface**: Open your browser and go to `http://localhost:5000`
   - **API Endpoints**: 
     - GET `http://localhost:5000/todos` - Get all todos
     - POST `http://localhost:5000/todos` - Add a new todo

### Using the Web Interface

1. **Adding Todos**: Fill out the form with:
   - Title (required)
   - Description (optional)
   - Priority (Low, Medium, High)
   
2. **Viewing Todos**: All todos are displayed below the form with:
   - Title and description
   - Priority badge with color coding
   - Unique ID

3. **Refreshing**: Click the refresh button or wait for auto-refresh (every 30 seconds)

### API Usage

#### Add a Todo
```bash
curl -X POST http://localhost:5000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Need to buy milk, bread, and eggs",
    "priority": "high"
  }'
```

#### Get All Todos
```bash
curl http://localhost:5000/todos
```

## Project Structure

```
├── app.py                 # Flask application and API routes
├── templates/
│   └── index.html        # HTML frontend template
├── static/
│   ├── style.css         # CSS styles
│   └── app.js            # JavaScript frontend logic
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile           # Docker container definition
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Technology Stack

- **Python 3.9+**
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Boto3** - AWS SDK for Python
- **LocalStack** - Local AWS cloud stack
- **Docker** - Containerization

## Development

### Local Development (without Docker)

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start LocalStack separately:
   ```bash
   docker run --rm -it -p 4566:4566 localstack/localstack
   ```

3. Run the Flask app:
   ```bash
   python app.py
   ```

### Customization

- **Styling**: Modify `static/style.css` for design changes
- **Frontend Logic**: Update `static/app.js` for functionality changes
- **API Endpoints**: Extend `app.py` for additional features
- **Layout**: Modify `templates/index.html` for structure changes

## Notes

- The application uses LocalStack to simulate AWS S3 locally
- Todos are stored as JSON objects in an S3 bucket
- The frontend automatically handles API communication
- CORS is enabled for cross-origin requests
- The application is responsive and mobile-friendly
