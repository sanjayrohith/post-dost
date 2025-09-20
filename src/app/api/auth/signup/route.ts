import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createUser } from '@/lib/user-storage';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Signup attempt:', { 
      name: body.name, 
      email: body.email, 
      passwordLength: body.password?.length 
    });

    // Validate input
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          details: validation.error.errors.map(err => err.message).join(', ')
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Create user
    const result = await createUser({ name, email, password });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log('User created successfully:', result.user?.email);

    // Return success response (without password)
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: result.user!.id,
        name: result.user!.name,
        email: result.user!.email,
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}