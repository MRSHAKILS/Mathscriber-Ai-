import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username } = body;

    // Call Django backend registration endpoint
    const response = await fetch(`${API_BASE_URL}/auth/registration/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password1: password,
        password2: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: data.username?.[0] || data.email?.[0] || data.password1?.[0] || 'Registration failed' 
        },
        { status: response.status }
      );
    }

    // Return user data and token
    return NextResponse.json({
      success: true,
      user: data.user,
      token: data.key || data.access_token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to authentication server' },
      { status: 500 }
    );
  }
}
