import { createAgency, getAgencies, queryAgencies } from "./agency";
import { createUser, login, logout } from "./auth";
import { handleImageUpload } from "./image-upload-handle";
import { createSocialType, getSocialTypes } from "./social";
import { createVtuber } from "./vtuber";

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
