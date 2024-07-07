import { createAgency, getAgencies, queryAgencies } from "./agency";
import { createUser, login, logout } from "./auth";
import { createIllustrator, queryIllustrators } from "./illustrator";
import { handleImageUpload } from "./image-upload-handle";
import { getYoutubeIcon } from "./image-worker";
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
  createIllustrator,
  queryIllustrators,
  getYoutubeIcon,
};
