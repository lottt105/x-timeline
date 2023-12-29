# X-Timeline

- **Demo URL**: <https://x-timeline.web.app>

---

## 요약

React, TypeScript, styled-components, firebase 학습을 위해 진행한 개인 프로젝트로, 타임라인에 메세지를 올려 타인과 공유하는 기능을 가진 웹사이트

### 주요 기능

- **계정** : 회원가입, 회원탈퇴, 로그인, 로그아웃, 비밀번호 변경, 프로필 수정
  - create account 페이지에서 회원가입, login 페이지에서 로그인 가능
  - home, profile 페이지 네비게이션 메뉴에서 로그아웃 가능
  - profile 페이지의 토글 메뉴에서 프로필 수정, 비밀번호 변경, 회원탈퇴 가능
- **메세지** : 작성, 조회, 삭제 가능
  - home 페이지에서 모든 유저의 메세지를 실시간으로 조회 가능
  - profile 페이지에서 자신이 작성한 메세지만 조회 가능, 해당 페이지에선 메세지 작성이 불가하기 때문에 실시간 조회는 X

---

## 기술 스택

- **Frontend** : React, TypeScript, styled-components
- **Backend** : Firebase Authentication
- **Database** : Firestore, Storage
- **Deployment** : Firebase Hosting
