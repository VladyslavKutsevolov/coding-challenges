import { useState } from "react";
import { Table } from "@/components/Table";
import { generateFakeData } from "@/utils/helpers";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { useUser } from "@auth0/nextjs-auth0/client";

export async function getServerSideProps() {
  const usersData = generateFakeData(100);

  return {
    props: {
      usersData,
    },
  };
}

export default function Home({ usersData }) {
  const { user: currentUser, error, isLoading: userLoading } = useUser();

  if (userLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const [users, setUsers] = useState(usersData);

  const { dynamicUsers, hasDynamicUsers, isLoading, loadMoreUsers } =
    useInfiniteScroll(users, setUsers);

  const renderAuth = () => {
    if (!currentUser) {
      return (
        <a
          href="/api/auth/login"
          className="border border-white text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
        >
          Log in
        </a>
      );
    }

    return (
      <a
        href="/api/auth/logout"
        className="border border-white text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
      >
        Log out
      </a>
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
