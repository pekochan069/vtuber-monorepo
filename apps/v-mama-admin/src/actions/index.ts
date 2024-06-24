import { createUser, login, logout } from "./auth";
import { createAgency, handleLogoUpload } from "./agency";
import { createSocialType, getSocialTypes } from "./social";

export const server = {
  authCreateUser: createUser,
  authLogin: login,
  authLogout: logout,
  agencyCreate: createAgency,
  agencyHandleLogoUpload: handleLogoUpload,
  socialCreateType: createSocialType,
  socialGetAllTypes: getSocialTypes,
};
