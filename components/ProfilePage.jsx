"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "src/app/loading";
import { makeAPICall } from "@lib/makeAPICall";
import ErrorMessage from "./ErrorMessage";
import ProfilePageUI from "./ProfilePageUI";
export default function ProfilePage({ key, method, path, editable }) {
  console.log("hi");
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: [key, method, path],
    queryFn: makeAPICall,
    retry: false,
  });

  if (isLoading) return <Loading />;
  if (error) {
    return (
      <ErrorMessage
        message={error?.response?.data?.error || "Session Expired Login Again!"}
      ></ErrorMessage>
    );
  } else {
    return <ProfilePageUI user={user} editable={editable} />;
  }
}
