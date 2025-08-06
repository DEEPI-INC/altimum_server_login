import { PrismaClient } from "@prisma/client"; // ORM 연결

const globalForPrisma = globalThis as unknown as { // 전역객체(globalThis) 타입 선언
  prisma: PrismaClient | undefined;
};

export const prisma = // prisma 객체 생성
  globalForPrisma.prisma ?? // globalForPrisma에 객체가 존재하는 경우 재사용
  new PrismaClient({ // 없는 경우 생성
    log: ["query"], // DB 관련 query 출력 설정
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; // 한 번 생성된 prisma 인스턴스를 전역 객체에 저장해두고 재사용
