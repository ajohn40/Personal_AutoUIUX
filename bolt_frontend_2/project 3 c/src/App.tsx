import { useState } from 'react';
import { AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { FileUploader } from './components/FileUploader';
import { FileList } from './components/FileList';
import { AnalysisView } from './components/AnalysisView';
import { ComparisonView } from './components/ComparisonView';
import { Header } from './components/Header';
import { EmptyState } from './components/EmptyState';
import { ServerStatus } from './components/ServerStatus';
import { ImprovementRequestBox } from './components/ImprovementRequestBox';
import { FileData } from './types';
import { ApiService } from './services/api';

function App() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [generatingImprovements, setGeneratingImprovements] = useState(false);
  const [improvementSuggestions, setImprovementSuggestions] = useState<string | null>(null);
  const [improvementError, setImprovementError] = useState<string | null>(null);
  
  const handleFilesAdded = (newFiles: FileData[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setUploadError(null);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter(file => file.id !== id));
    if (files.length === 1) {
      setAnalyzed(false);
    }
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadError(null);
    
    try {
      // Convert FileData back to File objects for upload
      const fileObjects = files.map(fileData => {
        const blob = new Blob([fileData.content], { type: fileData.type });
        return new File([blob], fileData.name, {
          type: fileData.type,
          lastModified: fileData.lastModified
        });
      });

      const response = await ApiService.uploadFiles(fileObjects);
      
      if (response.status === 'success') {
        setUploading(false);
        setAnalyzing(true);
        
        // Simulate analysis process
        setTimeout(() => {
          setAnalyzing(false);
          setAnalyzed(true);
          
          // Add improvement suggestions to files
          setFiles(files.map(file => ({
            ...file,
            improved: true,
            improvements: [
              { type: 'performance', description: 'Files uploaded and processed on server' },
              { type: 'accessibility', description: 'Server-side optimization applied' },
              { type: 'seo', description: 'Content structure improved' }
            ]
          })));
        }, 2000);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      setUploading(false);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      // Provide more specific error messages based on the error type
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setUploadError('Cannot connect to Flask server. Please ensure your Flask server is running on http://localhost:8002 and CORS is properly configured.');
      } else {
        setUploadError(errorMessage);
      }
    }
  };

  const handleImprovementRequest = async (userRequest: string) => {
    if (files.length === 0) {
      setImprovementError('Please upload files first before requesting improvements.');
      return;
    }

    setGeneratingImprovements(true);
    setImprovementError(null);
    setImprovementSuggestions(null);

    try {
      const response = await ApiService.generateImprovements(userRequest, files);
      
      if (response.status === 'success') {
        setImprovementSuggestions(response.suggestions || 'Improvements generated successfully');
      } else {
        throw new Error(response.message || 'Failed to generate improvements');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate improvements';
      setImprovementError(errorMessage);
    } finally {
      setGeneratingImprovements(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Website File Analyzer</h1>
            <p className="text-gray-600">Upload your website files for analysis and AI-powered optimization</p>
          </div>
          <ServerStatus />
        </div>

        {uploadError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{uploadError}</span>
            </div>
          </div>
        )}

        {improvementError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{improvementError}</span>
            </div>
          </div>
        )}

        {improvementSuggestions && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <h3 className="text-green-800 font-medium mb-2">AI Improvement Suggestions Generated</h3>
                <div className="text-green-700 text-sm whitespace-pre-wrap bg-white p-3 rounded border">
                  {improvementSuggestions}
                </div>
              </div>
            </div>
          </div>
        )}

        {files.length === 0 ? (
          <EmptyState onFilesAdded={handleFilesAdded} />
        ) : (
          <div className="space-y-6">
            <ImprovementRequestBox 
              onSubmitRequest={handleImprovementRequest}
              isProcessing={generatingImprovements}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4">
                <FileUploader onFilesAdded={handleFilesAdded} />
                <FileList 
                  files={files} 
                  onRemoveFile={handleRemoveFile} 
                  onAnalyze={handleAnalyze}
                  analyzing={uploading || analyzing}
                  analyzed={analyzed}
                  uploadingToServer={uploading}
                />
              </div>
              
              <div className="lg:col-span-8">
                {uploading ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 h-full">
                    <div className="flex flex-col items-center justify-center h-full py-16">
                      <div className="relative mb-8">
                        <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-3">Uploading to server</h2>
                      <p className="text-gray-500 text-center max-w-md">
                        Sending your files to the Flask backend for processing...
                      </p>
                    </div>
                  </div>
                ) : analyzing ? (
                  <AnalysisView />
                ) : analyzed ? (
                  <ComparisonView files={files} />
                ) : generatingImprovements ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 h-full">
                    <div className="flex flex-col items-center justify-center h-full py-16">
                      <div className="relative mb-8">
                        <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                      </div>
                      <Sparkles className="h-12 w-12 text-purple-500 mb-4" />
                      <h2 className="text-xl font-semibold text-gray-800 mb-3">Generating AI Improvements</h2>
                      <p className="text-gray-500 text-center max-w-md">
                        Our AI is analyzing your files and generating personalized improvement suggestions...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-8 h-full flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-center max-w-md">
                        Upload your files and request AI-powered improvements to get started
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;