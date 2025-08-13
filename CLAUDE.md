# CLAUDE.md

## 개발 가이드라인

### 새로운 기능 개발 워크플로우
새로운 기능을 개발할 때는 다음 단계를 따르세요:

1. **기존 기능 참조**: `features/` 디렉토리 하위의 기존 문서들을 참고하여 패턴을 파악합니다.
2. **기능 명세 작성**: `features/` 디렉토리 하위에 새로운 기능의 상세 명세서를 작성합니다.
   - 파일명: `features/[기능명].md` (예: `features/user-management.md`)
   - 내용: API 엔드포인트, 요청/응답 형식, 기술 스택, 에러 처리 등
3. **승인 요청**: 관리자에게 해당 기능 명세가 올바른지 확인을 요청합니다.
4. **개발 진행**: 승인된 명세서에 따라 기능을 개발합니다.
5. **문서 업데이트**: 
   - 개발 완료 후 `PROJECT_SPEC.md`에 새 기능 요약 추가
   - 해당 features 문서 경로도 PROJECT_SPEC.md에 추가
6. **샘플 데이터 및 테스트 가이드 업데이트**:
   - `data/create-sample-data.sh`에 새 API의 샘플 데이터 생성 로직 추가
   - `data/curl-examples.md`에 새 API의 간결한 cURL 사용 예제 추가
   - 기존 API와 연동되는 경우 통합 테스트 시나리오도 포함

### 프로젝트 사양 참조
- 전체 프로젝트 사양: `PROJECT_SPEC.md`
- 개별 기능 사양: `features/PROJECT_SPEC.md` 제외한 `features/` 하위 문서들

### 개발 규칙
- Node.js 최신 버전 (v20) 및 TypeScript 사용
- ES 모듈 문법 준수
- Express.js 프레임워크 기반 REST API 개발
- 강타입 TypeScript 코드 작성 (strict 모드)
- 적절한 HTTP 상태 코드 및 에러 처리 구현
- 메모리 기반 데이터 저장소 사용 (DB 연결 없이)
- 모든 API에 대한 테스트 코드 포함

### 코딩 컨벤션
- TypeScript strict 모드 활성화
- ES2022 타겟, ESNext 모듈 사용
- 타입 정의 파일 생성 필수
- JSON 요청/응답 처리
- 일관된 에러 핸들링 패턴 적용

### 데이터 및 테스트 관리
- **샘플 데이터 스크립트**: `data/create-sample-data.sh`
  - 모든 API에 대한 실제 테스트 가능한 샘플 데이터 자동 생성
  - 신규 API 추가 시 해당 API의 샘플 데이터 생성 로직 추가
  - API 간 연동 테스트를 위한 통합 시나리오 포함 (예: 로그인 후 인증 API 테스트)
- **cURL 사용 가이드**: `data/curl-examples.md`
  - 각 API별 간결하고 실용적인 cURL 명령어 예제 제공
  - 에러 케이스 및 성공 케이스 모두 포함
  - 자동화 가능한 스크립트 형태의 예제 제공 (jq 활용한 ID/토큰 추출 등)
  - 최대한 간결하게 작성하여 빠른 참조 가능하도록 구성
