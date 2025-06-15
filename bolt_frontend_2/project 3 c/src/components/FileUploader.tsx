import { Upload, Plus, Folder } from 'lucide-react';
import { useState } from 'react';
import { FileData } from '../types';
import { generateFileId } from '../utils/fileHelpers';

interface FileUploaderProps {
  onFilesAdded: (files: FileData[]) => void;
}

export function FileUploader({ onFilesAdded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (fileList: File[]) => {
    const processedFiles = await Promise.all(
      fileList.map(async (file) => {
        try {
          const content = await file.text();
          return {
            id: generateFileId(),
            name: file.webkitRelativePath || file.name, // Use webkitRelativePath for folder structure
            type: file.type,
            size: file.size,
            content,
            lastModified: file.lastModified,
          };
        } catch (error) {
          // Handle binary files or files that can't be read as text
          return {
            id: generateFileId(),
            name: file.webkitRelativePath || file.name,
            type: file.type,
            size: file.size,
            content: '[Binary file - content not displayed]',
            lastModified: file.lastModified,
          };
        }
      })
    );
    onFilesAdded(processedFiles);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const items = Array.from(e.dataTransfer.items);
    const files: File[] = [];

    // Process dropped items (supports folders)
    for (const item of items) {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          await processEntry(entry, files);
        }
      }
    }

    if (files.length > 0) {
      handleFiles(files);
    }
  };

  // Recursively process folder entries
  const processEntry = async (entry: any, files: File[]): Promise<void> => {
    if (entry.isFile) {
      const file = await new Promise<File>((resolve) => {
        entry.file((file: File) => {
          // Create a new file with the full path
          const newFile = new File([file], entry.fullPath, {
            type: file.type,
            lastModified: file.lastModified
          });
          resolve(newFile);
        });
      });
      files.push(file);
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const entries = await new Promise<any[]>((resolve) => {
        reader.readEntries((entries: any[]) => {
          resolve(entries);
        });
      });
      
      for (const childEntry of entries) {
        await processEntry(childEntry, files);
      }
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl p-6 shadow-sm border-2 ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-transparent'
      } transition-all mb-6`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <Upload className={`h-8 w-8 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          <p className="text-sm text-gray-500 mb-3">
            {isDragging ? 'Drop files or folders here' : 'Drag and drop files or entire folders here'}
          </p>
          <div className="flex gap-2 justify-center">
            <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors inline-flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Add Files
              <input 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleFileChange}
                accept=".html,.css,.js,.jsx,.ts,.tsx,.jpg,.jpeg,.png,.svg,.webp,.json,.md,.txt"
              />
            </label>
            
            <label className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors inline-flex items-center">
              <Folder className="h-4 w-4 mr-1" />
              Select Folder
              <input 
                type="file" 
                multiple 
                webkitdirectory=""
                className="hidden" 
                onChange={handleFolderChange}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}