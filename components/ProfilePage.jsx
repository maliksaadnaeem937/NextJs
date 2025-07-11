"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "src/app/loading";
import { fetchData } from "@lib/fetchData";
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
    queryFn: fetchData,
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
    console.log("inside profile page", user);
    return <ProfilePageUI user={user} editable={editable} />;
  }
}
