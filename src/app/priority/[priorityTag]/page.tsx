import React from "react"
import ReusablePriority from "../reusablePriorityPage"
import { Priority } from "@/state/api"

type Props = {
  params: { priorityTag: string }
}

const Urgent = ({ params }: Props) => {
  const { priorityTag } = params

  let priority: Priority | undefined
  if (priorityTag === "urgent") {
    priority = Priority.Urgent
  } else if (priorityTag === "high") {
    priority = Priority.High
  } else if (priorityTag === "medium") {
    priority = Priority.Medium
  } else if (priorityTag === "low") {
    priority = Priority.Low
  } else if (priorityTag === "backlog") {
    priority = Priority.Backlog
  } else {
    return null
  }

  return <ReusablePriority priority={priority} />
}

export default Urgent
