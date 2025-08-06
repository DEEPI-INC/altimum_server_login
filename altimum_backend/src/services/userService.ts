import { prisma } from "@/lib/prisma"; // 데이터베이스와 상호작용하기 위한 Prisma Client 인스턴스
import { hashPassword, verifyPassword } from "@/lib/security"; // 비밀번호 해싱 및 검증을 위한 보안 함수
import { UserCreate } from "@/types/user"; // 사용자 생성 시 필요한 데이터 타입을 정의한 인터페이스

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function createUser(user: UserCreate) {
  const hashedPassword = await hashPassword(user.password); // 비밀번호 해시값 처리
  return await prisma.user.create({ // DB에 새로운 사용자 레코드 생성
    data: {
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      role: user.role || "CUSTOMER", // role이 제공되지 않는 경우에는 customer로 자동 정
      hashedPassword, // 원본 비밀번호 대신 해시값을 DB에 저장
    },
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email); // 해당 이메일을 가진 사용자가 존재하는지 확인
  if (!user) return null; // 사용자가 없는 경우 null을 반환

  const isValid = await verifyPassword(password, user.hashedPassword); // 사용자가 존재하는 경우 비밀번호가 저장된 해시값과 일치하는지 판단
  if (!isValid) return null; // 일치하지 않는 경우 null 반환

  await prisma.user.update({ // 인증에 성공한 경우 마지막 로그인 시간을 현재 시간으로 변경
    where: { email },
    data: { lastLoginAt: new Date() },
  });

  return user;
}