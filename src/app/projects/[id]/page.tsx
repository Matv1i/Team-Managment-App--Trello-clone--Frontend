"use client"
import ProjectHeader from '@/components/ProjectHeader'
import React, { useState } from 'react'


type Props = {
  params:{id:string}
}

const Project = ({params}:Props) => {

  const {id} = params;
  const [activeTab, setActiveTab] =useState("Board")
  const [isModalNewTaskOpen, setisModalNewTaskOpen] =useState(false)
  return (
    <div>
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab}/>
      
    </div>
  )
}

export default Project
