"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { makeAPICall } from "@lib/makeAPICall";
import PostCard from "./PostCard";
import Loading from "src/app/loading";
import { Loader } from "lucide-react";
import NavigationLink from "./NavigationLink";

export default function PostList({
  queryKey,
  method,
  path,
  editable,
  currentUserId,
}) {
  const LIMIT = 5;
  const observerRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam = 1 }) =>
      makeAPICall({
        queryKey: [
          queryKey,
          method,
          `${path}?page=${pageParam}&limit=${LIMIT}`,
        ],
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.posts?.length === LIMIT) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });

  // IntersectionObserver to auto-fetch next page
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <div className="max-w-2xl mx-auto mt-10">
      {status === "error" && (
        <p className="text-center text-red-500">Failed to load posts.</p>
      )}

      {data?.pages.map((page, i) => (
        <div key={i}>
          {page?.posts?.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              editable={editable}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      ))}

      <div ref={observerRef} className="h-10" />

      {isFetchingNextPage && (
        <p className="flex justify-center items-center mt-2 text-xl">
          <Loader></Loader>
        </p>
      )}
      {!hasNextPage && (
        <p className="flex justify-center items-center mt-2 text-xl ">
          No More Data
        </p>
      )}
    </div>
  );
}
