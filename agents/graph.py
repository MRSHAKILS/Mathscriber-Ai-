"""
LangGraph workflow definition for scribble conversion.
Connects ClassifierAgent, ConverterAgent, and ValidatorAgent with conditional retry logic.
"""

from typing import Literal
from langgraph.graph import StateGraph, END
from .state import ScribbleState
from .classifier import classify_scribble_sync
from .converter import convert_scribble_sync
from .validator import validate_conversion_sync


def classify_node(state: ScribbleState) -> ScribbleState:
    """Node that runs the classifier agent."""
    print("\n🔍 Running ClassifierAgent...")
    result = classify_scribble_sync(state)
    return {**state, **result}


def convert_node(state: ScribbleState) -> ScribbleState:
    """Node that runs the converter agent."""
    retry_count = state.get("retry_count", 0)
    print(f"\n🔄 Running ConverterAgent (attempt {retry_count + 1})...")
    result = convert_scribble_sync(state)
    return {**state, **result}


def validate_node(state: ScribbleState) -> ScribbleState:
    """Node that runs the validator agent."""
    print("\n✓ Running ValidatorAgent...")
    result = validate_conversion_sync(state)
    return {**state, **result}


def should_retry(state: ScribbleState) -> Literal["convert", "end"]:
    """
    Conditional edge: decide whether to retry conversion or end.
    
    Retry if:
    - Validation score < threshold (0.7)
    - Retry count < max_retries (3)
    - No critical errors
    """
    validation_score = state.get("validation_score", 0.0)
    retry_count = state.get("retry_count", 0)
    max_retries = state.get("max_retries", 3)
    status = state.get("status", "")
    
    # Don't retry if there are critical errors
    if status == "error":
        print(f"\n⚠️ Critical error encountered. Ending workflow.")
        return "end"
    
    # Check if we should retry
    threshold = 0.7
    if validation_score < threshold and retry_count < max_retries:
        print(f"\n🔁 Validation score ({validation_score:.2f}) below threshold ({threshold}). Retrying... ({retry_count + 1}/{max_retries})")
        # Increment retry count
        state["retry_count"] = retry_count + 1
        return "convert"
    
    if validation_score >= threshold:
        print(f"\n✅ Validation score ({validation_score:.2f}) meets threshold. Workflow complete!")
    else:
        print(f"\n⚠️ Max retries ({max_retries}) reached. Using best available output.")
    
    return "end"


def create_scribble_workflow() -> StateGraph:
    """
    Create and compile the LangGraph workflow.
    
    Workflow structure:
    START → classify → convert → validate → [conditional: retry or end]
    """
    # Create the graph
    workflow = StateGraph(ScribbleState)
    
    # Add nodes
    workflow.add_node("classify", classify_node)
    workflow.add_node("convert", convert_node)
    workflow.add_node("validate", validate_node)
    
    # Add edges
    workflow.set_entry_point("classify")
    workflow.add_edge("classify", "convert")
    workflow.add_edge("convert", "validate")
    
    # Add conditional edge for retry logic
    workflow.add_conditional_edges(
        "validate",
        should_retry,
        {
            "convert": "convert",
            "end": END
        }
    )
    
    # Compile the graph
    return workflow.compile()


def process_scribble(image_path: str, max_retries: int = 3) -> dict:
    """
    Process a scribble image through the complete workflow.
    
    Args:
        image_path: Path to the image file
        max_retries: Maximum number of conversion retry attempts (default: 3)
        
    Returns:
        dict with final state including converted_output, validation_score, etc.
    """
    import base64
    
    print(f"\n{'='*60}")
    print(f"🚀 Starting Scribble Conversion Workflow")
    print(f"{'='*60}")
    
    # Read image and encode to base64
    with open(image_path, 'rb') as f:
        image_data = base64.b64encode(f.read()).decode('utf-8')
    
    # Initialize state
    initial_state: ScribbleState = {
        "image_path": image_path,
        "image_data": image_data,
        "retry_count": 0,
        "max_retries": max_retries,
        "errors": [],
        "status": "started"
    }
    
    # Create and run workflow
    app = create_scribble_workflow()
    
    try:
        # Run the workflow
        final_state = app.invoke(initial_state)
        
        print(f"\n{'='*60}")
        print(f"✅ Workflow Complete!")
        print(f"{'='*60}")
        print(f"Type: {final_state.get('scribble_type', 'unknown')}")
        print(f"Confidence: {final_state.get('type_confidence', 0.0):.2f}")
        print(f"Validation Score: {final_state.get('validation_score', 0.0):.2f}")
        print(f"Total Attempts: {final_state.get('retry_count', 0) + 1}")
        print(f"{'='*60}\n")
        
        return final_state
        
    except Exception as e:
        error_msg = f"Workflow error: {str(e)}"
        print(f"\n❌ {error_msg}")
        return {
            **initial_state,
            "status": "error",
            "errors": [error_msg],
            "converted_output": "",
            "validation_score": 0.0
        }


# Test function for standalone execution
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python graph.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    result = process_scribble(image_path)
    
    print("\n" + "="*60)
    print("FINAL RESULT")
    print("="*60)
    print(f"Type: {result.get('scribble_type')}")
    print(f"Output:\n{result.get('converted_output')}")
    print(f"Score: {result.get('validation_score')}")
    if result.get('feedback'):
        print(f"Feedback:\n{result.get('feedback')}")
