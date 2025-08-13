#!/bin/bash

# GymQ Server 샘플 데이터 생성 스크립트
# 사용법: ./create-sample-data.sh
# 서버가 실행중이어야 합니다: npm run dev

BASE_URL="http://localhost:8080"

echo "=== GymQ Server 샘플 데이터 생성 ==="
echo "서버가 실행중인지 확인하세요: npm run dev"
echo

# 서버 연결 확인
echo "서버 연결 확인 중..."
if ! curl -s "$BASE_URL/" > /dev/null; then
    echo "❌ 서버에 연결할 수 없습니다. 먼저 'npm run dev'로 서버를 실행하세요."
    exit 1
fi
echo "✅ 서버 연결 확인됨"
echo

# 샘플 기구 데이터 배열
declare -a EQUIPMENT_DATA=(
    '{"name":"덤벨 5kg 세트","type":"Strength","brand":"PowerFit"}'
    '{"name":"바벨 20kg","type":"Strength","brand":"IronGrip"}'
    '{"name":"러닝머신 T500","type":"Cardio","brand":"RunMaster"}'
    '{"name":"실내 자전거","type":"Cardio","brand":"CyclePro"}'
    '{"name":"벤치프레스","type":"Strength","brand":"PowerFit"}'
    '{"name":"레그프레스 머신","type":"Strength","brand":"MuscleTech"}'
    '{"name":"로잉머신","type":"Cardio","brand":"AquaFit"}'
    '{"name":"케틀벨 12kg","type":"Strength","brand":"IronCore"}'
    '{"name":"스미스머신","type":"Strength","brand":"SafetyFirst"}'
    '{"name":"일립티컬 머신","type":"Cardio","brand":"CardioMax"}'
)

# 샘플 사용자 데이터 배열
declare -a USER_DATA=(
    '{"email":"hong@gym.com","password":"password123","name":"홍길동","phone":"010-1111-2222"}'
    '{"email":"kim@gym.com","password":"password123","name":"김철수","phone":"010-2222-3333"}'
    '{"email":"lee@gym.com","password":"password123","name":"이영희","phone":"010-3333-4444"}'
    '{"email":"park@gym.com","password":"password123","name":"박민수","phone":"010-4444-5555"}'
    '{"email":"choi@gym.com","password":"password123","name":"최지영"}'
)

# 생성된 ID 저장
declare -a CREATED_EQUIPMENT_IDS=()
declare -a CREATED_USER_EMAILS=()
SESSION_TOKEN=""

echo "📦 10개의 샘플 기구 데이터를 생성합니다..."
echo

# 각 샘플 데이터 생성
for i in "${!EQUIPMENT_DATA[@]}"; do
    echo "$(($i + 1)). 기구 생성 중..."
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/equipment" \
        -H "Content-Type: application/json" \
        -d "${EQUIPMENT_DATA[$i]}" \
        -w "\n%{http_code}")
    
    # 응답과 상태 코드 분리
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    JSON_RESPONSE=$(echo "$RESPONSE" | head -n -1)
    
    if [ "$HTTP_CODE" = "201" ]; then
        # 기구 이름 추출
        if command -v jq &> /dev/null; then
            EQUIPMENT_NAME=$(echo "$JSON_RESPONSE" | jq -r '.name')
            EQUIPMENT_ID=$(echo "$JSON_RESPONSE" | jq -r '.id')
            CREATED_EQUIPMENT_IDS+=("$EQUIPMENT_ID")
            echo "   ✅ '$EQUIPMENT_NAME' 생성 완료 (ID: ${EQUIPMENT_ID:0:8}...)"
        else
            echo "   ✅ 기구 생성 완료"
        fi
    else
        echo "   ❌ 기구 생성 실패 (HTTP $HTTP_CODE)"
        echo "   응답: $JSON_RESPONSE"
    fi
done

echo
echo "👥 5개의 샘플 사용자 데이터를 생성합니다..."
echo

# 각 사용자 데이터 생성
for i in "${!USER_DATA[@]}"; do
    echo "$(($i + 1)). 사용자 등록 중..."
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/users/register" \
        -H "Content-Type: application/json" \
        -d "${USER_DATA[$i]}" \
        -w "\n%{http_code}")
    
    # 응답과 상태 코드 분리
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    JSON_RESPONSE=$(echo "$RESPONSE" | head -n -1)
    
    if [ "$HTTP_CODE" = "201" ]; then
        # 사용자 정보 추출
        if command -v jq &> /dev/null; then
            USER_NAME=$(echo "$JSON_RESPONSE" | jq -r '.name')
            USER_EMAIL=$(echo "$JSON_RESPONSE" | jq -r '.email')
            CREATED_USER_EMAILS+=("$USER_EMAIL")
            echo "   ✅ '$USER_NAME' 등록 완료 ($USER_EMAIL)"
        else
            echo "   ✅ 사용자 등록 완료"
        fi
    else
        echo "   ❌ 사용자 등록 실패 (HTTP $HTTP_CODE)"
        echo "   응답: $JSON_RESPONSE"
    fi
