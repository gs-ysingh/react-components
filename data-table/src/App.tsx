import DataTable from "./DataTable/DataTable";

const data = {
  columns: [
    { label: "Name", key: "name" },
    { label: "Age", key: "age" },
    { label: "Salary", key: "salary" },
  ],
  rows: [
    { name: "Rahul", age: 38, salary: 121212 },
    { name: "Satish", age: 37, salary: 234234 },
  ],
};

export default function App() {
  return (
    <div className="App">
      <h1>Basic Data Table</h1>
      <DataTable data={data} />
    </div>
  );
}
