# name-card

WHATWANT의 웹 명함 — GitHub Pages로 배포됩니다.

## 기술 스택

- **순수 HTML / CSS / JavaScript** — 빌드 도구 불필요, GitHub Pages 직접 배포
- **Google Fonts** — Inter + JetBrains Mono
- **Canvas API** — 파티클 애니메이션
- **CSS Custom Properties + Animations** — 3D 틸트, 플로팅 캐릭터, 글리치 효과

## 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 GitHub Pages에 배포합니다.

저장소 설정 → Pages → Source: **GitHub Actions** 로 설정해주세요.

## 로컬 실행

빌드 과정 없이 `index.html`을 브라우저에서 바로 열어 확인할 수 있습니다.

```bash
# VS Code Live Server 또는
open index.html
```
