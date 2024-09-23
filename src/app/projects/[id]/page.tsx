"use client"
import ProjectHeader from "@/components/ProjectHeader"
import React, { useState } from "react"
import BoardView from "../BoardView"
import ListView from "../ListView"
import TimelineView from "../TimeLine"
import TableView from "../TableView"

type Props = {
  params: { id: string }
}

const Project = ({ params }: Props) => {
  const { id } = params
  const [activeTab, setActiveTab] = useState("Board")
  const [isModalNewTaskOpen, setisModalNewTaskOpen] = useState(false)
  return (
    <div>
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
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
