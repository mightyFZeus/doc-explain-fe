# Doc Explain Frontend Stack And Structure

## Tech Stack

- **Framework:** Next.js 16
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **API Layer:** RTK Query
- **React State Binding:** React Redux
- **Icons:** Lucide React
- **Class Utilities:** clsx
- **Video/Demo Tooling:** Remotion
- **Linting:** ESLint with Next.js config
- **CSS Tooling:** PostCSS and Autoprefixer
- **Package Manager:** npm

## Main Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run video:studio
npm run video:render
```

## Folder Structure

```text
doc-explain-fe/
├── public/
│   └── demo/
├── src/
│   ├── api/
│   │   ├── authApi.ts
│   │   ├── documentApi.ts
│   │   └── globalApi.ts
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── forget-password/
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── verify-email/
│   │   │   └── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── documents/
│   │   │   │   └── [documentId]/
│   │   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── layout/
│   │   └── shared/
│   ├── constants/
│   │   ├── endpoints.ts
│   │   └── routes.ts
│   ├── hooks/
│   ├── lib/
│   │   ├── apiError.ts
│   │   ├── authSession.ts
│   │   ├── documentStatus.ts
│   │   ├── utils.ts
│   │   └── webSocket.ts
│   ├── remotion/
│   │   ├── DocExplainDemo.tsx
│   │   ├── Root.tsx
│   │   ├── index.ts
│   │   └── styles.css
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── forgotPassword/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── verifyEmail/
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   ├── documentChat/
│   │   │   ├── hooks/
│   │   │   └── settings/
│   │   └── landing/
│   │       └── components/
│   ├── store/
│   │   ├── slices/
│   │   ├── hooks.ts
│   │   ├── rootReducer.ts
│   │   └── store.ts
│   └── types/
│       └── apiTypes.ts
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Architecture Notes

- `src/app` contains Next.js App Router pages and layouts.
- `src/screens` contains page-level UI implementations split by product area.
- `src/components` contains reusable layout and shared UI components.
- `src/api` contains RTK Query API slices and backend request logic.
- `src/store` contains Redux setup and feature slices.
- `src/lib` contains client utilities for auth session storage, API errors, websocket helpers, and document status handling.
- `src/remotion` contains the demo video composition.
