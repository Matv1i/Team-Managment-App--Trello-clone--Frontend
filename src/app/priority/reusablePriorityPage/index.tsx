"use client"
import { columns } from "@/app/projects/TableView"
import { useAppSelector } from "@/app/redux"
import TaskCard from "@/components/Cards/TaskCard"
import Header from "@/components/Header"
import ModalNewTask from "@/components/Modals/ModalNewTask"
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils"
import {
  Priority,
  Task,
  useGetCurrentUserInfoMutation,
  useGetTaskByUserQuery,
} from "@/state/api"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import React, { useState } from "react"

type Props = {
  priority: Priority
}

const ReusablePriority = ({ priority }: Props) => {
  const [view, setView] = useState("list")
  const [isModalOpen, setIsOpenModal] = useState(false)

  const { data: user } = useGetCurrentUserInfoMutation()
  const {
    data: tasks,
    isLoading,
    isError: isTaskError,
  } = useGetTaskByUserQuery(user.userId)

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const filteredTask = tasks?.filter((task: Task) => task.priority === priority)

  if (isTaskError || !tasks) return <div> Error Fetching tasks</div>
  return (
    <div className="m-5 p-4">
      <ModalNewTask
        isOpen={isModalOpen}
        onClose={() => setIsOpenModal(false)}
      />
      <Header
        name="Priority Page"
        buttonComponent={
          <button
            className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => setIsOpenModal(true)}
          >
            Add Task
          </button>
        }
      />
      <div className="mb-4 flex justify-start">
        <button
          className={`px-4 py-2 ${view === "list" ? "bg-gray-300" : "bg-white"} rouned-l`}
          onClick={() => setView("list")}
        >
          List
        </button>
        <button
          className={`px-4 py-2 ${view === "table" ? "bg-gray-300" : "bg-white"} rouned-l`}
          onClick={() => setView("table")}
        >
          Table
        </button>
      </div>
      {isLoading ? (
        <div>Loading tasks...</div>
      ) : view === "list" ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredTask?.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        view === "table" &&
        filteredTask && (
          <div className="w-full">
            <DataGrid
              rows={filteredTask}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row.id}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        )
      )}
    </div>
  )
}

export default ReusablePriority
