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

# 샘플 데이터 배열
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

# 생성된 기구 ID 저장
declare -a CREATED_IDS=()

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
            CREATED_IDS+=("$EQUIPMENT_ID")
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
echo "=========================================="
echo "✨ 샘플 데이터 생성 완료!"
echo

# 생성된 기구 목록 확인
echo "📋 생성된 기구 목록 확인:"
curl -s -X GET "$BASE_URL/equipment" \
    -H "Content-Type: application/json" | \
    if command -v jq &> /dev/null; then
        jq -r '.[] | "• \(.name) (\(.type)) - \(.brand // "브랜드 없음")"'
    else
        cat
    fi

echo
echo "=========================================="
echo "🔧 추가 테스트를 위한 유용한 명령어:"
echo

if [ ${#CREATED_IDS[@]} -gt 0 ]; then
    FIRST_ID=${CREATED_IDS[0]}
    echo "# 첫 번째 기구 상세 조회:"
    echo "curl -X GET \"$BASE_URL/equipment/$FIRST_ID\""
    echo
    echo "# 첫 번째 기구 이름 수정:"
    echo "curl -X PUT \"$BASE_URL/equipment/$FIRST_ID\" \\"
    echo "  -H \"Content-Type: application/json\" \\"
    echo "  -d '{\"name\": \"수정된 기구 이름\"}'"
    echo
    echo "# 첫 번째 기구 삭제 (주의!):"
    echo "curl -X DELETE \"$BASE_URL/equipment/$FIRST_ID\""
fi

echo
echo "# 전체 API 테스트:"
echo "./api-test.sh"
echo
echo "# 자세한 cURL 예제:"
echo "cat curl-examples.md"
echo

echo "🎉 샘플 데이터가 준비되었습니다. API 테스트를 시작하세요!"