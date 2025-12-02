/**
 * API utility for communicating with Django backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export interface ConversionResponse {
  success: boolean
  id?: number
  latex_code: string
  image_url?: string
  message: string
}

/**
 * Convert an image to LaTeX code
 * @param imageFile - The image file to convert
 * @returns Promise with LaTeX code
 */
export async function convertImageToLatex(imageFile: File): Promise<ConversionResponse> {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await fetch(`${API_BASE_URL}/convert-image/`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API Error:', error)
    return {
      success: false,
      latex_code: '',
      message: 'Failed to connect to the server. Please ensure the backend is running.',
    }
  }
}

/**
 * Check if the API is healthy
 * @returns Promise with health status
 */
export async function checkHealth(): Promise<{ status: string; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/health/`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Health Check Error:', error)
    return {
      status: 'error',
      message: 'Backend server is not responding',
    }
  }
}


//Login Authentication API

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Django backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
  }
  return config;
});

export default api;
