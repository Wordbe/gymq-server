# 회원 관리 기능 사양서

## 개발 대상 기능

### 1. 회원가입 (POST /users/register)
- **기능**: 새로운 사용자를 시스템에 등록
- **HTTP Method**: POST
- **Endpoint**: `http://localhost:8080/users/register`
- **요청 데이터**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "홍길동",
    "phone": "010-1234-5678"
  }
  ```
- **응답 데이터**:
  ```json
  {
    "id": "uuid-generated-id",
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "createdAt": "2025-08-13T10:30:00.000Z",
    "updatedAt": "2025-08-13T10:30:00.000Z"
  }
  ```
- **상태 코드**: 201 Created / 400 Bad Request (이메일 중복)

### 2. 로그인 (POST /users/login)
- **기능**: 이메일과 비밀번호로 사용자 인증 (간단한 세션 기반)
- **HTTP Method**: POST
- **Endpoint**: `http://localhost:8080/users/login`
- **요청 데이터**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **응답 데이터**:
  ```json
  {
    "user": {
      "id": "uuid-generated-id",
      "email": "user@example.com",
      "name": "홍길동"
    },
    "sessionId": "simple-session-token"
  }
  ```
- **상태 코드**: 200 OK / 401 Unauthorized

### 3. 내정보 조회 (GET /users/me)
- **기능**: 현재 로그인된 사용자의 정보 조회
- **HTTP Method**: GET
- **Endpoint**: `http://localhost:8080/users/me`
- **헤더**: `Authorization: Bearer {sessionId}`
- **응답 데이터**:
  ```json
  {
    "id": "uuid-generated-id",
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "createdAt": "2025-08-13T10:30:00.000Z",
    "updatedAt": "2025-08-13T10:30:00.000Z"
  }
  ```
- **상태 코드**: 200 OK / 401 Unauthorized

### 4. 내정보 수정 (PUT /users/me)
- **기능**: 현재 로그인된 사용자의 정보 수정
- **HTTP Method**: PUT
- **Endpoint**: `http://localhost:8080/users/me`
- **헤더**: `Authorization: Bearer {sessionId}`
- **요청 데이터**:
  ```json
  {
    "name": "홍길동2",
    "phone": "010-9876-5432",
    "password": "newpassword123"
  }
  ```
- **응답 데이터**:
  ```json
  {
    "id": "uuid-generated-id",
    "email": "user@example.com",
    "name": "홍길동2",
    "phone": "010-9876-5432",
    "createdAt": "2025-08-13T10:30:00.000Z",
    "updatedAt": "2025-08-13T12:15:00.000Z"
  }
  ```
- **상태 코드**: 200 OK / 401 Unauthorized

### 5. 회원 탈퇴 (DELETE /users/me)
- **기능**: 현재 로그인된 사용자의 계정 삭제
- **HTTP Method**: DELETE
- **Endpoint**: `http://localhost:8080/users/me`
- **헤더**: `Authorization: Bearer {sessionId}`
- **응답**: 빈 응답
- **상태 코드**: 204 No Content / 401 Unauthorized

## 회원 최소 필드
- id: 고유 식별자 (자동 생성 UUID)
- email: 이메일 주소 (필수, 고유)
- password: 비밀번호 (필수, 해시 처리)
- name: 사용자 이름 (필수)
- phone: 전화번호 (선택 사항)
- createdAt: 등록 일시 (자동 생성)
- updatedAt: 수정 일시 (자동 생성)

## 기술 스택 및 구현 방식
- **서버**: Express.js + TypeScript
- **포트**: 8080
- **데이터 저장**: 메모리 기반 (배열)
- **ID 생성**: UUID
- **비밀번호 해시**: Node.js crypto 모듈 (간단한 해시)
- **세션 관리**: 메모리 기반 간단한 세션 토큰
- **인증 방식**: Bearer Token (간단한 문자열 토큰)

## 간단한 로그인 구현 방식
1. **비밀번호 저장**: crypto.createHash('sha256') 사용
2. **세션 토큰**: 로그인 시 UUID 생성하여 메모리에 저장
3. **인증 검증**: Authorization 헤더의 Bearer 토큰 확인
4. **세션 만료**: 별도 만료 시간 없음 (메모리 기반)

## 에러 처리
- **400 Bad Request**: 잘못된 요청 데이터, 이메일 중복
- **401 Unauthorized**: 인증 실패, 세션 만료
- **404 Not Found**: 존재하지 않는 사용자
- **500 Internal Server Error**: 서버 내부 오류

## 개발 준수사항
- features/PROJECT_SPEC.md의 모든 요구사항 준수
- CLAUDE.md의 개발 규칙 및 코딩 컨벤션 적용
- 각 API별 테스트 코드 포함
- 비밀번호는 평문 저장 금지 (해시 처리 필수)