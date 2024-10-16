import Header from "@/components/Header"
import { useGetTasksQuery } from "@/state/api"
import React from "react"

import { GridColDef, DataGrid } from "@mui/x-data-grid"
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils"
import { useAppSelector } from "@/app/redux"
import { format } from "date-fns"

type Props = {
  id: string
  setIsModalNewTaskOpen: (isOpen: boolean) => void
}

export const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className="inline-flex rounded-md bg-green-100 px-2 text-xs font-semibold  eading-5 text-green-800">
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start date",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value?.author || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => console.log(params.assignee),
  },
]

const TableView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: id })
  if (isLoading) return <h1>Loading...</h1>
  if (error) return <h1>An error occurred while fetching tasks</h1>

  return (
    <div className="min-h-screen w-full px-4 pb-8 xl:px-6 text-xl font-bold">
      <div className="pt-5">
        <Header name="Table" isSmallText />
      </div>
      <DataGrid
        rows={tasks || []}
        columns={columns}
        className={dataGridClassNames}
        sx={dataGridSxStyles(isDarkMode)}
      />
    </div>
  )
}

export default TableView
