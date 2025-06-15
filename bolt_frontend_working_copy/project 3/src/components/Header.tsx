import { FileCode, Zap } from 'lucide-react';
import { ServerStatus } from './ServerStatus';

export function Header() {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-semibold text-gray-900">FileImprover</h1>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Flask Integration</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <ServerStatus />
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors text-sm font-medium">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors text-sm font-medium">
                  History
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors text-sm font-medium">
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}