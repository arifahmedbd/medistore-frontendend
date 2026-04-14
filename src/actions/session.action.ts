"use server";

import { userService } from "@/services/session.servicec";

export const getSessionAction = async () => {
  return await userService.getSession();
};
