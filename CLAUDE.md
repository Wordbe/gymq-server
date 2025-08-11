# CLAUDE.md

## 프로젝트 개요
- 프로젝트명: gymq-server
- Node.js 최신 버전 사용 (v20)
- TypeScript 사용 (v5.3+)
- Node.js 최신 버전에 맞게 ES 모듈 문법 사용, package.json 파일도 npm 환경에 맞게 포함
- 패키지 매니저: npm
- REST API 서버 개발

## API 요구사항

### 1) 기구 등록 (Create Equipment)
- HTTP Method: POST
- Endpoint: /equipment
- 요청 본문에 기구 정보 포함

### 2) 기구 목록 조회 (List Equipment)
- HTTP Method: GET
- Endpoint: /equipment
- 모든 기구의 최소한의 정보 반환

### 3) 기구 상세 조회 (Get Equipment Details)
- HTTP Method: GET
- Endpoint: /equipment/:id
- 특정 기구의 상세 정보 반환

### 4) 기구 수정 (Update Equipment)
- HTTP Method: PUT
- Endpoint: /equipment/:id
- 수정할 필드 포함

### 5) 기구 삭제 (Delete Equipment)
- HTTP Method: DELETE
- Endpoint: /equipment/:id

## 기구 최소 필드
- id: 고유 식별자 (자동 생성 UUID 또는 숫자)
- name: 기구 이름 (필수)
- type: 기구 종류 (예: 덤벨, 러닝머신, 벤치프레스 등)
- brand: 제조사 (선택 사항)
- createdAt: 등록 일시 (자동 생성)
- updatedAt: 수정 일시 (자동 생성)

## 추가 요구사항
- Express.js 프레임워크 사용
- TypeScript로 작성, 강타입 적용
- JSON 요청 및 응답 처리
- 적절한 HTTP 상태 코드 반환
- 에러 처리 포함
- 간단한 메모리 기반 데이터 저장소 사용 (DB 연결 없이)
- 각 API별 최소한의 테스트 코드 포함

## TypeScript 설정
- tsconfig.json으로 컴파일 옵션 관리
- strict 모드 활성화
- ES2022 타겟, ESNext 모듈
- 타입 정의 파일 (*.d.ts) 생성

## 개발 및 빌드 스크립트
- `npm run dev`: 개발 서버 (tsx를 사용한 실시간 리로딩)
- `npm run build`: TypeScript 컴파일
- `npm run start`: 빌드된 JavaScript 실행
- `npm run test`: TypeScript 테스트 실행
- `npm run clean`: 빌드 파일 제거

## 타입 정의
- Equipment 인터페이스: 기구 전체 정보
- EquipmentCreateRequest: 기구 생성 요청 타입
- EquipmentUpdateRequest: 기구 수정 요청 타입
- EquipmentListItem: 목록 조회용 간소화된 타입
