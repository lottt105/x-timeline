import { atom } from "recoil";

export const modalStateAtom = atom<boolean>({
  key: "isModalOpen",
  default: false,
});

export const profilePhotoAtom = atom<string | undefined>({
  key: "profilePhoto",
  default: "",
});

export const profileNameAtom = atom<string | undefined>({
  key: "profileName",
  default: "",
});
