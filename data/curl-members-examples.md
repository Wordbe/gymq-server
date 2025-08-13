# GymQ Server - 회원 관리 API cURL 예제

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

## 🔧 실용 예제

### 세션 토큰 자동 추출 및 완전한 회원 테스트
```bash
# 1. 회원가입
curl -X POST "http://localhost:8080/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gym.com",
    "password": "test123",
    "name": "테스트유저",
    "phone": "010-1111-2222"
  }'

# 2. 로그인하고 토큰을 변수에 저장
TOKEN=$(curl -s -X POST "http://localhost:8080/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@gym.com", "password": "test123"}' \
  | jq -r '.sessionId')

# 3. 토큰 확인
echo "Token: $TOKEN"

# 4. 저장된 토큰으로 내정보 조회
curl -X GET "http://localhost:8080/users/me" \
  -H "Authorization: Bearer $TOKEN"

# 5. 내정보 수정
curl -X PUT "http://localhost:8080/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "수정된이름", "phone": "010-9999-8888"}'

# 6. 수정된 정보 확인
curl -X GET "http://localhost:8080/users/me" \
  -H "Authorization: Bearer $TOKEN"
```

### 여러 회원 가입 및 테스트
```bash
# 여러 회원 가입
for i in {1..3}; do
  curl -X POST "http://localhost:8080/users/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"user$i@gym.com\", \"password\": \"pass$i\", \"name\": \"사용자$i\", \"phone\": \"010-$i$i$i$i-5678\"}"
done
```

## 🚨 에러 테스트

### 이메일 중복 (400)
```bash
# 같은 이메일로 두 번 가입 시도
curl -X POST "http://localhost:8080/users/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "duplicate@test.com", "password": "123", "name": "중복테스트", "phone": "010-1234-5678"}'

curl -X POST "http://localhost:8080/users/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "duplicate@test.com", "password": "456", "name": "중복테스트2", "phone": "010-9876-5432"}'
```

### 필수 필드 누락 (400)
```bash
curl -X POST "http://localhost:8080/users/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "incomplete@test.com"}'
```

### 잘못된 로그인 (401)
```bash
curl -X POST "http://localhost:8080/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "wrong@test.com", "password": "wrongpass"}'
```

### 잘못된 토큰으로 인증 API 접근 (401)
```bash
curl -X GET "http://localhost:8080/users/me" \
  -H "Authorization: Bearer invalid-token"
```

### 토큰 없이 인증 API 접근 (401)
```bash
curl -X GET "http://localhost:8080/users/me"
```

## 📊 응답 코드
- **200**: 조회/수정/로그인 성공
- **201**: 회원가입 성공  
- **204**: 탈퇴 성공
- **400**: 잘못된 요청 (필수 필드 누락, 중복 이메일 등)
- **401**: 인증 실패 (잘못된 로그인 정보, 유효하지 않은 토큰)