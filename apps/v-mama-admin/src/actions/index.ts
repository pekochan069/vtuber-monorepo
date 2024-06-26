import { createUser, login, logout } from "./auth";
import { createAgency, getAgencies, queryAgencies } from "./agency";
import { createSocialType, getSocialTypes } from "./social";
import { createVtuber } from "./vtuber";
import { handleImageUpload } from "./image-upload-handle";

export const server = {
  authCreateUser: createUser,
  authLogin: login,
  authLogout: logout,
  createAgency,
  getAgencies,
  queryAgencies,
  createSocialType,
  getSocialTypes,
  createVtuber,
  handleImageUpload,
};
