import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader/Loader";
import { TableBody, TableHeader } from "@/components/Table";
import { getFromLocalStorage } from "@/utils/helpers";
import SaveTableOrderPopup from "@/components/Table/SaveTableOrderPopup";
import PropTypes from "prop-types";

const tableHeaders = [
  {
    name: "ID",
    sortable: true,
    fixedWidth: "w-1/6",
    draggable: false,
    sortKey: "id",
  },
  { name: "First Name", sortable: true, draggable: true, sortKey: "firstName" },
  { name: "Last Name", sortable: true, draggable: true, sortKey: "lastName" },
  { name: "Email", sortable: true, draggable: true, sortKey: "email" },
  { name: "City", sortable: true, draggable: true, sortKey: "city" },
  {
    name: "Registered Date",
    sortable: true,
    draggable: true,
    sortKey: "registeredDate",
  },
  { name: "Full Name", sortable: true, draggable: true, sortKey: "fullName" },
  {
    name: "Date since registered",
    sortable: true,
    draggable: true,
    sortKey: "dateSinceRegistered",
  },
];

const hasHeadersChanged = (actual, stored) =>
  stored?.length && JSON.stringify(stored) !== JSON.stringify(actual);

const compareValues = (value1, value2, dataType, direction) => {
  let result;

  switch (dataType) {
    case "number":
      result = value1 - value2;
      break;
    case "string":
      result = value1.localeCompare(value2);
      break;
    case "date":
      result = new Date(value1) - new Date(value2);
      break;
    default:
      result = 0;
  }

  return direction === "asc" ? result : -result;
};

const Table = ({ users, isLoading, loadMoreUsers, setUsers, currentUser }) => {
  const [headers, setHeaders] = useState(tableHeaders);
  const [dragOver, setDragOver] = useState(null);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const storedHeaders = getFromLocalStorage("headers");

    const differFromDefaultHeaders = hasHeadersChanged(headers, storedHeaders);

    if (differFromDefaultHeaders) {
      setHeaders(storedHeaders);
    } else {
      setHeaders(tableHeaders);
    }
  }, []);

  const handleDragStart = (e) => {
    const { column: columnIdx } = e.target.dataset;
    e.dataTransfer.setData("colIdx", columnIdx);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDragEnter = (e) => {
    const { column: columnIdx } = e.target.dataset;

    if (columnIdx) {
      setDragOver(Number(columnIdx));
    }
  };

  const handleOnDrop = (e) => {
    const { column: columnIdx } = e.target.dataset;
    if (columnIdx) {
      const droppedColIdx = headers.findIndex(
        (_, i) => Number(columnIdx) === i
      );
      const draggedColIdx = Number(e.dataTransfer.getData("colIdx"));
      const tempCols = [...headers];

      tempCols[draggedColIdx] = headers[droppedColIdx];
      tempCols[droppedColIdx] = headers[draggedColIdx];

      const storedHeaders = getFromLocalStorage("headers");

      const headersOrderHasChanged = !storedHeaders
        ? hasHeadersChanged(tempCols, tableHeaders)
        : hasHeadersChanged(tempCols, storedHeaders);

      if (headersOrderHasChanged) {
        setConfirmPopup(true);
      }

      setHeaders(tempCols);
      setDragOver(null);
    }
  };

  const handleSort = (column) => {
    if (!column.sortable) return;

    let direction = "asc";
    if (sortColumn === column.sortKey && sortDirection === "asc") {
      direction = "desc";
    }

    setSortColumn(column.sortKey);
    setSortDirection(direction);

    const sortedUsers = [...users].sort((a, b) => {
      const valueA = a[column.sortKey];
      const valueB = b[column.sortKey];

      if (column.sortKey === "registeredDate") {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);

        return compareValues(dateA, dateB, "date", direction);
      } else if (column.sortKey === "dateSinceRegistered") {
        const splitedValueA = Number(valueA.split(" ")[0]);
        const splitedValueB = Number(valueB.split(" ")[0]);

        return compareValues(splitedValueA, splitedValueB, "number", direction);
      } else if (typeof valueA === "string" && typeof valueB === "string") {
        return compareValues(valueA, valueB, "string", direction);
      } else {
        return compareValues(valueA, valueB, typeof valueA, direction);
      }
    });

    setUsers(sortedUsers);
  };

  return (
    <div className="overflow-x-auto max-h-screen">
      <Loader isLoading={isLoading} />
      {currentUser && (
        <SaveTableOrderPopup
          headers={headers}
          show={confirmPopup}
          close={() => setConfirmPopup(false)}
        />
      )}
      <table className="w-full text-sm text-left text-gray-300 dark:text-gray-400">
        <TableHeader
          headers={headers}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleOnDrop}
          onDragEnter={handleDragEnter}
          dragOver={dragOver}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />

        <TableBody users={users} dragOver={dragOver} headers={headers} />
      </table>
      {!isLoading ? <div ref={loadMoreUsers}></div> : null}
    </div>
  );
};

Table.propTypes = {
  /** users data */
  users: PropTypes.array.isRequired,

  /** fetching user data */
  isLoading: PropTypes.bool.isRequired,

  /** trigger next batch of users to be loaded */
  loadMoreUsers: PropTypes.func.isRequired,

  /** saving users to state */
  setUsers: PropTypes.func.isRequired,

  /** auth0 user */
  currentUser: PropTypes.shape({}),
};

export default Table;
