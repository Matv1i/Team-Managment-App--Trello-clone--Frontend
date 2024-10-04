"use client"
import {
  Priority,
  Project,
  Task,
  useGetCurrentUserInfoMutation,
  useGetProjectIdQuery,
  useGetProjectsQuery,
  useGetTasksQuery,
  User,
} from "@/state/api"
import React, { useEffect, useState } from "react"
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
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils"

const HomePage = () => {
  const [userId, setUserId] = useState("")
  const [projectId, setProjectId] = useState("")

  const [getCurrentUserInfo] = useGetCurrentUserInfoMutation()

  // Получение информации о пользователе и ID проекта
  useEffect(() => {
    const fetchUserAndProject = async () => {
      try {
        // Получаем информацию о пользователе
        const user: User = await getCurrentUserInfo().unwrap()
        console.log(user)
        if (user) {
          setUserId(user.userId)
        }
      } catch (error) {
        console.error("Failed to fetch user info", error)
      }
    }
    fetchUserAndProject()
  }, [getCurrentUserInfo])

  // Используем хук useGetProjectIdQuery только после получения userId
  const { data: projectData, isLoading: projectLoading } = useGetProjectIdQuery(
    userId,
    {
      skip: !userId, // пропускаем запрос, если нет userId
    }
  )
  console.log(projectData)

  // Устанавливаем projectId при наличии данных
  useEffect(() => {
    if (projectData && projectData) {
      setProjectId(projectData as string)
    }
  }, [projectData])

  // Запрашиваем задачи по projectId только если он установлен
  const {
    data: tasks,
    isLoading: taskLoading,
    isError: isTaskError,
  } = useGetTasksQuery({ projectId }, { skip: !projectId })

  // Запрашиваем проекты по userId
  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery(
    userId,
    {
      skip: !userId,
    }
  )

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Отображаем лоадер, если идет загрузка данных
  if (taskLoading || isProjectsLoading || projectLoading)
    return <div>Loading...</div>

  // Ошибка при загрузке данных
  if (isTaskError || !tasks || !projects) return <div>Error fetching data</div>

  // Подсчет задач по приоритетам
  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1
      return acc
    },
    {}
  )

  // Подсчет статуса проектов
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

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }))

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Header name="Project Management Dashboard" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary ">
          <h3 className="md-4 text-lg font-semibold dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{ width: "min-content", height: "min-content" }}
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
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
          <h3 className="md-4 text-lg font-semibold dark:text-white">
            Your Tasks
          </h3>
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={tasks}
              columns={taskColumns}
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
