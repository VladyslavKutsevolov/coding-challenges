import { useState } from "react";
import Table from "@/components/Table/Table";
import { generateFakeData } from "@/utils/helpers";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

export async function getServerSideProps() {
  const usersData = generateFakeData(100);

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

  return (
    <main>
      <Table
        users={hasDynamicUsers ? dynamicUsers : users}
        isLoading={isLoading}
        loadMoreUsers={loadMoreUsers}
      />
    </main>
  );
}
