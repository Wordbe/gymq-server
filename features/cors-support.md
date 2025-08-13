# CORS 지원 기능 개선

## 작업 목적
프론트엔드 애플리케이션(localhost:3000)에서 API 서버(localhost:8080)로의 요청 시 발생하는 CORS(Cross-Origin Resource Sharing) 오류를 해결하여 클라이언트-서버 간 통신을 원활하게 합니다.

## 현재 문제점
- Express 서버에 CORS 미들웨어가 설정되지 않음
- `http://localhost:3000`에서 `http://localhost:8080`로의 브라우저 요청 시 CORS 정책 위반 오류 발생
- 프론트엔드 개발 및 테스트 작업 지장

## 해결 방안

### 1. CORS 패키지 설치
```bash
npm install cors @types/cors
```

### 2. 서버 설정 수정 (`src/server.ts`)
- `cors` 미들웨어 추가
- 개발 환경용 설정: `localhost:3000` 허용
- 프로덕션 고려사항 포함

### 3. CORS 설정 내용
- **Origin**: `http://localhost:3000` (개발 환경)
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization
- **Credentials**: true (인증 헤더 지원)

## 기술 스택
- **패키지**: `cors` (Express CORS 미들웨어)
- **TypeScript 타입**: `@types/cors`
- **적용 위치**: Express 애플리케이션 미들웨어

## 보안 고려사항
- 개발 환경에서만 `localhost:3000` 허용
- 프로덕션 환경에서는 실제 도메인으로 제한 필요
- 와일드카드(*) 사용 지양

## 테스트 방법
1. 서버 재시작 후 브라우저에서 `localhost:3000` 페이지 접근
2. API 요청 시 CORS 오류 해결 확인
3. OPTIONS preflight 요청 정상 처리 확인

## 영향 범위
- 모든 기존 API 엔드포인트에 CORS 헤더 자동 적용
- API 기능 변경 없음
- 브라우저 기반 클라이언트만 영향받음