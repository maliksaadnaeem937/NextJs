import ProfilePage from "@components/ProfilePage";
import { redirect } from "next/navigation";
import { anyValidToken } from "@lib/auth";
export const dynamic = "force-dynamic";
export default async function page() {
  const currentUserId = await anyValidToken();
  if (!currentUserId) {
    return redirect("/login");
  }
  return (
    <ProfilePage
      key={"profile"}
      method={"get"}
      path={"/protected/profile"}
      editable={true}
      getPostsPath={`/protected/posts/${currentUserId}`}
      currentUserId={currentUserId}
    />
  );
}
export const metadata = {
  title: "Profile",
  description: "View and manage your profile information",
};
