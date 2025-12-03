"""
Quick test script for the agent workflow.
Run this to test the multi-agent workflow without starting Django.
"""

import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents import process_scribble


def test_agent_workflow(image_path: str):
    """
    Test the complete agent workflow with a sample image.
    
    Args:
        image_path: Path to test image
    """
    if not os.path.exists(image_path):
        print(f"❌ Image not found: {image_path}")
        return
    
    print(f"Testing agent workflow with: {image_path}")
    print("="*60)
    
    # Run the workflow
    result = process_scribble(image_path, max_retries=3)
    
    # Display results
    print("\n" + "="*60)
    print("FINAL RESULTS")
    print("="*60)
    print(f"Status: {result.get('status')}")
    print(f"Type: {result.get('scribble_type')}")
    print(f"Type Confidence: {result.get('type_confidence', 0.0):.2f}")
    print(f"Validation Score: {result.get('validation_score', 0.0):.2f}")
    print(f"Retry Count: {result.get('retry_count', 0)}")
    print(f"Model Used: {result.get('model_used')}")
    
    print(f"\n--- Converted Output ---")
    print(result.get('converted_output', 'No output'))
    
    if result.get('feedback'):
        print(f"\n--- Validator Feedback ---")
        print(result.get('feedback'))
    
    if result.get('errors'):
        print(f"\n--- Errors ---")
        for error in result.get('errors', []):
            print(f"  • {error}")
    
    print("="*60)
    
    return result


if __name__ == "__main__":
    # Test with a sample image
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
    else:
        # Try to find a test image
        test_dirs = [
            "media/uploads",
            "test_outputs",
            "."
        ]
        
        image_path = None
        for test_dir in test_dirs:
            if os.path.exists(test_dir):
                files = [f for f in os.listdir(test_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
                if files:
                    image_path = os.path.join(test_dir, files[0])
                    break
        
        if not image_path:
            print("Usage: python test_agent_workflow.py <path_to_image>")
            print("\nNo test images found. Please provide an image path.")
            sys.exit(1)
    
    test_agent_workflow(image_path)
