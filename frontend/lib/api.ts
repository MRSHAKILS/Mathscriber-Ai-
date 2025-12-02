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

export interface ConversionHistoryItem {
  id: number
  username: string
  original_filename: string
  image_url: string
  latex_code: string
  conversion_type: 'upload' | 'canvas' | 'capture'
  accuracy: number
  created_at: string
}

export interface HistoryResponse {
  success: boolean
  data: ConversionHistoryItem[]
  total: number
  limit: number
  offset: number
  message?: string
}

/**
 * Convert an image to LaTeX code
 * @param imageFile - The image file to convert
 * @param conversionType - Type of conversion (upload, canvas, or capture)
 * @returns Promise with LaTeX code
 */
export async function convertImageToLatex(
  imageFile: File,
  conversionType: 'upload' | 'canvas' | 'capture' = 'upload'
): Promise<ConversionResponse> {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('conversion_type', conversionType)

    // Get auth token if available
    const token = localStorage.getItem('token')
    const headers: HeadersInit = {}
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/convert-image/`, {
      method: 'POST',
      headers,
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

/**
 * Get conversion history for the authenticated user
 * @param limit - Number of items to fetch
 * @param offset - Offset for pagination
 * @param type - Filter by conversion type
 * @returns Promise with history data
 */
export async function getConversionHistory(
  limit: number = 20,
  offset: number = 0,
  type?: 'upload' | 'canvas' | 'capture'
): Promise<HistoryResponse> {
  try {
    // Get auth token
    const token = localStorage.getItem('token')
    
    if (!token) {
      throw new Error('Not authenticated')
    }

    // Build query params
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })
    
    if (type) {
      params.append('type', type)
    }

    const response = await fetch(`${API_BASE_URL}/history/?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('History API Error:', error)
    return {
      success: false,
      data: [],
      total: 0,
      limit,
      offset,
      message: 'Failed to fetch conversion history',
    }
  }
}
