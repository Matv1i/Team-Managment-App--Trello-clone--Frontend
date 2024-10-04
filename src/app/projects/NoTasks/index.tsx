"use client"

import ModalNewTask from "@/components/Modals/ModalNewTask"
import { PlusSquare } from "lucide-react"
import React, { useState } from "react"
type props = {
  id: string
}
const NoProjects = ({ id }: props) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false)

  return (
    <div className="w-full h-full flex justify-center items-center">
      <ModalNewTask
        id={id}
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <div className="flex flex-col gap-4 justify-center">
        <h1 className="text-4xl">You dont have tasks yet!</h1>
        <div className="flex w-full justify-center">
          {" "}
          <button
            className="flex items-center dark:text-white  rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600 h-[40px]"
            onClick={() => setIsModalNewProjectOpen(true)}
          >
            Create Your First Task
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoProjects
