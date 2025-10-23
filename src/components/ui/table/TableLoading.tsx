import React from "react";

const columns = [
  "Image",
  "First Name",
  "Last Name",
  "Email",
  "Phone",
  "Country",
  "Role",
  "Created At",
  "Active",
  "Blocked",
  "Actions",
];

const TableLoading: React.FC = () => {
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 select-none"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((_, colIdx) => (
                <td key={colIdx} className="px-5 py-4">
                  <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableLoading; 