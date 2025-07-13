import React from "react";
import PostList from "@components/PostList";
import NavigationLink from "@components/NavigationLink";
import { redirect } from "next/navigation";
import { anyValidToken } from "@lib/auth";
export const dynamic = "force-dynamic";

export default async function page() {
  const currentUserId = await anyValidToken();
  if (!currentUserId) {
    return redirect("/login");
  }
  return (
    <div>
      <div className="max-w-2xl text-center mx-auto pb-2">
        <NavigationLink
          text={"View Profile"}
          path={"/profile"}
        ></NavigationLink>
      </div>
      <PostList
        queryKey={"get-all-posts"}
        method={"get"}
        path={"/protected/posts"}
        editable={false}
        currentUserId={currentUserId}
      ></PostList>
    </div>
  );
}

export const metadata = {
  title: "Home",
  description: "View Posts",
};
