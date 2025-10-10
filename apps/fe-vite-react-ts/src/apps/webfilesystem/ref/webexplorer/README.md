# Web Explorer - 웹기반 파일탐색기

웹 브라우저에서 사용할 수 있는 파일 탐색기 애플리케이션입니다.

## 주요 기능

### 🗂️ 디렉토리 트리 탐색
- 왼쪽 사이드바에 폴더 구조를 트리 형태로 표시
- 폴더 확장/축소 기능
- 현재 선택된 폴더 하이라이트 표시

### 📁 파일 목록 보기
- 리스트 뷰와 아이콘 뷰 전환 가능
- 파일 아이콘, 이름, 크기, 수정일 표시
- 다중 파일 선택 지원 (Ctrl+클릭)

### 🔧 툴바 기능
- 상위 폴더로 이동
- 새로고침
- 새 폴더 생성
- 경로 표시 (Breadcrumb)
- 뷰 모드 전환

### 📱 반응형 디자인
- 데스크톱과 모바일 환경 모두 지원
- 사이드바 크기 조절 가능

## 프로젝트 구조

```
src/apps/webexplorer/
├── appmain/                 # 메인 앱 컴포넌트
│   └── WebExplorerApp.tsx
├── components/              # UI 컴포넌트들
│   ├── DirectoryTree/       # 디렉토리 트리 컴포넌트
│   ├── FileList/           # 파일 목록 컴포넌트
│   ├── Toolbar/            # 툴바 컴포넌트
│   └── WebExplorer/        # 메인 탐색기 컴포넌트
├── context/                # React Context (상태 관리)
│   └── FileSystemContext.tsx
├── hooks/                  # 커스텀 훅
│   └── useFileSystemActions.ts
├── services/               # API 서비스
│   └── FileSystemAPI.ts
└── types/                  # TypeScript 타입 정의
    └── index.ts
```

## 컴포넌트 설명

### 1. WebExplorer (메인 컴포넌트)
- 전체 레이아웃과 상태 관리를 담당
- FileSystemProvider로 하위 컴포넌트들에 상태 제공

### 2. DirectoryTree
- 왼쪽 사이드바의 폴더 트리
- 재귀적으로 하위 폴더들을 렌더링
- 폴더 클릭 시 해당 폴더로 이동

### 3. FileList
- 오른쪽 메인 영역의 파일 목록
- 리스트 뷰와 아이콘 뷰 지원
- 파일 선택, 더블클릭 등의 이벤트 처리

### 4. Toolbar
- 상단 툴바
- 네비게이션, 뷰 모드 전환, 새 폴더 생성 등

## 상태 관리

React Context와 useReducer를 사용한 상태 관리:

- **currentPath**: 현재 선택된 폴더 경로
- **directories**: 디렉토리 트리 데이터
- **files**: 현재 폴더의 파일 목록
- **selectedItems**: 선택된 항목들
- **viewMode**: 'list' 또는 'icons'
- **loading**: 로딩 상태
- **error**: 에러 메시지

## API 서비스

현재는 Mock 데이터를 사용하며, 실제 서버 연동을 위한 API 인터페이스가 준비되어 있습니다.

### 예상 서버 API 엔드포인트:
- `GET /api/filesystem/directory?path=경로` - 폴더 내용 조회
- `GET /api/filesystem/tree?path=경로` - 디렉토리 트리 조회
- `GET /api/filesystem/download?path=경로` - 파일 다운로드
- `POST /api/filesystem/mkdir` - 폴더 생성
- `DELETE /api/filesystem/delete` - 파일/폴더 삭제

## 향후 개발 계획

### 서버 개발
- Node.js/Express 또는 다른 백엔드 프레임워크로 API 서버 구현
- 파일 시스템 접근 및 조작 기능
- 사용자 인증 및 권한 관리

### 기능 확장
- 파일 업로드 (드래그 앤 드롭)
- 파일 미리보기 (이미지, 텍스트, PDF 등)
- 파일/폴더 복사, 이동, 이름 바꾸기
- 검색 기능
- 즐겨찾기
- 파일 압축/해제

### UI/UX 개선
- 컨텍스트 메뉴 (우클릭 메뉴)
- 키보드 단축키
- 파일 선택 개선 (Shift+클릭으로 범위 선택)
- 드래그 앤 드롭으로 파일 이동

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 빌드
npm run build
```

## 기술 스택

- **React** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **CSS3** - 스타일링 (CSS Grid, Flexbox)
- **React Context** - 상태 관리

## 브라우저 지원

- Chrome (권장)
- Firefox
- Safari
- Edge

---

*이 프로젝트는 웹 기반 파일 탐색기의 기본 구조를 제공하며, 실제 서버와 연동하여 완전한 파일 관리 시스템으로 확장할 수 있습니다.*
