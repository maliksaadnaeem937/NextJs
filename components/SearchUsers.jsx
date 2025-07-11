"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
import debounce from "lodash.debounce";
import Link from "next/link";

export default function SearchUsers() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const limit = 5;

  const fetchUsers = async () => {
    if (!query.trim()) return { users: [] };
    const res = await axios.get(
      `/protected/search-users?q=${query}&page=${page}&limit=${limit}`
    );
    return res.data;
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["search-users", query, page],
    queryFn: fetchUsers,
    enabled: !!query,
    keepPreviousData: true,
  });

  // Update users list when query or page changes
  useEffect(() => {
    if (data?.users) {
      if (page === 1) {
        setUsers(data.users);
      } else {
        setUsers((prev) => [...prev, ...data.users]);
      }
      setHasMore(data.users.length === limit);
    }
  }, [data]);

  const debouncedChange = debounce((e) => {
    setQuery(e.target.value);
    setPage(1);
  }, 300);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        onChange={debouncedChange}
        placeholder="Search developers..."
        className="w-full px-4 py-2 border rounded-full shadow-sm focus:outline-none"
      />

      {query && (
        <div className="absolute left-0 w-full mt-2 bg-white shadow-lg border border-gray-200 rounded-lg z-10 max-h-96 overflow-auto">
          <div className="p-2">
            {isLoading && page === 1 ? (
              <p className="text-sm text-gray-500 px-2 py-2">Searching...</p>
            ) : users.length === 0 ? (
              <p className="text-sm text-gray-400 px-2 py-2">No users found.</p>
            ) : (
              <>
                {users.map((user) => (
                  <Link
                    key={user._id}
                    href={`/users/${user._id}`}
                    className="flex items-center gap-4 p-3 border-b hover:bg-gray-50 rounded-md transition"
                  >
                    <img
                      src={user.profilePic || "/default-avatar.png"}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">
                        {user.bio || "No bio"}
                      </p>
                    </div>
                  </Link>
                ))}
                {hasMore && (
                  <button
                    disabled={isFetching}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="text-sm text-blue-600 hover:underline mt-2 ml-2"
                  >
                    {isFetching ? "Loading..." : "Show more..."}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
