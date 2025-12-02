/**
 * API utility for communicating with Django backend
 */

// Root of the backend (without the `/api` prefix) — used for auth endpoints
const ROOT_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL_ROOT || 'http://localhost:8000'
// API prefix for non-auth endpoints (e.g. converter API)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `${ROOT_BACKEND_URL}/api`

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

/**
 * Register a new user using the backend's registration endpoint
 */
export async function registerUser(
  username: string,
  email: string,
  password1: string,
  password2: string
): Promise<any> {
  try {
    const response = await fetch(`${ROOT_BACKEND_URL}/auth/registration/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password1, password2 }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw err;
    }

    return await response.json();
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
}

/**
 * Login user using the backend's login endpoint
 */
export async function loginUser(email: string, password: string): Promise<any> {
  try {
    const response = await fetch(`${ROOT_BACKEND_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw err;
    }

    return await response.json();
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}

/**
 * Logout current user (server-side) and optionally clear client token
 */
export async function logoutUser(token?: string): Promise<any> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    const response = await fetch(`${ROOT_BACKEND_URL}/auth/logout/`, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw err;
    }

    return await response.json().catch(() => ({}));
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
}

/**
 * Get current authenticated user details
 */
export async function getCurrentUser(token?: string): Promise<any> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Token ${token}`;

    const response = await fetch(`${ROOT_BACKEND_URL}/auth/user/`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw err;
    }

    return await response.json();
  } catch (error) {
    console.error("Get Current User Error:", error);
    throw error;
  }
}


