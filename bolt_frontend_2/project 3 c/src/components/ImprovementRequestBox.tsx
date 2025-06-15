import { useState } from 'react';
import { MessageSquare, Sparkles, Send } from 'lucide-react';

interface ImprovementRequestBoxProps {
  onSubmitRequest: (request: string) => void;
  isProcessing: boolean;
}

export function ImprovementRequestBox({ onSubmitRequest, isProcessing }: ImprovementRequestBoxProps) {
  const [request, setRequest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (request.trim() && !isProcessing) {
      onSubmitRequest(request.trim());
    }
  };

  const suggestionPrompts = [
    "Improve the website's accessibility for users with disabilities",
    "Optimize the site for better mobile responsiveness",
    "Enhance the user experience and navigation flow",
    "Improve the visual design and modern aesthetics",
    "Optimize performance and loading speeds",
    "Make the content more engaging and interactive"
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center mb-4">
        <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">AI Improvement Request</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="improvement-request" className="block text-sm font-medium text-gray-700 mb-2">
            What improvements would you like to make to your website?
          </label>
          <textarea
            id="improvement-request"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="Describe the specific improvements you'd like to see. For example: 'Make the navigation more intuitive', 'Improve color contrast for better accessibility', or 'Add modern animations and micro-interactions'..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            disabled={isProcessing}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-gray-500 mb-2 block w-full">Quick suggestions:</span>
          {suggestionPrompts.map((prompt, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setRequest(prompt)}
              disabled={isProcessing}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <MessageSquare className="h-4 w-4 inline mr-1" />
            AI will analyze your files and generate specific improvement suggestions
          </div>
          
          <button
            type="submit"
            disabled={!request.trim() || isProcessing}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium text-sm flex items-center transition-colors"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Generate Suggestions
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
        <div className="text-xs text-purple-700">
          <p className="font-medium mb-1">How it works:</p>
          <p>Your request and uploaded files will be analyzed by AI to generate specific, actionable improvement suggestions that will be saved to your local system.</p>
        </div>
      </div>
    </div>
  );
}