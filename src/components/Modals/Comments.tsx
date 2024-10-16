"use client"
import Modal from "@/components/Modals/Modal"
import {
    useCreateCommentMutation,
   useGetCommentsQuery,

} from "@/state/api"
import React, { useState } from "react"
import { formatISO } from "date-fns"
import { useAppSelector } from "@/app/redux"
import {useRouter} from "next/navigation";
import {Send, SendHorizonal} from "lucide-react";
import CommentByUser from "@/components/CommentByUser";


type Props = {
    userId:string
    taskId:string
    isOpen: boolean
    onClose: () => void
}

const Comments = ({userId, taskId, isOpen, onClose }: Props) => {
   const [createComment, isError] = useCreateCommentMutation()
    const router = useRouter()
    const {data: comments} = useGetCommentsQuery(taskId
        )
    const [text, setText] = useState("")

    const handleSubmit = async () => {
        if(text === ""){
            return alert("Please enter a comment")
        }
        const comment = await createComment({
            text,
            userId,
            taskId
        })
        if(!comment){
            return  alert("Something went wrong")
        }

        setText("")
        window.location.reload()

    }





    return (
        <Modal isOpen={isOpen} onClose={onClose} name="Create new Project">





            <div className="w-full items-start justify-center" >
                {comments &&  comments.map((comment) =>
                 (   <CommentByUser key={comment.id} text={comment.text} username={comment.user.username} profileUrl={comment.user.profilePictureUrl}  />)
                )}

                <div className="w-full  gap-2 px-2 flex h-50">
                    <input value={text} onChange={(e)=>setText(e.target.value)} className="rounded-md  p-2 h-8 border-2  w-full" placeholder="Write your comment below"/>
                    <SendHorizonal onClick={handleSubmit}/>
                </div>

            </div>


        </Modal>
    )
}

export default Comments


