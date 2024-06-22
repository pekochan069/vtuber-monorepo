import { createUser, login, logout } from "./auth";
import { createAgency, handleLogoUpload } from "./agency";

export const server = {
  authCreateUser: createUser,
  authLogin: login,
  authLogout: logout,
  agencyCreate: createAgency,
  agencyHandleLogoUpload: handleLogoUpload,
};
