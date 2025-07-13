"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { makeAPICall } from "@lib/makeAPICall";
import CommentItem from "./CommentItem";
import ErrorMessage from "./ErrorMessage";
import { Loader } from "lucide-react";

export default function CommentList({
  postId,
  queryKey,
  method,
  path,
  editable,
  currentUserId,
}) {
  const LIMIT = 5;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam = 1 }) =>
      makeAPICall({
        queryKey: [
          queryKey,
          method,
          `${path}/${postId}?page=${pageParam}&limit=${LIMIT}`,
        ],
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.length === LIMIT) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });

  if (isLoading)
    return (
      <p className="flex justify-center items-center mt-2 text-sm text-blue-600">
        <Loader className="animate-spin" size={18} />
      </p>
    );

  return (
    <div
      className="space-y-4 mt-4 overflow-y-auto pr-1 mx-auto"
      style={{
        maxHeight: "300px",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {status === "error" && <ErrorMessage message="Failed to load comments" />}
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page?.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      ))}
      {hasNextPage && (
        <div className="text-center mt-2">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-blue-600 text-sm hover:underline disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load More Comments"}
          </button>
        </div>
      )}
      {!hasNextPage && (
        <p className="text-center text-sm text-gray-500">No more comments</p>
      )}
    </div>
  );
}
