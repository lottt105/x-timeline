import { atom } from "recoil";

export const modalStateAtom = atom<boolean>({
  key: "isModalOpen",
  default: false,
});

export const profilePhotoAtom = atom<string | null | undefined>({
  key: "profilePhoto",
  default: "",
});

export const profileNameAtom = atom<string | null | undefined>({
  key: "profileName",
  default: "",
});
