import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import TableHeader from "@/components/Table/TableHeader";
import TableBody from "@/components/Table/TableBody";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/helpers";

const tableHeaders = [
  { name: "ID", sortable: true, fixedWidth: "w-1/6", draggable: false },
  { name: "First Name", sortable: true, draggable: true },
  { name: "Last Name", sortable: true, draggable: true },
  { name: "Email", sortable: true, draggable: true },
  { name: "City", sortable: true, draggable: true },
  { name: "Registered Date", sortable: true, draggable: true },
  { name: "Full Name", sortable: true, draggable: true },
  { name: "Date since registered", sortable: true, draggable: true },
];

const Table = ({ users, isLoading, loadMoreUsers }) => {
  const [headers, setHeaders] = useState(tableHeaders);
  const [dragOver, setDragOver] = useState(null);

  useEffect(() => {
    const storedHeaders = getFromLocalStorage("headers");

    const differFromStored =
      storedHeaders.length &&
      JSON.stringify(storedHeaders) !== JSON.stringify(headers);

    console.log("differFromStored", differFromStored);

    if (differFromStored) {
      setHeaders(storedHeaders);
    } else {
      setHeaders(tableHeaders);
    }
  }, [setHeaders]);

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
      const draggedColIdx = e.dataTransfer.getData("colIdx");
      const tempCols = [...headers];

      tempCols[draggedColIdx] = headers[droppedColIdx];
      tempCols[droppedColIdx] = headers[draggedColIdx];

      setHeaders(tempCols);
      setDragOver(null);
    }
  };

  return (
    <div className="overflow-x-auto max-h-screen">
      <div className="flex flex-col align-center justify-content-center dark:bg-gray-800 px-4 py-4 items-center">
        <span className="text-gray-300">
          Do you want to save new table order?
        </span>
        <div className="flex mt-3">
          <button
            onClick={() => saveToLocalStorage("headers", headers)}
            className="text-white mr-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded uppercase"
          >
            Yes
          </button>
          <button className="text-white bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded uppercase">
            No
          </button>
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-300 dark:text-gray-400">
        <TableHeader
          headers={headers}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleOnDrop}
          onDragEnter={handleDragEnter}
          dragOver={dragOver}
        />
        <TableBody users={users} dragOver={dragOver} headers={headers} />
      </table>
      <Loader isLoading={isLoading} loadMoreCallback={loadMoreUsers} />
    </div>
  );
};

export default Table;
