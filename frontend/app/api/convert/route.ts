import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const model = formData.get('model') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // TODO: Implement actual conversion logic - forward to Django backend
    console.log('Converting file:', file.name, 'with model:', model);

    // Dummy response
    return NextResponse.json({
      success: true,
      data: {
        id: '123',
        latex: '\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
        confidence: 0.98,
        processingTime: 1.2,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Conversion failed' },
      { status: 500 }
    );
  }
}
