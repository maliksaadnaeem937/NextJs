import React from "react";
import LoginPage from "@components/LoginPage";
import { getAuthenticatedUser } from "@lib/auth";
import {redirect} from "next/navigation";
export const dynamic = "force-dynamic";
export default async function page() {
    const user = await getAuthenticatedUser();
    console.log("Authenticated User:", user);
    if (user) {
      redirect("/profile");
    }
  return <LoginPage></LoginPage>;
}
