import React, { useCallback, useRef, useState } from "react";

const UseInfiniteScroll = (users, setUsers) => {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef();
  const loadMoreTimeout = setTimeout(() => null, 500);
  const loadMoreTimeoutRef = useRef(loadMoreTimeout);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];

      if (target.isIntersecting) {
        setIsLoading(true);

        clearTimeout(loadMoreTimeoutRef.current);

        loadMoreTimeoutRef.current = setTimeout(async () => {
          const getUsers = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getUsers`, {
              method: "GET",
          });

          const fetchedUsers = await getUsers.json();

          if (fetchedUsers.length) {
            const newUsers = [...users, ...fetchedUsers];
            setUsers(newUsers);
            setIsLoading(false);
          }
        }, 500);
      }
    },
    [loadMoreTimeoutRef, setIsLoading, setUsers, users]
  );

  const loadMoreUsers = useCallback(
    (el) => {
      if (isLoading) return;

      if (observerRef.current) observerRef.current.disconnect();

      const option = {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      };

      observerRef.current = new IntersectionObserver(handleObserver, option);

      if (el) observerRef.current.observe(el);
    },
    [handleObserver, isLoading]
  );

  return {
    isLoading,
    loadMoreUsers,
  };
};

export default UseInfiniteScroll;
