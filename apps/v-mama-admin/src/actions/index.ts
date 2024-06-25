import { createUser, login, logout } from "./auth";
import { createAgency, getAllAgency, handleLogoUpload } from "./agency";
import {
  createSocialType,
  getSocialTypes,
  handleVtuberIconUpload,
} from "./social";
import { createVtuber } from "./vtuber";

export const server = {
  authCreateUser: createUser,
  authLogin: login,
  authLogout: logout,
  agencyCreate: createAgency,
  agencyHandleLogoUpload: handleLogoUpload,
  agencyGetAll: getAllAgency,
  socialCreateType: createSocialType,
  socialGetAllTypes: getSocialTypes,
  vtuberCreate: createVtuber,
  vtuberHandleIconUpload: handleVtuberIconUpload,
};
