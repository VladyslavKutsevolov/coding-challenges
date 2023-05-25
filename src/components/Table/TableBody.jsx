import React from "react";
import { toCamelCase } from "@/utils/helpers";

const TableBody = ({ users, headers }) => {
  if (!users.length) {
    return "No users";
  }

  const getTableCell = (colName, data) => {
    if (colName === "ID") {
      return data["id"];
    }

    return data[toCamelCase(colName)];
  };

  return (
    <tbody>
      {users.map((user) => (
        <tr
          key={user.id}
          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
        >
          {Object.entries(user).map(([k, v], idx) => {
            const colName = headers[idx].name;
            return (
              <td key={k} className="px-3 py-4">
                {getTableCell(colName, user)}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
