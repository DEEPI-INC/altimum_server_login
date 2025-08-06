// 'User'를 생성할 때 필요한 데이터의 형태를 정의하는 인터페이스
// 해당 구조를 따르는 객체만 'UserCreate' 타입으로 정의됨

export interface UserCreate {
// 사용자의 이메일 주소, 비밀번호, 이름, 휴대폰 번호는 문자열(string) 타입
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
//사용자 역할은 'ADMIN' 또는 'CUSTOMER' 중 하나의 값만 할당됨
  role?: "ADMIN" | "CUSTOMER";
}