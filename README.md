# X-Timeline

- Demo URL: <https://x-timeline.web.app>

---

## 요약

React, TypeScript, styled-components, firebase 학습용 프로젝트

### 주요 기능

- **계정** : 회원가입, 회원탈퇴, 로그인, 로그아웃, 비밀번호 변경, 프로필 수정
  - firebase authentication으로 구현
  - react hook form을 사용하여 form data 관리
  - 프로필 이미지는 storage에 따로 저장해서, 메세지가 조회될 때 같이 보여 줌
- **메세지** : 작성, 조회, 삭제 가능
  - firestore에 각 메세지 데이터 저장, storage에 이미지 저장
  - storage에 저장된 이미지는 URL을 다운받은 후, firestore 메세지 데이터에 포함시켜 저장
  - home에선 모든 유저의 메세지를 실시간으로 조회 가능하지만, 유저의 프로필 이미지는 변경 후, 새로고침해야 변경된 이미지를 볼 수 있음
  - profile에선 자신이 작성한 메세지만 조회 가능, 해당 페이지에선 메세지 작성이 불가하기 때문에 실시간 조회는 X

---

## 배운 점

---

## 기술 스택

- Frontend : React, TypeScript, styled-components
- Backend : Firebase Authentication
- Database : Firestore, Storage(이미지 저장)
- Deployment : Firebase Deploy
