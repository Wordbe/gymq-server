# GymQ Server API - cURL 예제

## 🚀 빠른 시작
```bash
npm run dev                    # 서버 실행 (포트 8080)
./create-sample-data.sh        # 샘플 데이터 생성
```

## 🏋️ 기구 관리 API

### 기구 등록
```bash
curl -X POST "http://localhost:8080/equipment" \
  -H "Content-Type: application/json" \
  -d '{"name": "덤벨 10kg", "type": "Strength", "brand": "PowerFit"}'
```

### 기구 목록 조회
```bash
curl -X GET "http://localhost:8080/equipment"
```

### 기구 상세 조회
```bash
curl -X GET "http://localhost:8080/equipment/{equipment_id}"
```

### 기구 정보 수정
```bash
curl -X PUT "http://localhost:8080/equipment/{equipment_id}" \
  -H "Content-Type: application/json" \
  -d '{"name": "수정된 이름", "brand": "새 브랜드"}'
```

### 기구 삭제
```bash
curl -X DELETE "http://localhost:8080/equipment/{equipment_id}"
```

## 👤 회원 관리 API

### 회원가입
```bash
curl -X POST "http://localhost:8080/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@gym.com",
    "password": "password123",
    "name": "홍길동",
    "phone": "010-1234-5678"
  }'
```

### 로그인
```bash
curl -X POST "http://localhost:8080/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@gym.com", "password": "password123"}'

# 응답에서 sessionId를 복사해서 아래 명령어에 사용
```

### 내정보 조회 (로그인 필요)
```bash
curl -X GET "http://localhost:8080/users/me" \
  -H "Authorization: Bearer {sessionId}"
```

### 내정보 수정 (로그인 필요)
```bash
curl -X PUT "http://localhost:8080/users/me" \
  -H "Authorization: Bearer {sessionId}" \
  -H "Content-Type: application/json" \
  -d '{"name": "새 이름", "phone": "010-9999-8888"}'
```

### 회원 탈퇴 (로그인 필요)
```bash
curl -X DELETE "http://localhost:8080/users/me" \
  -H "Authorization: Bearer {sessionId}"
```

## 📊 응답 코드
- **200**: 조회/수정 성공
- **201**: 생성 성공  
- **204**: 삭제 성공
- **400**: 잘못된 요청
- **401**: 인증 실패
- **404**: 리소스 없음

## 🔧 실용 예제

### 세션 토큰 자동 추출
```bash
# 로그인하고 토큰을 변수에 저장
TOKEN=$(curl -s -X POST "http://localhost:8080/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "hong@gym.com", "password": "password123"}' \
  | jq -r '.sessionId')

# 저장된 토큰으로 내정보 조회
curl -X GET "http://localhost:8080/users/me" \
  -H "Authorization: Bearer $TOKEN"
```

### ID 자동 추출로 기구 테스트
```bash
# 기구 등록하고 ID를 변수에 저장
EQUIPMENT_ID=$(curl -s -X POST "http://localhost:8080/equipment" \
  -H "Content-Type: application/json" \
  -d '{"name": "테스트기구", "type": "Strength"}' \
  | jq -r '.id')

# 저장된 ID로 상세 조회
curl -X GET "http://localhost:8080/equipment/$EQUIPMENT_ID"
```

## 🚨 에러 테스트

### 필수 필드 누락 (400)
```bash
curl -X POST "http://localhost:8080/equipment" \
  -H "Content-Type: application/json" \
  -d '{"name": "기구이름만"}'
```

### 이메일 중복 (400)
```bash
# 같은 이메일로 두 번 가입 시도
curl -X POST "http://localhost:8080/users/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "duplicate@test.com", "password": "123", "name": "중복테스트"}'
```

### 잘못된 로그인 (401)
```bash
curl -X POST "http://localhost:8080/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "wrong@test.com", "password": "wrongpass"}'
```

### 존재하지 않는 리소스 (404)
```bash
curl -X GET "http://localhost:8080/equipment/non-existent-id"
curl -X GET "http://localhost:8080/users/me" -H "Authorization: Bearer invalid-token"
```