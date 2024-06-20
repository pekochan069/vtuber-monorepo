import { createUser, login, logout } from "./auth";

export const server = {
  authCreateUser: createUser,
  authLogin: login,
  authLogout: logout,
};
