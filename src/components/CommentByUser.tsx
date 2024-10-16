

type Props = {
    text:string
    profileUrl:string
    username:string

}

const CommentByUser =  ({text, username, profileUrl}:Props)=>{

    return(<div className="flex w-full">
        <div className="w-14 rounded-full" >
            <img className=" " objec  src={profileUrl} alt={username}/>
        </div>


    </div>)

}
export default CommentByUser;