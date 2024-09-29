"use client"
import React, { useState } from "react"
import Header from "./Header"
import {
  Clock,
  Filter,
  Grid3x3,
  List,
  PlusSquare,
  Share2,
  Table,
} from "lucide-react"
import ModalNewProject from "@/components/Modals/ModalNewProject"
import ModalNewTask from "./Modals/ModalNewTask"
type Props = {
  activeTab: string
  setActiveTab: (tabName: string) => void
  taskExist: boolean
}
const ProjectHeader = ({ activeTab, setActiveTab, taskExist }: Props) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false)
  return (
    <div className="px-4 xl:px-6">
      <ModalNewTask
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <div className="pb-6 pt-6 lg:pb-4 lg:pt-4 flex justify-between">
        <Header
          name="product design development"
          buttonComponent={
            <button
              className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={() => setIsModalNewProjectOpen(true)}
            >
              Add Task
            </button>
          }
        />
      </div>

      <div className="flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center ">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <TabButton
            taskExist={taskExist}
            name="Board"
            icon={<Grid3x3 className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          ></TabButton>
          <TabButton
            taskExist={taskExist}
            name="List"
            icon={<List className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          ></TabButton>
          <TabButton
            taskExist={taskExist}
            name="Timeline"
            icon={<Clock className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          ></TabButton>
          <TabButton
            taskExist={taskExist}
            name="Table"
            icon={<Table className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          ></TabButton>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <Filter className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <Share2 className="h-5 w-5" />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Task"
              className="rounded-md border py-1 pl-10 pr-4 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            />
            <Grid3x3 className="absolute left-3 top-2 h-4 w-4 text-gray-400 dark:text-neutral-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

type TabButtonProps = {
  name: string
  icon: React.ReactNode
  setActiveTab: (tabName: string) => void
  activeTab: string
  taskExist: boolean
}
const TabButton = ({
  name,
  icon,
  setActiveTab,
  activeTab,
  taskExist,
}: TabButtonProps) => {
  const isActive = activeTab === name

  return (
    <button
      disabled={!taskExist}
      className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[1.5px] after:w-full  max-md:w-1/4 hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white sm:px-2 lg:px-4 ${
        isActive ? "text-blue-600 after:bg-blue-600 dark:text-white" : ""
      }`}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  )
}

export default ProjectHeader
