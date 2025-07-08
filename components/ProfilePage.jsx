"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "src/app/loading";
import LogoutButton from "@components/LogoutButton";
import { fetchData } from "@lib/fetchData";
import ErrorMessage from "./ErrorMessage";
import ProfilePageUI from "./ProfilePageUI";

export default function ProfilePage({ user }) {
  if (user) {
    return <ProfilePageUI user={user} />;
  } else {
    const {
      data: user,
      error,
      isLoading,
    } = useQuery({
      queryKey: ["profile", "get", "/protected/profile"],
      queryFn: fetchData,
      retry: false,
    });

    if (isLoading) return <Loading />;
    if (error) {
      return (
        <ErrorMessage message={"Session Expired Login Again!"}></ErrorMessage>
      );
    } else {
      return <ProfilePageUI user={user} />;
    }
  }
}
