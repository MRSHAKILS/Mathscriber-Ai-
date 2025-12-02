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

// Auth API calls

export interface AuthResponse {
  success: boolean
  user?: {
    id: string
    email: string
    username?: string
  }
  token?: string
  error?: string
}

/**
 * Register a new user
 */
export async function registerUser(username: string, email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Registration Error:', error)
    return {
      success: false,
      error: 'Failed to register user',
    }
  }
}

/**
 * Login user
 */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Login Error:', error)
    return {
      success: false,
      error: 'Failed to login',
    }
  }
}

/**
 * Logout user
 */
export async function logoutUser(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Logout Error:', error)
    return {
      success: false,
      error: 'Failed to logout',
    }
  }
}
