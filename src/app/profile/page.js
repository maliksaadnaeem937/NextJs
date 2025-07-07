import { getAuthenticatedUser } from "@lib/auth";
import { redirect } from "next/navigation";
import ProfilePage from "@components/ProfilePage";
export const dynamic = "force-dynamic";

export default async function page() {
  const user = await getAuthenticatedUser();
  if(user){
    return <ProfilePage user={user} />;
  }
  return <ProfilePage user={null} />;
}
