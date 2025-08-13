# 기구 관리 기능 사양서

## 개발 대상 기능

### 1. 기구 등록 (POST /equipment)
- **기능**: 새로운 헬스장 기구를 시스템에 등록
- **HTTP Method**: POST
- **Endpoint**: `http://localhost:8080/equipment`
- **요청 데이터**:
  ```json
  {
    "name": "바벨 벤치프레스",
    "type": "덤벨",
    "brand": "Life Fitness"
  }
  ```
- **응답 데이터**:
  ```json
  {
    "id": "uuid-generated-id",
    "name": "바벨 벤치프레스",
    "type": "덤벨",
    "brand": "Life Fitness",
    "createdAt": "2025-08-13T10:30:00.000Z",
    "updatedAt": "2025-08-13T10:30:00.000Z"
  }
  ```
- **상태 코드**: 201 Created

### 2. 기구 상세보기 (GET /equipment/:id)
- **기능**: 특정 기구의 상세 정보 조회
- **HTTP Method**: GET
- **Endpoint**: `http://localhost:8080/equipment/:id`
- **응답 데이터**:
  ```json
  {
    "id": "uuid-generated-id",
    "name": "바벨 벤치프레스",
    "type": "덤벨",
    "brand": "Life Fitness",
    "createdAt": "2025-08-13T10:30:00.000Z",
    "updatedAt": "2025-08-13T10:30:00.000Z"
  }
  ```
- **상태 코드**: 200 OK / 404 Not Found

### 3. 기구 수정하기 (PUT /equipment/:id)
- **기능**: 기존 기구 정보 수정
- **HTTP Method**: PUT
- **Endpoint**: `http://localhost:8080/equipment/:id`
- **요청 데이터**:
  ```json
  {
    "name": "바벨 벤치프레스 Pro",
    "type": "벤치프레스",
    "brand": "Technogym"
  }
  ```
- **응답 데이터**:
  ```json
  {
    "id": "uuid-generated-id",
    "name": "바벨 벤치프레스 Pro",
    "type": "벤치프레스",
    "brand": "Technogym",
    "createdAt": "2025-08-13T10:30:00.000Z",
    "updatedAt": "2025-08-13T11:45:00.000Z"
  }
  ```
- **상태 코드**: 200 OK / 404 Not Found

## 기술 스택 및 구현 방식
- **서버**: Express.js + TypeScript
- **포트**: 8080
- **데이터 저장**: 메모리 기반 (배열)
- **ID 생성**: UUID
- **타입 검증**: TypeScript strict mode

## 에러 처리
- **400 Bad Request**: 잘못된 요청 데이터
- **404 Not Found**: 존재하지 않는 기구 ID
- **500 Internal Server Error**: 서버 내부 오류

## 개발 준수사항
- PROJECT_SPEC.md의 모든 요구사항 준수
- CLAUDE.md의 개발 규칙 및 코딩 컨벤션 적용
- 각 API별 테스트 코드 포함