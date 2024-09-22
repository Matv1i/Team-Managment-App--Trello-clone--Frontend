"use client"
import React, { useState } from 'react'
import Header from './Header'
import { Grid3x3 } from 'lucide-react'
type Props = {
  activeTab:string,
  setActiveTab:(tabName:string)=>void
}
const ProjectHeader = ({activeTab,setActiveTab}:Props) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] =  useState()
  return (
    <div className='px-4 xl:px-6'>
      <div className='pb-6 pt-6 lg:pb-4 lg:pt-4'>
      <Header name="product design elemnt"/>
      </div>

      <div className='flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center '>
      <div className='flex flex-1 items-center gap-2 md:gap-4'>
        <TabButton name="Board"
         icon={<Grid3x3 className='h-5 w-5'/>} setActiveTab={setActiveTab} activeTab={activeTab}></TabButton>
      </div>
      </div>
    </div>
  )
}

type TabButtonProps={
  name:string,
  icon:React.ReactNode,
  setActiveTab:(tabName:string)=>void,
  activeTab:string
}
const TabButton = ({name, icon, setActiveTab, activeTab}:TabButtonProps) =>{
const isActive = activeTab === name;

return(
  <button onClick={()=>setActiveTab(name)} className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[1px0 after:w-full hover:text-blue-600 dark:text-neutral-500 dark:hover-text-white sm:px-2 lg:px-4 ${isActive ? "text-blue-600 after:bg-blue-600 dark:text-white": null}`} >
    {icon}
    {name}
  </button>
)
}

export default ProjectHeader
