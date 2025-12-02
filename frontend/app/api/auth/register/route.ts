import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // TODO: Implement actual registration logic
    console.log('Registration attempt:', { email, name });

    // Dummy response
    return NextResponse.json({
      success: true,
      user: {
        id: '1',
        email: email,
        name: name,
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
