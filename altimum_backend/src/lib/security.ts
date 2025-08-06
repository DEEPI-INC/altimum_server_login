import bcrypt from "bcrypt"; // 비밀번호 해싱(암호화)을 위한 라이브러리
import jwt from "jsonwebtoken"; // JWT(JSON Web Token) 생성을 위한 라이브러리

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10); // salt round 을 10으로 설정하여 일반적인 복잡도 설정
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash); // 문자열 비교를 통한 비밀번호 검증
}

export function signJwt(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { // payload, 비밀 키, 옵션을 받아 토큰을 생성
    expiresIn: process.env.JWT_EXPIRES_IN || "60m", // 토큰 만료 시간 : 60분
  });
}