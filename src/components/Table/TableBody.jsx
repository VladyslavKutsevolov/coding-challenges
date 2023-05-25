import React from "react";
import { toCamelCase } from "@/utils/helpers";
import PropTypes from "prop-types";

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

TableBody.propTypes = {
  /** list of users data*/
  users: PropTypes.array.isRequired,

  /** table headers */
  headers: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
};

export default TableBody;
