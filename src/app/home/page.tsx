"use client"
import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api"
import React from "react"
import { useAppSelector } from "../redux"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import Header from "@/components/Header"
import {
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  BarChart,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { fill } from "lodash"
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils"

const HomePage = () => {
  const {
    data: tasks,
    isLoading: taskLoading,
    isError: isTaskError,
  } = useGetTasksQuery({ projectId: parseInt("1") })
  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery()

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  if (taskLoading || isProjectsLoading) return <div> Loading</div>
  if (isTaskError || !tasks || !projects) return <div> Error fetching data</div>

  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1
      return acc
    },
    {}
  )

  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active"
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    {}
  )
  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }))
  const taskColumns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "priority", headerName: "Priority", width: 150 },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 150,
    },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
      }
  const taskDistribiuion = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }))

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Header name="Project Managment Dashboard" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary ">
          <h3 className="md-4 text-lg font-semibold dark:text-white">
            Task Priority Distribuition
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribiuion}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "min-content",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary ">
          <h3 className="md-4 text-lg font-semibold dark:text-white">
            Project Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="count" data={projectStatus} fill="#83ca9d" label>
                {projectStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2 ">
          <h3 className="md-4 text-lg font-semibold dark:text-white">
            Your Task
          </h3>
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={tasks}
              columns={taskColumns}
              checkboxSelection
              loading={taskLoading}
              getRowClassName={() => "data-grid-row"}
              getCellClassName={() => "data-grid-cell"}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
