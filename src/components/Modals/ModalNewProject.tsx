import Modal from "@/components/Modals/Modal"
import {
  useCreateProjectMutation,
  useGetCurrentUserInfoMutation,
} from "@/state/api"
import React, { useState } from "react"
import { formatISO } from "date-fns"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ModalNewProject = ({ isOpen, onClose }: Props) => {
  const [createProject, { isLoading }] = useCreateProjectMutation()
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [getCurrentUserInfo] = useGetCurrentUserInfoMutation()

  const handleSubmit = async () => {
    if (!isFormValid()) return

    const user = await getCurrentUserInfo().unwrap()
    if (user) {
      setUserId(user.userId)
    }

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    })
    const formattedEndDate = formatISO(new Date(endDate), {
      representation: "complete",
    })

    const newProject = await createProject({
      name: projectName,
      description,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      userId,
    })

    if (newProject.error) {
      alert("Something went wrong")
    } else {
      onClose()
    }
  }

  const isFormValid = () => {
    return projectName && description && startDate && endDate
  }

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none"

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create new Project">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={inputStyles}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={`mt-4 flex justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-bg-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>
    </Modal>
  )
}

export default ModalNewProject
