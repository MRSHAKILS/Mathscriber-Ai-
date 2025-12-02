import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Implement actual authentication logic
    console.log('Login attempt:', { email });

    // Dummy response
    return NextResponse.json({
      success: true,
      user: {
        id: '1',
        email: email,
        name: 'Test User',
      },
      token: 'dummy-jwt-token',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
