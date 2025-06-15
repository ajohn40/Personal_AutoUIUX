const API_BASE_URL = 'http://localhost:8003';

export interface UploadResponse {
  status: string;
  message: string;
  error?: string;
}

export interface ImprovementResponse {
  status: string;
  message: string;
  suggestions?: string;
  output_path?: string;
  error?: string;
}

export class ApiService {
  static async uploadFiles(files: File[]): Promise<UploadResponse> {
    const formData = new FormData();
    
    files.forEach(file => {
      // Preserve folder structure by using the full path as filename
      const fileName = file.name.startsWith('/') ? file.name.slice(1) : file.name;
      formData.append('files', file, fileName);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Upload failed:', error);
      
      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to Flask server. Please ensure:\n1. Flask server is running on http://localhost:8002\n2. CORS is enabled on your Flask server\n3. Your browser allows mixed content (HTTP requests from HTTPS page)');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to upload files to server');
    }
  }

  static async generateImprovements(userRequest: string, files: any[]): Promise<ImprovementResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-improvements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_request: userRequest,
          files: files.map(file => ({
            name: file.name,
            content: file.content,
            type: file.type
          }))
        }),
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('AI improvement generation failed:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to Flask server for AI processing. Please ensure your Flask server is running.');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to generate AI improvements');
    }
  }

  static async checkServerHealth(): Promise<{ online: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'HEAD',
        mode: 'cors',
        credentials: 'omit'
      });
      return { online: response.ok };
    } catch (error) {
      console.error('Server health check failed:', error);
      
      let errorMessage = 'Unknown connection error';
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to Flask server. Please ensure:\n1. Flask server is running on http://localhost:8002\n2. CORS is enabled on your Flask server\n3. Your browser allows mixed content (HTTP requests from HTTPS page)';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return { online: false, error: errorMessage };
    }
  }
}