import {
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/state/api"

import { Task as TaskType } from "@/state/api"
import { drop } from "lodash"
import React from "react"
import { DndProvider, useDrag } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useDrop } from "react-dnd"
import {
  EllipsisVertical,
  MessageSquare,
  MessageSquareMore,
  Plus,
  Trash,
  User,
  User2Icon,
  UserCircle,
  UserCircle2,
} from "lucide-react"

import { format } from "date-fns"
import Image from "next/image"

type BoardProps = {
  id: string
  setIsModalNewTaskOpen: (isOpen: boolean) => void
}

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"]

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: id }, { refetchOnFocus: true })
  const [updateTaskStatus] = useUpdateTaskStatusMutation()

  const moveTask = (taskId: string, toStatus: string) => {
    updateTaskStatus({
      taskId,
      status: toStatus,
    })
  }

  if (isLoading) return <h1>Loading...</h1>
  if (error) return <h1>An error occurred while fetching tasks</h1>
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  )
}

type TaskColumnProps = {
  status: string
  tasks: TaskType[]
  moveTask: (taskId: string, toStatus: string) => void
  setIsModalNewTaskOpen: (isOpen: boolean) => void
}

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: "task",
    drop: (item: { id: string }) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  const statusColor: any = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  }

  const taskCount = tasks.filter((task) => task.status === status).length

  return (
    <div
      ref={(instance) => {
        drop(instance)
      }}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : null}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] `}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}{" "}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none  dark:bg-dark-tertiary "
              style={{ width: "1.5rem ", height: "1.5rem" }}
            >
              {taskCount}
            </span>
          </h3>
          <div className="flex items-center gap-1 ">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <TaskSingle key={task.id} task={task} />
        ))}
    </div>
  )
}

type TaskProps = {
  task: TaskType
}

const TaskSingle = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const [deleteTask] = useDeleteTaskMutation()

  const taskTagsSplit = task.tags ? task.tags.split(",") : []

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : null

  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : null

  const PriorityTags = ({ priority }: { priority: TaskType["priority"] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${priority === "Urgent" ? "bg-red-200 text-red-700" : priority === "High" ? "bg-yellowe-200 text-yellow-700" : priority === "Medium" ? "bg-green-200 text-green-700" : priority === "Low" ? "bg-blue-200 text-blue-700" : "bg-gray-200 text-gray-700"}`}
    >
      {priority}
    </div>
  )

  const handleDeleteTask = async (id: string) => {
    try {
      if (!id) {
        return alert("Something went wrong")
      }
      console.log(id)
      await deleteTask({ id })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div
      ref={(instance) => {
        drag(instance)
      }}
      className={`mb-3 rounded-md bg-white shadow dark:bg-dark-secondary ${isDragging ? "opacity-50" : "opacity-100"} `}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`https://pm-s3-bucket-12er3te.s3.eu-north-1.amazonaws.com/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap  items-center gap-2">
            {task.priority && <PriorityTags priority={task.priority} />}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <button className="flex h-6 w-6 flex-shrink-0 items-center justify-center dark:text-neutral-500">
            <Trash onClick={() => handleDeleteTask(task.id)} />
          </button>
        </div>
        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === "number" && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-neutral-500">
          {formattedStartDate && <span>{formattedStartDate}</span>} -
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>
        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-[6px] overflow-hidden">
            {task.assignee && (
              <div className="flex gap-2">
                {task.assignee.profilePictureUrl ? (
                  <img
                    key={task.assignee.profilePictureUrl}
                    src={task.assignee.profilePictureUrl}
                    alt={`${task.author.username}`}
                    width={30}
                    height={30}
                    className="h-8 w-8  rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                  />
                ) : (
                  <UserCircle2 />
                )}

                <p className="pt-2 text-md">{task.assignee.username}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardView
