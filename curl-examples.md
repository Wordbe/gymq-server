# GymQ Server API - cURL 명령어 예제

## 🚀 시작하기

### 1단계: 서버 실행
```bash
npm run dev  # 개발 서버 (포트 8080)
```

### 2단계: 샘플 데이터 생성 (선택사항)
```bash
./create-sample-data.sh  # 10개의 샘플 기구 데이터 생성
```

### 3단계: API 테스트
개별 명령어를 사용하거나 전체 테스트 스크립트를 실행:
```bash
./api-test.sh  # 모든 API 자동 테스트
```

## 📍 기본 정보

### 서버 URL
```
http://localhost:8080
```

### 지원하는 HTTP 메소드
- `GET`: 조회
- `POST`: 생성  
- `PUT`: 수정
- `DELETE`: 삭제

## API 테스트 명령어

### 1. 서버 상태 확인
서버가 정상적으로 실행되고 있는지 확인합니다.

```bash
curl -X GET "http://localhost:8080/" \
  -H "Content-Type: application/json"
```

**응답 예시:**
```json
{"message": "GymQ Server API"}
```

### 2. 기구 등록 (POST /equipment)
새로운 운동기구를 등록합니다. `name`과 `type`은 필수 필드이고, `brand`는 선택사항입니다.
```bash
# 덤벨 등록
curl -X POST "http://localhost:8080/equipment" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "덤벨 10kg",
    "type": "Strength",
    "brand": "PowerFit"
  }'

# 러닝머신 등록
curl -X POST "http://localhost:8080/equipment" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "러닝머신",
    "type": "Cardio",
    "brand": "CardioMax"
  }'

# brand 없이 등록
curl -X POST "http://localhost:8080/equipment" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "벤치프레스",
    "type": "Strength"
  }'
```

### 3. 기구 목록 조회 (GET /equipment)
등록된 모든 기구의 요약 정보를 조회합니다. 목록 조회에서는 기본 정보만 반환됩니다.

```bash
curl -X GET "http://localhost:8080/equipment" \
  -H "Content-Type: application/json"
```

**응답 예시:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "덤벨 10kg",
    "type": "Strength",
    "brand": "PowerFit"
  }
]
```

### 4. 특정 기구 조회 (GET /equipment/:id)
특정 기구의 상세 정보를 조회합니다. `createdAt`과 `updatedAt` 정보도 포함됩니다.

```bash
# {equipment_id}를 실제 ID로 교체
curl -X GET "http://localhost:8080/equipment/{equipment_id}" \
  -H "Content-Type: application/json"

# 존재하지 않는 ID로 테스트 (404 에러)
curl -X GET "http://localhost:8080/equipment/non-existent-id" \
  -H "Content-Type: application/json"
```

**성공 응답 예시 (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "덤벨 10kg",
  "type": "Strength",
  "brand": "PowerFit",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 5. 기구 정보 수정 (PUT /equipment/:id)
기존 기구의 정보를 부분적으로 또는 전체적으로 수정합니다. 수정하고 싶은 필드만 전송하면 됩니다.
```bash
# 이름과 브랜드 수정
curl -X PUT "http://localhost:8080/equipment/{equipment_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "덤벨 15kg (업그레이드)",
    "brand": "PowerFit Pro"
  }'

# 이름만 수정
curl -X PUT "http://localhost:8080/equipment/{equipment_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "새로운 이름"
  }'

# 타입만 수정
curl -X PUT "http://localhost:8080/equipment/{equipment_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Cardio"
  }'
```

### 6. 기구 삭제 (DELETE /equipment/:id)
특정 기구를 완전히 삭제합니다. **주의: 이 작업은 되돌릴 수 없습니다.**

```bash
curl -X DELETE "http://localhost:8080/equipment/{equipment_id}"
```

**성공 응답:** HTTP 204 No Content (응답 본문 없음)  
**실패 응답:** HTTP 404 (기구를 찾을 수 없음)

## 🚨 에러 테스트 케이스

API의 에러 처리가 올바르게 작동하는지 확인하는 테스트들입니다.

### 필수 필드 누락 (400 Bad Request)
`type` 필드가 누락된 경우를 테스트합니다.

```bash
curl -X POST "http://localhost:8080/equipment" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "기구 이름만"
  }'
```

**에러 응답:**
```json
{
  "error": "Name and type are required fields"
}
```

### 빈 업데이트 데이터 (400 Bad Request)
수정할 데이터가 없는 경우를 테스트합니다.

```bash
curl -X PUT "http://localhost:8080/equipment/{equipment_id}" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**에러 응답:**
```json
{
  "error": "No valid fields to update"
}
```

### 존재하지 않는 리소스 (404 Not Found)
존재하지 않는 기구 ID로 요청하는 경우를 테스트합니다.

```bash
# GET 요청
curl -X GET "http://localhost:8080/equipment/non-existent-id" \
  -H "Content-Type: application/json"

# PUT 요청
curl -X PUT "http://localhost:8080/equipment/non-existent-id" \
  -H "Content-Type: application/json" \
  -d '{"name": "수정할 이름"}'

# DELETE 요청
curl -X DELETE "http://localhost:8080/equipment/non-existent-id"
```

**에러 응답:**
```json
{
  "error": "Equipment not found"
}
```

## 🔧 자동화된 테스트 및 유틸리티

### 전체 API 테스트
모든 API 엔드포인트를 순차적으로 테스트합니다.
```bash
./api-test.sh
```

### 샘플 데이터 생성
테스트용 기구 데이터 10개를 자동으로 생성합니다.
```bash
./create-sample-data.sh
```

### 단위 테스트 실행
TypeScript로 작성된 단위 테스트를 실행합니다.
```bash
npm run test
```

### 개발 서버 실행
코드 변경시 자동 재시작되는 개발 서버를 실행합니다.
```bash
npm run dev
```

## 📊 HTTP 상태 코드 가이드

| 상태 코드 | 의미 | 사용 시점 |
|-----------|------|-----------|
| 200 | OK | 조회 성공 |
| 201 | Created | 생성 성공 |
| 204 | No Content | 삭제 성공 |
| 400 | Bad Request | 잘못된 요청 데이터 |
| 404 | Not Found | 리소스를 찾을 수 없음 |
| 500 | Internal Server Error | 서버 내부 오류 |

## 📝 데이터 필드 설명

### Equipment 객체 구조
```typescript
interface Equipment {
  id: string;          // UUID (자동 생성)
  name: string;        // 기구 이름 (필수)
  type: string;        // 기구 종류 (필수) - 예: "Strength", "Cardio"
  brand: string | null; // 제조사 (선택사항)
  createdAt: string;   // 생성 일시 (자동 생성)
  updatedAt: string;   // 수정 일시 (자동 갱신)
}
```

### 일반적인 기구 타입
- **Strength**: 근력 운동 기구 (덤벨, 바벨, 벤치프레스 등)
- **Cardio**: 유산소 운동 기구 (러닝머신, 자전거, 일립티컬 등)

## 🛠️ 문제 해결

### 서버 연결 실패
```bash
curl: (7) Failed to connect to localhost port 8080
```
**해결방법:** `npm run dev`로 서버가 실행 중인지 확인하세요.

### JSON 파싱 오류
```json
{"error": "Unexpected token in JSON"}
```
**해결방법:** JSON 데이터 형식을 확인하고 따옴표가 올바른지 확인하세요.

### 기구 ID 찾기
기구를 등록한 후 반환된 JSON에서 `id` 값을 복사해서 다른 요청에 사용하거나, `jq` 도구를 사용하여 자동으로 추출할 수 있습니다:

```bash
# jq를 사용한 ID 추출
EQUIPMENT_ID=$(curl -s -X POST "http://localhost:8080/equipment" \
  -H "Content-Type: application/json" \
  -d '{"name":"테스트","type":"Strength"}' | jq -r '.id')

echo $EQUIPMENT_ID
```