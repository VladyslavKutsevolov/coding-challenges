import React, { useCallback, useRef, useState } from "react";
import { generateFakeData } from "@/utils/helpers";

const UseInfiniteScroll = (users, setUsers) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasDynamicUsers, setHasDynamicUsers] = useState(false);
  const [dynamicUsers, setDynamicUsers] = useState(users);
  const observerRef = useRef();
  const loadMoreTimeout = setTimeout(() => null, 500);
  const loadMoreTimeoutRef = useRef(loadMoreTimeout);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];

      if (target.isIntersecting) {
        setIsLoading(true);

        clearTimeout(loadMoreTimeoutRef.current);

        loadMoreTimeoutRef.current = setTimeout(() => {
          const fetchedUsers = generateFakeData(100);

          if (fetchedUsers.length) {
            const newUsers = [...users, ...fetchedUsers];
            setDynamicUsers(newUsers);
            setUsers(newUsers);
            setHasDynamicUsers(true);
            setIsLoading(false);
          }
        }, 500);
      }
    },
    [loadMoreTimeoutRef, setIsLoading, dynamicUsers]
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
    hasDynamicUsers,
    dynamicUsers,
  };
};

export default UseInfiniteScroll;
