import { Download, ArrowRight, CheckCircle } from 'lucide-react';
import { FileData } from '../types';

interface ComparisonViewProps {
  files: FileData[];
}

export function ComparisonView({ files }: ComparisonViewProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
        
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
          <Download className="h-4 w-4 mr-2" />
          Export Improved Files
        </button>
      </div>
      
      <div className="mb-8">
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Analysis complete</h3>
            <p className="text-sm text-green-700">
              We've analyzed your files and found several areas for improvement. We've generated optimized versions with better performance, accessibility, and code quality.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Original</h3>
          <div className="bg-gray-100 rounded-lg p-4 h-64 overflow-auto">
            <pre className="text-xs text-gray-800">
              {files[0]?.content.substring(0, 500) || 'No content to display'}
            </pre>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Improved</h3>
          <div className="bg-blue-50 rounded-lg p-4 h-64 overflow-auto">
            <pre className="text-xs text-gray-800">
              {files[0]?.content.substring(0, 500) || 'No content to display'}
              {/* This would contain the improved version */}
            </pre>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Improvement Details</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <h4 className="text-sm font-medium text-gray-800">Performance Improvements</h4>
            </div>
            <ul className="pl-5 space-y-2">
              <li className="text-sm text-gray-600 flex items-start">
                <ArrowRight className="h-4 w-4 text-gray-400 mr-1 shrink-0 mt-0.5" />
                <span>Optimized image size and compression, reducing file size by 45%</span>
              </li>
              <li className="text-sm text-gray-600 flex items-start">
                <ArrowRight className="h-4 w-4 text-gray-400 mr-1 shrink-0 mt-0.5" />
                <span>Minified CSS and JavaScript to improve load times</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <h4 className="text-sm font-medium text-gray-800">Accessibility Enhancements</h4>
            </div>
            <ul className="pl-5 space-y-2">
              <li className="text-sm text-gray-600 flex items-start">
                <ArrowRight className="h-4 w-4 text-gray-400 mr-1 shrink-0 mt-0.5" />
                <span>Added proper alt tags to all images for screen readers</span>
              </li>
              <li className="text-sm text-gray-600 flex items-start">
                <ArrowRight className="h-4 w-4 text-gray-400 mr-1 shrink-0 mt-0.5" />
                <span>Improved color contrast for better readability</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <h4 className="text-sm font-medium text-gray-800">SEO Optimizations</h4>
            </div>
            <ul className="pl-5 space-y-2">
              <li className="text-sm text-gray-600 flex items-start">
                <ArrowRight className="h-4 w-4 text-gray-400 mr-1 shrink-0 mt-0.5" />
                <span>Added proper meta tags for better search engine visibility</span>
              </li>
              <li className="text-sm text-gray-600 flex items-start">
                <ArrowRight className="h-4 w-4 text-gray-400 mr-1 shrink-0 mt-0.5" />
                <span>Improved semantic HTML structure</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}