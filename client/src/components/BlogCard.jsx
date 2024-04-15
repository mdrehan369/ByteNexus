import React from 'react'
import cover from "../assets/cover.jpg"
import { useNavigate } from 'react-router-dom'

const changeDateIntoString = (date) => {
    //2024-03-22
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const dates = ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
    const dateObj = new Date(date);

    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()} ${dates[(dateObj.getDay() + 6) % 7]}`;
}

function BlogCard({ blog }) {

    const navigate = useNavigate();

    return (
        <div className='w-full h-[35vh] rounded-lg border-[1px] cursor-pointer hover:shadow-xl transition shadow-sm flex dark:bg-slate-800 dark:border-0 bg-gray-200 items-center justify-start border-blue-900' onClick={() => { navigate(`/blog/${blog._id}`) }} >
            <div className='p-10 w-[30%]'>
                <img src={blog.frontImage || cover} className='w-full h-full object-cover rounded-lg' />
            </div>
            <div className='w-[70%] h-full py-4 space-y-2 px-2'>
                <div className='flex items-center justify-between gap-4 w-full'>
                    <div className='flex gap-2'>
                        <img src={blog.blogUser.profilePic} className='size-10 object-cover rounded-full' />
                        <div>
                            <h1 className='text-md dark:text-white'>{blog.blogUser.name}</h1>
                            <h1 className='text-md dark:text-[#77a0b4] text-slate-400'>@{blog.blogUser.username}</h1>
                        </div>
                    </div>
                    <div className='flex items-center justify-end gap-4 mx-5'>
                        {
                            blog.topics.map((topic, index) => <div key={index} className='dark:bg-slate-700 bg-slate-400 p-2 text-sm text-slate-900 dark:text-slate-200 shadow-lg rounded-lg font-bold'>
                                {topic}
                            </div>)
                        }
                    </div>
                </div>
                <h1 className='text-2xl font-bold line-clamp-2'>{blog.title}</h1>
                <div className='dark:text-[#77a0b4] text-slate-600 line-clamp-3'>
                    {blog.description}
                </div>
                <div className='flex items-center justify-start gap-4 text-slate-400'>
                    <p><i className="fa-regular fa-heart m-2"></i>{blog.totalLikes}</p>
                    <p><i className="fa-regular fa-comment m-2"></i>{blog.totalComments}</p>
                    <p><i className="fa-regular fa-eye m-2"></i>{blog.totalViews}</p>
                    <p><i className="fa-solid fa-share self-end"></i></p>
                    <p className='text-sm justify-self-end ml-auto pr-4'>{changeDateIntoString(blog.createdAt.slice(0, 10))}</p>
                </div>
            </div>
        </div>
    )
}

export default BlogCard