import { Upload, Folder } from 'lucide-react';
import { FileData } from '../types';
import { generateFileId } from '../utils/fileHelpers';

interface EmptyStateProps {
  onFilesAdded: (files: FileData[]) => void;
}

export function EmptyState({ onFilesAdded }: EmptyStateProps) {
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
            name: file.webkitRelativePath || file.name,
            type: file.type,
            size: file.size,
            content,
            lastModified: file.lastModified,
          };
        } catch (error) {
          // Handle binary files
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

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div 
        className="w-full max-w-3xl h-80 border-2 border-dashed border-gray-300 rounded-xl bg-white p-12 flex flex-col items-center justify-center transition-all hover:border-blue-400 cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Upload className="h-10 w-10 text-blue-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Drop your website files or folders here</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Drag and drop individual files, or entire project folders. We'll analyze them and upload to your Flask server.
        </p>
        <div className="flex gap-3">
          <label className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors inline-flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Select Files
            <input 
              type="file" 
              multiple 
              className="hidden" 
              onChange={handleFileChange}
              accept=".html,.css,.js,.jsx,.ts,.tsx,.jpg,.jpeg,.png,.svg,.webp,.json,.md,.txt"
            />
          </label>
          
          <label className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors inline-flex items-center">
            <Folder className="h-4 w-4 mr-2" />
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
  );
}