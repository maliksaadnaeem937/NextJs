import { getAuthenticatedUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ProfilePage from "@components/ProfilePage";
export const dynamic = "force-dynamic";

export default async function page() {
  return (
    <ProfilePage key={"profile"} method={"get"} path={"/protected/profile"} editable={true} />
  );
}
export const metadata = {
  title: "Profile",
  description: "View and manage your profile information",
};
