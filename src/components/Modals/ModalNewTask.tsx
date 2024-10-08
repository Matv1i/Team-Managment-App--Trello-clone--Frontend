"use client"
import Modal from "@/components/Modals/Modal"
import {
  Priority,
  Status,
  useCreateProjectMutation,
  useCreateTaskMutation,
  useGetCurrentUserInfoQuery,
  User,
} from "@/state/api"
import React, { useEffect, useState } from "react"
import { formatISO } from "date-fns"
import { useAppSelector } from "@/app/redux"

type Props = {
  isOpen: boolean
  onClose: () => void
  id: string
}

const ModalNewTask = ({ isOpen, onClose, id }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<Status>(Status.ToDo)
  const [priority, setPriority] = useState<Priority>(Priority.Backlog)
  const [tags, setTags] = useState("")
  const [startDate, setStartDate] = useState(new Date())
  const [dueDate, setDueDate] = useState("")
  const userId = useAppSelector((state) => state.global.userId)
  const [assignedUserId, setAssignedUserId] = useState("")
  const [projectId, setProjectId] = useState("")
  const { data: user } = useGetCurrentUserInfoQuery()

  const handleSubmit = async () => {
    console.log(status)
    console.log(priority)
    setProjectId(id)

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    })

    const formattedDueDate = formatISO(new Date(dueDate), {
      representation: "complete",
    })
    console.log(typeof formattedDueDate)
    console.log(projectId)
    const newTask = await createTask({
      title,
      description,
      status,
      priority,
      tags,
      startDate: formattedStartDate,
      dueDate: formattedDueDate,
      authorUserId: userId,
      assignedUserId: assignedUserId,
      projectId,
    })
    console.log(newTask)
    if (newTask.error) {
      alert("Something went wrong")
    } else {
      onClose()
    }
  }

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none"

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none"

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
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
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="">Select Status</option>
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>Work In Progress</option>
            <option value={Status.UnderReview}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            className={selectStyles}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="">Select Priority</option>
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
          <input
            type="date"
            className={inputStyles}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <input
          type="text"
          className={inputStyles}
          placeholder="Assigned User ID"
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
        />

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 `}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  )
}

export default ModalNewTask
