# 머무름 — 호텔 객실 예약 (프론트엔드)

Next.js 16 (App Router) · React 19.2 · TypeScript · Tailwind CSS v4 · Zod 4

## 필요한 것

| 도구 | 버전 | 비고 |
|---|---|---|
| Node.js | 24 LTS | `node -v`로 확인 |
| pnpm | 10.28.0 | Node에 포함된 Corepack으로 자동 설치 |
| 에디터 | VS Code 권장 | 확장: Tailwind CSS IntelliSense |

## 실행

```bash
corepack enable        # pnpm 활성화 (최초 1회)
pnpm install           # 의존성 설치
cp .env.example .env.local
pnpm dev               # http://localhost:3000
```

같은 Wi‑Fi의 휴대폰에서 보려면 `pnpm dev:lan`으로 실행하고
휴대폰 브라우저에서 `http://<노트북 IP>:3000`으로 접속합니다.

## 구조

```
src/
├─ app/
│  ├─ layout.tsx          # 글꼴, 메타데이터, 뷰포트
│  ├─ page.tsx            # 첫 화면 (정적 껍데기 + 검색 폼 Suspense)
│  ├─ manifest.ts         # PWA 설정 (홈 화면에 추가)
│  └─ search/             # 검색 결과 (지금은 조건 확인만)
├─ features/search/
│  ├─ schema.ts           # 검색 조건 검증 (폼과 서버가 공유)
│  ├─ regions.ts          # 인기 지역 (추후 API로 교체)
│  └─ components/         # 검색 폼, 스테퍼, 스켈레톤
└─ lib/format/date.ts     # 'YYYY-MM-DD' 날짜 계산
```
