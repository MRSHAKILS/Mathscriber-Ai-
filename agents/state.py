"""
State definition for the scribble conversion workflow.
"""

from typing import TypedDict, Optional, List
from typing_extensions import NotRequired


class ScribbleState(TypedDict):
    """
    Shared state between agents in the workflow.
    
    Attributes:
        image_data: Base64 encoded string of uploaded image
        image_path: File path if stored locally
        scribble_type: Classified type: equation|table|diagram
        type_confidence: Float 0-1 indicating classification confidence
        converted_output: String output in appropriate format
        validation_score: Float 0-1 indicating validation quality
        feedback: String with detailed validation feedback
        retry_count: Int tracking conversion attempts
        max_retries: Int default 3
        errors: List of any errors encountered
        status: Current workflow status
        model_used: Name of the AI model used for conversion
    """
    # Input data
    image_data: str
    image_path: str
    
    # Classification results
    scribble_type: NotRequired[str]
    type_confidence: NotRequired[float]
    
    # Conversion results
    converted_output: NotRequired[str]
    
    # Validation results
    validation_score: NotRequired[float]
    feedback: NotRequired[str]
    
    # Control flow
    retry_count: NotRequired[int]
    max_retries: NotRequired[int]
    status: NotRequired[str]
    
    # Tracking
    errors: NotRequired[List[str]]
    model_used: NotRequired[str]