done

echo
echo "🔐 첫 번째 사용자로 로그인 테스트..."
if [ ${#CREATED_USER_EMAILS[@]} -gt 0 ]; then
    FIRST_EMAIL=${CREATED_USER_EMAILS[0]}
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/users/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$FIRST_EMAIL\",\"password\":\"password123\"}" \
        -w "\n%{http_code}")
    
    LOGIN_HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
    LOGIN_JSON=$(echo "$LOGIN_RESPONSE" | head -n -1)
    
    if [ "$LOGIN_HTTP_CODE" = "200" ]; then
        if command -v jq &> /dev/null; then
            SESSION_TOKEN=$(echo "$LOGIN_JSON" | jq -r '.sessionId')
            LOGIN_USER_NAME=$(echo "$LOGIN_JSON" | jq -r '.user.name')
            echo "   ✅ '$LOGIN_USER_NAME' 로그인 성공 (세션: ${SESSION_TOKEN:0:8}...)"
        else
            echo "   ✅ 로그인 성공"
        fi
    else
        echo "   ❌ 로그인 실패 (HTTP $LOGIN_HTTP_CODE)"
    fi
fi

echo
echo "=========================================="
echo "✨ 샘플 데이터 생성 완료!"
echo

# 생성된 기구 목록 확인
echo "📋 생성된 기구 목록 ($(echo "${CREATED_EQUIPMENT_IDS[@]}" | wc -w)개):"
curl -s -X GET "$BASE_URL/equipment" \
    -H "Content-Type: application/json" | \
    if command -v jq &> /dev/null; then
        jq -r '.[] | "• \(.name) (\(.type)) - \(.brand // "브랜드 없음")"'
    else
        cat
    fi

echo
echo "👥 생성된 사용자 목록 ($(echo "${CREATED_USER_EMAILS[@]}" | wc -w)개):"
for email in "${CREATED_USER_EMAILS[@]}"; do
    echo "• $email"
done

echo
echo "=========================================="
echo "🔧 추가 테스트를 위한 유용한 명령어:"
echo

if [ ${#CREATED_EQUIPMENT_IDS[@]} -gt 0 ]; then
    FIRST_ID=${CREATED_EQUIPMENT_IDS[0]}
    echo "# 🏋️ 기구 관리 테스트:"
    echo "curl -X GET \"$BASE_URL/equipment/$FIRST_ID\"  # 상세 조회"
    echo "curl -X PUT \"$BASE_URL/equipment/$FIRST_ID\" -H \"Content-Type: application/json\" -d '{\"name\": \"수정된 기구\"}'"
    echo "curl -X DELETE \"$BASE_URL/equipment/$FIRST_ID\"  # 삭제 (주의!)"
    echo
fi

if [ ${#CREATED_USER_EMAILS[@]} -gt 0 ] && [ -n "$SESSION_TOKEN" ]; then
    echo "# 👤 사용자 관리 테스트 (로그인된 세션 사용):"
    echo "curl -X GET \"$BASE_URL/users/me\" -H \"Authorization: Bearer $SESSION_TOKEN\"  # 내정보 조회"
    echo "curl -X PUT \"$BASE_URL/users/me\" -H \"Authorization: Bearer $SESSION_TOKEN\" -H \"Content-Type: application/json\" -d '{\"name\": \"수정된 이름\"}'"
    echo "curl -X DELETE \"$BASE_URL/users/me\" -H \"Authorization: Bearer $SESSION_TOKEN\"  # 회원 탈퇴 (주의!)"
    echo
fi

echo "# 📖 기타 유용한 명령어:"
echo "cat curl-examples.md  # 자세한 cURL 예제 보기"
echo "npm run test         # 단위 테스트 실행"
echo

echo "🎉 샘플 데이터가 준비되었습니다. API 테스트를 시작하세요!"
echo "   - 기구 관리: $(echo "${CREATED_EQUIPMENT_IDS[@]}" | wc -w)개 생성"
echo "   - 사용자 관리: $(echo "${CREATED_USER_EMAILS[@]}" | wc -w)개 등록"