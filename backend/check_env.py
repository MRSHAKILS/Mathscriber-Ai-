import os
from dotenv import load_dotenv

load_dotenv()

print("="*50)
print("Environment Configuration")
print("="*50)
print(f"DB_ENGINE: {os.getenv('DB_ENGINE')}")
print(f"DB_NAME: {os.getenv('DB_NAME')}")
print(f"DB_USER: {os.getenv('DB_USER')}")
print(f"DB_HOST: {os.getenv('DB_HOST')}")
print(f"DB_PORT: {os.getenv('DB_PORT')}")
print(f"DB_PASSWORD: {'*' * len(os.getenv('DB_PASSWORD', ''))}")
print("="*50)
