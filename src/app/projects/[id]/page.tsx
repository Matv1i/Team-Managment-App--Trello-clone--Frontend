"use client"
import ProjectHeader from "@/components/ProjectHeader"
import React, { useEffect, useState } from "react"
import BoardView from "../BoardView"
import ListView from "../ListView"
import TimelineView from "../TimeLine"
import TableView from "../TableView"
import { useGetTasksQuery } from "@/state/api"
import NoProjects from "../NoTasks"

type Props = {
  params: { id: string }
}

const Project = ({ params }: Props) => {
  const { id } = params
  console.log(id)
  const [activeTab, setActiveTab] = useState("Board")
  const [isModalNewTaskOpen, setisModalNewTaskOpen] = useState(false)
  const [taskExist, setTaskExist] = useState(false)

  const { data: tasks } = useGetTasksQuery({
    projectId: id,
  })

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      setTaskExist(true)
    } else {
      setTaskExist(false)
    }
  }, [tasks])

  if (!taskExist) {
    return <NoProjects id={id} />
  }

  return (
    <div>
      <ProjectHeader
        taskExist={taskExist}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "Board" && (
        <BoardView id={id} setIsModalNewTaskOpen={setisModalNewTaskOpen} />
      )}
      {activeTab === "List" && (
        <ListView id={id} setIsModalNewTaskOpen={setisModalNewTaskOpen} />
      )}
      {activeTab === "Timeline" && (
        <TimelineView id={id} setIsModalNewTaskOpen={setisModalNewTaskOpen} />
      )}
      {activeTab === "Table" && (
        <TableView id={id} setIsModalNewTaskOpen={setisModalNewTaskOpen} />
      )}
    </div>
  )
}

export default Project
