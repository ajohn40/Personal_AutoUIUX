import { RefreshCw } from 'lucide-react';

export function AnalysisView() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 h-full">
      <div className="flex flex-col items-center justify-center h-full py-16">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Analyzing your files</h2>
        <p className="text-gray-500 text-center max-w-md mb-8">
          We're scanning your files for potential improvements in performance, accessibility, SEO, and design.
        </p>
        
        <div className="w-full max-w-md">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Checking HTML structure</span>
                <span className="text-sm text-blue-500 flex items-center">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  In progress
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-3/4 transition-all duration-1000"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Optimizing CSS</span>
                <span className="text-sm text-gray-500">Waiting</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-300 h-2 rounded-full w-0"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Improving JavaScript</span>
                <span className="text-sm text-gray-500">Waiting</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-300 h-2 rounded-full w-0"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Optimizing assets</span>
                <span className="text-sm text-gray-500">Waiting</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-300 h-2 rounded-full w-0"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}