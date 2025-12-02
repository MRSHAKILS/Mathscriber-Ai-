import base64

def encode_image_to_base64(image_path: str) -> str:
    """
    Reads an image file and encodes it as a Base64 string.
    Returns:
        str: Base64-encoded string of the image.
    """
    with open(image_path, "rb") as image_file:
        encoded_bytes = base64.b64encode(image_file.read())
        return encoded_bytes.decode("utf-8")
