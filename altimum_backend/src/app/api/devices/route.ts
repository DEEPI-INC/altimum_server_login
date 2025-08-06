// src/app/api/devices/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth"; // 위에서 만든 인증 유틸리티

export async function POST(req: NextRequest) {
  // 1. 요청 헤더의 JWT를 통해 사용자 인증
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ message: "인증되지 않은 요청입니다." }, { status: 401 });
  }

  // 2. Jetson에서 보낸 요청 body 파싱
  const body = await req.json();
  const { deviceName, cameraIPs } = body;

  // 3. 입력값 유효성 검사
  if (!deviceName || !cameraIPs || !Array.isArray(cameraIPs)) {
    return NextResponse.json(
      { message: "디바이스 이름과 카메라 IP 목록을 올바르게 입력해 주세요." },
      { status: 400 }
    );
  }

  try {
    // 4. 트랜잭션을 사용하여 Device와 Camera들을 한번에 생성 (원자성 보장)
    const newDeviceWithCameras = await prisma.$transaction(async (tx) => {
      // 먼저 Device를 생성합니다.
      const newDevice = await tx.device.create({
        data: {
          // 필드 이름을 스키마에 맞게 'deviceName'으로 정확하게 사용합니다.
          deviceName: deviceName,
          userId: user.id,
        },
      });

      // cameraIPs 배열이 비어있지 않다면, 각 IP에 대해 Camera 레코드를 생성합니다.
      if (cameraIPs.length > 0) {
        await tx.camera.createMany({
          data: cameraIPs.map((ip: string) => ({
            rtspAddress: ip,
            deviceId: newDevice.id,
          })),
        });
      }

      // 생성된 Device와 연결된 Camera들을 함께 반환합니다.
      return tx.device.findUnique({
        where: { id: newDevice.id },
        include: {
          cameras: true, // 연결된 카메라 정보 포함
        },
      });
    });

    // 5. 성공적으로 생성되면 결과 반환 (201 Created)
    return NextResponse.json(newDeviceWithCameras, { status: 201 });

  } catch (error: any) {
    // Prisma에서 발생하는 특정 에러 처리 (예: 유니크 제약 조건 위반)
    if (error.code === 'P2002' && error.meta?.target?.includes('rtspAddress')) {
      return NextResponse.json(
        { message: "이미 등록된 카메라 RTSP 주소가 포함되어 있습니다." },
        { status: 409 } // 409 Conflict
      );
    }

    // 그 외 서버 내부 오류
    console.error("Device registration failed:", error);
    return NextResponse.json(
      { message: "디바이스 등록 중 서버에서 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}