# File Improver App - Local Hosting Guide

A React-based file analysis interface that integrates with your Flask backend.

## Quick Start

1. **Download the source code:**
   - All source files are available in this project
   - You can copy the entire `src/` folder and configuration files

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Make sure your Flask server is running:**
   - Your Flask server should be running on `localhost:8002`
   - The app will automatically check server status

## Files You Need

### Core Application Files:
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `index.html` - Main HTML file
- `src/` - All React components and logic

### Source Code Structure:
```
src/
├── App.tsx                 # Main application component
├── main.tsx               # Application entry point
├── index.css              # Global styles
├── types.ts               # TypeScript type definitions
├── components/
│   ├── Header.tsx         # App header with navigation
│   ├── FileUploader.tsx   # File upload component
│   ├── FileList.tsx       # File management component
│   ├── AnalysisView.tsx   # Analysis progress view
│   ├── ComparisonView.tsx # Results comparison view
│   ├── EmptyState.tsx     # Empty state component
│   └── ServerStatus.tsx   # Flask server status indicator
├── services/
│   └── api.ts             # API service for Flask integration
└── utils/
    └── fileHelpers.ts     # File utility functions
```

## Flask Backend Integration

The app expects your Flask server to have:
- `POST /upload` endpoint for file uploads
- CORS enabled for cross-origin requests
- Running on `localhost:8002`

### Adding CORS to Your Flask Server:

```python
from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Your existing code...
```

## Building for Production

To build the app for production hosting:

```bash
npm run build
```

The built files will be in the `dist/` directory and can be served by any static file server.

## Environment Configuration

The app is configured to connect to your Flask server at `http://localhost:8002`. If you need to change this:

1. Edit `src/services/api.ts`
2. Change the `API_BASE_URL` constant to your server's URL

## Features

- ✅ Drag and drop file upload
- ✅ Real-time server status monitoring  
- ✅ File analysis and improvement suggestions
- ✅ Integration with Flask backend
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Modern React with hooks