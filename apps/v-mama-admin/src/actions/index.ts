import { createUser, login, logout } from "./auth";
import { createAgency, handleLogoUpload } from "./agency";
import { nanoid } from "@repo/utils/id";
import { PutObjectCommand } from "@repo/r2/client-s3";
import { env } from "@repo/env/admin";
import { getSignedUrl } from "@repo/r2/s3-request-presigner";
import { R2 } from "@repo/r2/admin";

export const server = {
  authCreateUser: createUser,
  authLogin: login,
  authLogout: logout,
  agencyCreate: createAgency,
  agencyHandleLogoUpload: handleLogoUpload,
};
