import React, { useState, useMemo } from "react";

interface Column {
  label: string;
  key: string;
}

interface DataTableProps {
  data: {
    columns: Column[];
    rows: Record<string, any>[];
  };
}

type SortDirection = "asc" | "desc" | null;

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const { columns } = data;
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const sortedRows = useMemo(() => {
    if (!sortKey || !sortDirection) return data.rows;

    return [...data.rows].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return 0;
    });
  }, [data.rows, sortKey, sortDirection]);

  const onSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection("asc");
    } else {
      setSortDirection((prevDirection) =>
        prevDirection === null || prevDirection === "desc" ? "asc" : "desc"
      );
    }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f5f5f5",
                }}
                onClick={() => {
                  onSort(col.key);
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: "8px", textAlign: "center", color: "#666" }}
              >
                No data available
              </td>
            </tr>
          ) : (
            sortedRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{ border: "1px solid #ccc", padding: "8px" }}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
