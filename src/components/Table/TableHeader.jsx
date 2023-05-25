import React from "react";

const TableHeader = ({
  headers,
  onDragStart,
  dragOver,
  onDragEnter,
  onDragOver,
  onDrop,
  onSort,
  sortColumn,
  sortDirection,
}) => {
  const handleSort = (sortKey) => {
    onSort(sortKey);
  };

  const getSortIcon = (sortKey) => {
    if (!sortColumn) {
      return "▼";
    }
    if (sortColumn === sortKey) {
      return sortDirection === "asc" ? "▲" : "▼";
    }
    return null;
  };

  const sortedHeaders = headers.map((header) => {
    return {
      ...header,
      sortIcon: getSortIcon(header.sortKey),
    };
  });

  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
      <tr>
        {sortedHeaders.map((header, i) => (
          <th
            key={header?.name}
            data-column={i}
            scope="col"
            className={`shadow-lg shadow-slate-500 px-3 py-3 ${
              header?.fixedWidth ? "w-1/6" : ""
            } ${
              i === dragOver ? "border-solid border-l-2 border-red-600" : ""
            } ${header.draggable ? "cursor-pointer" : ""}`}
            draggable={header.draggable}
            onDragStart={onDragStart}
            onDragEnd={() => i === dragOver}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={() => {
              if (header.sortable) {
                handleSort(header);
              }
            }}
          >
            <div className="flex items-center">
              <span className="whitespace-nowrap">{header?.name}</span>
              {header?.sortable && (
                <span className="ml-1 cursor-pointer">{header.sortIcon}</span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
