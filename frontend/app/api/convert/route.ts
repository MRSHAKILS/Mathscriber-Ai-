import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Forward to Django backend
    const backendFormData = new FormData();
    backendFormData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/convert-image/`, {
      method: 'POST',
      body: backendFormData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Conversion failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: data.success,
      data: {
        latex: data.latex_code,
        message: data.message,
      },
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend server' },
      { status: 500 }
    );
  }
}
