import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || '15m';
const ACCESS_MAX_AGE = Number(process.env.ACCESS_TOKEN_MAX_AGE) || 900;

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken =  cookieStore.get('refreshToken')?.value;
    console.log("refresh route called");

    if (!refreshToken) {
      console.log("no refresh token found");  
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }

    // Verify refresh token
    let userData;
    try {
      userData = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 403 });
    }

    // Create new access token
    const newAccessToken = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
        name: userData.name,
      },
      ACCESS_SECRET,
      { expiresIn: ACCESS_EXPIRE }
    );

    // Serialize the new access token cookie
    const accessCookie = serialize('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: ACCESS_MAX_AGE,
    });

    const response = NextResponse.json({ message: 'Access token refreshed' });
    
    response.headers.append('Set-Cookie', accessCookie);

    return response;
  } catch (err) {
    console.error('Refresh error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
