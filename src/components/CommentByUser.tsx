

type Props = {
    text:string
    profileUrl:string
    username:string



}

const CommentByUser =  ({ text, username, profileUrl}:Props)=>{

    return(<div className=" gap-2 flex my-2 w-full">
        <div className="w-11 h-11 " >
            <img className="h-full object-cover rounded-full "  src={profileUrl} alt={username}/>
        </div>
        <div className="flex flex-col justify-start">
            <div>
                <p className="text-md font-bold">
                    {username}
                </p>



            </div>

            <p>
                {text}
            </p>
        </div>


    </div>)

}
export default CommentByUser;