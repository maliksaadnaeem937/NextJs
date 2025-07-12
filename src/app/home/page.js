import React from "react";
import PostList from "@components/PostList";
import NavigationLink from "@components/NavigationLink";
export default function page() {
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
      ></PostList>
    </div>
  );
}
