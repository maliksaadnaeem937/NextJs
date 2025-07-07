import { getAuthenticatedUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ProfilePage from "@components/ProfilePage";

export default async function page() {

  

  return <ProfilePage />;
}
