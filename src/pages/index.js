import { useState } from "react";
import { Table } from "@/components/Table";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export async function getServerSideProps() {
  const fetchUsers = await fetch("http://localhost:3000/api/user/getUsers", {
    method: "GET",
  });

  const usersData = await fetchUsers.json();

  return {
    props: {
      usersData,
    },
  };
}

export default function Home({ usersData }) {
  const [users, setUsers] = useState(usersData);

  const { dynamicUsers, hasDynamicUsers, isLoading, loadMoreUsers } =
    useInfiniteScroll(users, setUsers);

  const { user: currentUser, error, isLoading: userLoading } = useUser();

  if (userLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const renderAuth = () => {
    if (!currentUser) {
      return (
        <Link
          href="/api/auth/login"
          className="border border-white text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
        >
          Log in
        </Link>
      );
    }

    return (
      <Link
        href="/api/auth/logout"
        className="border border-white text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
      >
        Log out
      </Link>
    );
  };

  return (
    <main>
      <header>
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div className="flex flex-wrap justify-end items-center">
            <div className="flex items-center">{renderAuth()}</div>
          </div>
        </nav>
      </header>
      <Table
        users={hasDynamicUsers ? dynamicUsers : users}
        isLoading={isLoading}
        loadMoreUsers={loadMoreUsers}
        setUsers={setUsers}
        currentUser={currentUser}
      />
    </main>
  );
}
