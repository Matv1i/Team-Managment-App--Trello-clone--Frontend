import { Project } from "@/state/api"
import { format } from "date-fns"
import React from "react"

type Props = {
  project: Project
}

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="rounded border p-4 shadow">
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <p>
        Start Date:
        {project.startDate ? format(new Date(project.startDate), "P") : "N/A"}
      </p>
      <p>
        End Date:
        {project.endDate ? format(new Date(project.endDate), "P") : "N/A"}
      </p>
    </div>
  )
}

export default ProjectCard
