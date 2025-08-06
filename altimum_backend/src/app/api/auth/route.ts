import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/services/userService";
import { signJwt } from "@/lib/security";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) { // 이메일, 비밀번호 입력 여부 확인
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  // userService의 authenticateUser 함수를 호출하여 사용자 인증을 시도
  const user = await authenticateUser(email, password);
  // 인증에 실패하는 경우 (user가 null)
  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }
  // 인증에 성공하는 경우 JWT 토큰 생성
  const token = signJwt({ sub: user.email, role: user.role });
  return NextResponse.json(
    { access_token: token, token_type: "bearer" },
    { status: 200 }
  );
}