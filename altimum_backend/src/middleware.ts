import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 허용할 출처 목록 생성
const allowedOrigins = [
  'http://localhost:5174',
  'http://192.168.0.36:5174', // 내부 네트워크의 다른 PC 주소
  'http://211.106.144.18:5174', // 외부 접속용 공인 IP 주소
  // 'https://my-real-domain.com' // 나중에 배포할 실제 도메인 주소
]

export function middleware(request: NextRequest) {
  // 요청의 출처(Origin)를 확인
  const origin = request.headers.get('origin')

  const response = NextResponse.next()

  // 출처가 허용 목록에 있을 경우에만 헤더를 설정
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return response
}

export const config = {
  matcher: ['/api/:path*'],
}