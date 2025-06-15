import argparse
import json
import os
import tempfile
from datetime import datetime

from agent import PromptAgent
from agent.prompts.prompt_constructor import CoTPromptConstructorBgym
from llms.tokenizers import Tokenizer
from llms import call_llm, lm_config

class AIImprovementGenerator:
    def __init__(self):
        # Configuration
        self.PROMPT_JSON = "/Users/sniperjohn40/AutoUIUX_SAIL/NNetnav/src/agent/prompts/jsons/p_feedback_from_persona_feedback_AJ.json"
        self.MODEL = "gpt-4o"
        self.PROVIDER = "openai"
        self.OUTPUT_BASE_PATH = "/Users/sniperjohn40/AutoUIUX_SAIL/NNetnav/"
        
        # Setup args
        self.args = argparse.Namespace()
        self.args.provider = self.PROVIDER
        self.args.model = self.MODEL
        self.args.temperature = 0.7
        self.args.top_p = 0.9
        self.args.context_length = 0
        self.args.max_tokens = 1024
        self.args.stop_token = None
        self.args.max_retry = 3
        self.args.action_set_tag = "id_accessibility_tree"
        self.args.mode = "chat"
        self.args.max_obs_length = 16000
        
        # Create config object for llm call
        self.llm_cfg = lm_config.construct_llm_config(self.args)
        self.tokenizer = Tokenizer(self.args.provider, self.args.model)
        
        # Initialize prompt constructor
        self.prompt_constructor = CoTPromptConstructorBgym(self.PROMPT_JSON, self.llm_cfg, self.tokenizer)
    
    def generate_improvements(self, user_request, files_data):
        """
        Generate AI-powered improvement suggestions based on user request and uploaded files
        """
        try:
            # Create a summary of the uploaded files
            files_summary = self._create_files_summary(files_data)
            
            # Build observation data
            obs = {
                "axtree_txt": files_summary,
                "url": "http://localhost:8002",
                "goal": f"Website Improvement Request: {user_request}"
            }
            
            # Build metadata
            meta_data = {
                "person_description": f"A web developer seeking to improve their website with the following request: {user_request}",
                "action_history": ["Uploaded files for analysis"],
                "trajectory": f"1: User uploaded {len(files_data)} files\n2: User requested: {user_request}",
                "user_request": user_request,
                "files_info": files_summary
            }
            
            # Generate prompt and call LLM
            prompt = self.prompt_constructor.construct(obs, meta_data)
            response, usage = call_llm(self.llm_cfg, prompt)
            
            # Generate output filename with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_filename = f"UX_IMPROVEMENT_SUGGESTIONS_{timestamp}.txt"
            output_path = os.path.join(self.OUTPUT_BASE_PATH, output_filename)
            
            # Save response to file
            with open(output_path, "w", encoding='utf-8') as f:
                f.write(f"AI IMPROVEMENT SUGGESTIONS\n")
                f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"User Request: {user_request}\n")
                f.write(f"Files Analyzed: {len(files_data)}\n")
                f.write("=" * 80 + "\n\n")
                f.write(response)
                f.write(f"\n\n" + "=" * 80)
                f.write(f"\nFiles Summary:\n{files_summary}")
            
            return {
                'status': 'success',
                'suggestions': response,
                'output_path': output_path,
                'message': f'AI suggestions generated and saved to {output_path}'
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Failed to generate improvements: {str(e)}',
                'error': str(e)
            }
    
    def _create_files_summary(self, files_data):
        """Create a summary of uploaded files for AI analysis"""
        summary = "UPLOADED FILES ANALYSIS:\n\n"
        
        for i, file_info in enumerate(files_data, 1):
            summary += f"{i}. File: {file_info.get('name', 'Unknown')}\n"
            summary += f"   Type: {file_info.get('type', 'Unknown')}\n"
            
            content = file_info.get('content', '')
            if content and content != '[Binary file - content not displayed]':
                # Truncate content if too long
                if len(content) > 1000:
                    summary += f"   Content Preview: {content[:1000]}...\n"
                else:
                    summary += f"   Content: {content}\n"
            else:
                summary += f"   Content: [Binary or non-text file]\n"
            
            summary += "\n"
        
        return summary

# Global instance for Flask integration
ai_generator = AIImprovementGenerator()

def generate_ai_improvements(user_request, files_data):
    """Function to be called from Flask server"""
    return ai_generator.generate_improvements(user_request, files_data)

if __name__ == "__main__":
    # Test the generator
    test_files = [
        {
            'name': 'index.html',
            'type': 'text/html',
            'content': '<html><head><title>Test</title></head><body><h1>Hello World</h1></body></html>'
        }
    ]
    
    result = generate_ai_improvements("Improve accessibility and modern design", test_files)
    print(json.dumps(result, indent=2))