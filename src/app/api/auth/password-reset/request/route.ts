import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import crypto from 'crypto';
import { sendEmail } from '@/app/lib/email';

export async function POST(request: Request) {
  // Verify content type
  const contentType = request.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return NextResponse.json(
      { error: 'Content-Type must be application/json' },
      { status: 415 }
    );
  }

  try {
    // Parse JSON with error handling
    let email: string;
    try {
      const body = await request.json();
      email = body.email;
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return NextResponse.json({
        message: 'If an account exists, you will receive a password reset email'
      });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

    // Save reset token
    await prisma.passwordReset.create({
      data: {
        email,
        token,
        expires,
      },
    });

    try {
      // Send reset email
      await sendEmail({
        to: email,
        subject: 'Reset your password',
        text: `Click this link to reset your password: http://localhost:3000/reset-password?token=${token}`,
        html: `
          <p>Click the button below to reset your password:</p>
          <a href="http://localhost:3000/reset-password?token=${token}" 
             style="padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't expose email errors to the client
    }

    return NextResponse.json({
      message: 'If an account exists, you will receive a password reset email'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Error processing password reset request' },
      { status: 500 }
    );
  }
} 