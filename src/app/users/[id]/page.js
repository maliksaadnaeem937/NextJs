import ProfilePage from "@components/ProfilePage";
import { anyValidToken } from "@lib/auth";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function page({ params }) {
  const { id } = await params;
  const currentUserId = await anyValidToken();
  if (!currentUserId) {
    return redirect("/login");
  }
  if (currentUserId === id) {
    return redirect("/profile");
  }

  return (
    <ProfilePage
      key="user-profile"
      method="get"
      path={`/protected/user-profile/${id}`}
      editable={false}
      getPostsPath={`/protected/posts/${id}`}
      currentUserId={currentUserId}
    />
  );
}

export const metadata = {
  title: "User Profile",
  description: "View User Profile",
};
