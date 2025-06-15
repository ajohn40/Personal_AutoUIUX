#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create a zip file with all the source files
function createDownloadPackage() {
  const output = fs.createWriteStream('file-improver-app.zip');
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
  });

  output.on('close', function() {
    console.log('✅ Package created: file-improver-app.zip');
    console.log(`📦 Total size: ${archive.pointer()} bytes`);
    console.log('\n📋 To run locally:');
    console.log('1. Extract the zip file');
    console.log('2. cd into the extracted folder');
    console.log('3. npm install');
    console.log('4. npm run dev');
    console.log('\n🔧 Make sure your Flask server is running on localhost:8002');
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  // Add all source files
  const filesToInclude = [
    'package.json',
    'package-lock.json',
    'vite.config.ts',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'tailwind.config.js',
    'postcss.config.js',
    'eslint.config.js',
    'index.html',
    'src/',
    '.gitignore'
  ];

  filesToInclude.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      if (fs.statSync(fullPath).isDirectory()) {
        archive.directory(fullPath, file);
      } else {
        archive.file(fullPath, { name: file });
      }
    }
  });

  // Add README with instructions
  const readme = `# File Improver App

A React-based file analysis interface that integrates with your Flask backend.

## Setup Instructions

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Make sure your Flask server is running:**
   - Your Flask server should be running on \`localhost:8002\`
   - The app will automatically check server status and show connection status

## Features

- Drag and drop file upload
- Real-time server status monitoring
- File analysis and improvement suggestions
- Integration with Flask backend for file processing

## Flask Backend Integration

The app expects your Flask server to be running with the following endpoints:
- \`POST /upload\` - For file uploads
- \`GET /\` - For health checks

Make sure CORS is enabled on your Flask server if you encounter any cross-origin issues.

## Building for Production

To build the app for production:

\`\`\`bash
npm run build
\`\`\`

The built files will be in the \`dist/\` directory.
`;

  archive.append(readme, { name: 'README.md' });

  archive.finalize();
}

createDownloadPackage();