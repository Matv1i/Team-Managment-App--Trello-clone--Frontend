import React from "react"
import ReusablePriority from "../reusablePriorityPage"
import { Priority } from "@/state/api"

const Urgent = () => {
  return <ReusablePriority priority={Priority.Urgent} />
}

export default Urgent
