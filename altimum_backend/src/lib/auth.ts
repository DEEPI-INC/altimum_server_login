// src/lib/auth.ts

import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

// JWT 페이로드의 타입을 정의합니다.
interface UserJwtPayload {
  sub: string; // email
  role: string;
  iat: number;
  exp: number;
}

/**
 * 요청 헤더의 JWT를 검증하고 DB에서 사용자 정보를 찾아 반환합니다.
 * @param request - NextRequest 객체
 * @returns 인증된 사용자 객체 또는 null
 */
export async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return null;
  }

  try {
    // JWT 토큰을 검증하고 디코딩합니다.
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserJwtPayload;
    
    // 토큰의 payload에 있는 이메일(sub)을 사용하여 사용자를 찾습니다.
    const user = await prisma.user.findUnique({
      where: { email: decoded.sub },
    });

    return user;

  } catch (error) {
    // 토큰이 유효하지 않은 경우 (만료, 변조 등)
    console.error("JWT Verification Error:", error);
    return null;
  }
}
