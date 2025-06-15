import { File, Trash2, RefreshCw, CheckCircle, Upload, AlertCircle } from 'lucide-react';
import { FileData } from '../types';
import { formatFileSize } from '../utils/fileHelpers';

interface FileListProps {
  files: FileData[];
  onRemoveFile: (id: string) => void;
  onAnalyze: () => void;
  analyzing: boolean;
  analyzed: boolean;
  uploadingToServer?: boolean;
}

export function FileList({ files, onRemoveFile, onAnalyze, analyzing, analyzed, uploadingToServer }: FileListProps) {
  const getFileIcon = (fileType: string) => {
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const getButtonContent = () => {
    if (uploadingToServer) {
      return (
        <>
          <Upload className="h-4 w-4 mr-2 animate-pulse" />
          Uploading to Server...
        </>
      );
    }
    
    if (analyzing) {
      return (
        <>
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Analyzing...
        </>
      );
    }
    
    if (analyzed) {
      return (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Re-upload & Analyze
        </>
      );
    }
    
    return (
      <>
        <Upload className="h-4 w-4 mr-2" />
        Analyze & Upload
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Files Ready for Upload</h2>
      
      <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
        {files.map((file) => (
          <div 
            key={file.id} 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              {getFileIcon(file.type)}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              {file.improved && (
                <span className="ml-3 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  Uploaded
                </span>
              )}
            </div>
            
            <button 
              onClick={() => onRemoveFile(file.id)}
              className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              aria-label={`Remove ${file.name}`}
              disabled={analyzing || uploadingToServer}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500">
          {files.length} {files.length === 1 ? 'file' : 'files'}
        </p>
        
        <button
          onClick={onAnalyze}
          disabled={files.length === 0 || analyzing || uploadingToServer}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm flex items-center ${
            analyzed 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {getButtonContent()}
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">Flask Backend Integration</p>
            <p>Files will be uploaded to your Flask server at localhost:8002 and stored in web_content/devportfolio/</p>
          </div>
        </div>
      </div>
    </div>
  );
}