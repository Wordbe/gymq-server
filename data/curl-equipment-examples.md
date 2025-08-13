# GymQ Server - 기구 관리 API cURL 예제

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

## 🔧 실용 예제

### ID 자동 추출로 기구 테스트
```bash
# 기구 등록하고 ID를 변수에 저장
EQUIPMENT_ID=$(curl -s -X POST "http://localhost:8080/equipment" \
  -H "Content-Type: application/json" \
  -d '{"name": "테스트기구", "type": "Strength"}' \
  | jq -r '.id')

# 저장된 ID로 상세 조회
curl -X GET "http://localhost:8080/equipment/$EQUIPMENT_ID"

# 정보 수정
curl -X PUT "http://localhost:8080/equipment/$EQUIPMENT_ID" \
  -H "Content-Type: application/json" \
  -d '{"name": "수정된테스트기구", "brand": "NewBrand"}'

# 삭제
curl -X DELETE "http://localhost:8080/equipment/$EQUIPMENT_ID"
```

## 🚨 에러 테스트

### 필수 필드 누락 (400)
```bash
curl -X POST "http://localhost:8080/equipment" \
  -H "Content-Type: application/json" \
  -d '{"name": "기구이름만"}'
```

### 존재하지 않는 기구 조회 (404)
```bash
curl -X GET "http://localhost:8080/equipment/non-existent-id"
```

### 존재하지 않는 기구 수정 (404)
```bash
curl -X PUT "http://localhost:8080/equipment/non-existent-id" \
  -H "Content-Type: application/json" \
  -d '{"name": "수정시도"}'
```

## 📊 응답 코드
- **200**: 조회/수정 성공
- **201**: 생성 성공  
- **204**: 삭제 성공
- **400**: 잘못된 요청 (필수 필드 누락 등)
- **404**: 기구를 찾을 수 없음