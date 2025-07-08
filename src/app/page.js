import SignupPage from "@components/SignupPage";
import { redirect } from "next/navigation";
import { anyValidToken } from "@lib/auth";
export const dynamic = "force-dynamic";
export default async function page() {
  if (await anyValidToken()) {
    return redirect("/profile");
  }
  return <SignupPage />;
}

export const metadata = {
  title: "Signup",
  description: "Create a new account",
};
