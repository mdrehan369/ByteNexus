import React, { useEffect, useState } from 'react'
import { Button, Container, Input, Spinner } from '../components'
import { useParams, NavLink } from 'react-router-dom'
import axios from 'axios';
import image from "../assets/cover.jpg"
import user from "../assets/user.png"
import { useDispatch, useSelector } from 'react-redux';
import { addBookmark } from '../store/authSlice.js';
import { useForm } from 'react-hook-form';
import userPic from "../assets/user.png";

const changeDateIntoString = (date) => {
    //2024-03-22
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const dates = ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
    const dateObj = new Date(date);

    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()} ${dates[(dateObj.getDay() + 6) % 7]}`;
}

function Blog() {

    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const loggedUser = useSelector(state => state.auth.user);
    const [isLiked, setIsLiked] = useState(false);
    const [totalLikes, setTotalLikes] = useState(0);
    const [commentOn, setCommentOn] = useState(false);
    const [likedOn, setLikedOn] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentLoader, setCommentLoader] = useState(true);
    const [likeUsers, setLikeUsers] = useState([]);
    const [bookmark, setBookmark] = useState(loggedUser.bookmarks.includes(blogId));
    const { register, handleSubmit, setValue } = useForm();
    const dispatch = useDispatch();

    useEffect(() => {
        ; (async () => {
            try {
                const response = await axios.get(`/api/v1/blogs/getBlog/${blogId}`);
                setBlog(response.data.data);
                const isLiked = await axios.get(`/api/v1/blogs/isLiked?userId=${loggedUser._id}&blogId=${response.data.data._id}`);
                setIsLiked(() => {
                    if (isLiked.data.data) return true;
                    return false;
                })
                setTotalLikes(response.data.data.likes.length);
                await axios.get(`/api/v1/blogs/markView?userId=${loggedUser._id}&blogId=${response.data.data._id}`);
                const likesUsers = await axios.get(`/api/v1/blogs/getUsersWhoLiked?blogId=${blogId}`);

                setLikeUsers(likesUsers.data.data);

            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        })()
    }, []);

    const handleToggleLike = async () => {
        try {
            await axios.get(`/api/v1/blogs/likeBlog/${blogId}`);
            setIsLiked((prev) => {
                if (prev) {
                    setTotalLikes((prev) => prev - 1);
                } else {
                    setTotalLikes((prev) => prev + 1);
                }
                return !prev;
            });
        } catch (e) {
            console.log(e);
        }
    }

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/v1/comments/getComments?blogId=${blogId}`);
            setComments(response.data.data);
        } catch (e) {
            console.log(e);
        } finally {
            setCommentLoader(false);
        }
    }

    useEffect(() => {
        fetchComments();
    }, []);

    const submit = async (data) => {
        try {
            data.blogId = blogId;
            await axios.post('/api/v1/comments/addComment', data);
            setCommentLoader(true);
            await fetchComments();
            setValue("content", "");
        } catch (e) {
            console.log(e);
        }
    }

    const handleLikeComment = async (id) => {
        try {
            await axios.get(`/api/v1/comments/likeComment?commentId=${id}`);
            // setIsCommentLiked((prev) => !prev);
            await fetchComments();
        } catch (e) {
            console.log(e);
        }
    }

    const handleLikeViewers = async () => {
        setLikedOn((prev) => !prev);
        console.log(likeUsers);
    }

    const handleToggleBookmark = async () => {
        try {
            await axios.get(`/api/v1/blogs/bookmark?blogId=${blogId}`);
            setBookmark((prev) => !prev);
            if (!bookmark) {
                dispatch(addBookmark({ type: 'add', data: blogId }));
            } else {
                dispatch(addBookmark({ type: 'remove', data: blogId }));
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Container className='relative'>
            {
                !loading ?
                    <>
                        <div className={`${likedOn ? 'flex' : 'hidden'} w-[20%] h-[70%] p-4 dark:bg-slate-800 rounded-lg flex-col items-center border-0 shadow-2xl z-50 justify-start gap-4 fixed top-[15%] right-[40%] overflow-y-scroll`}>
                            {
                                likeUsers.map((user, index) =>
                                    <NavLink key={index} className='w-full bg-slate-600 p-2 rounded-lg' to={`/profile/${user.likedUser.username}`}>
                                        <div className='flex items-center justify-start gap-4'>
                                            <img src={user.likedUser.profilePic || userPic} className='size-[40px] object-cover rounded-full' />
                                            <div className='text-lg'>
                                                <p>{user.likedUser.name}</p>
                                                <p className='text-sm text-slate-400'>@{user.likedUser.username}</p>
                                            </div>
                                        </div>
                                    </NavLink>
                                )
                            }
                        </div>
                        <div className={`sideBar bg-gray-200 dark:bg-slate-800 h-full ${commentOn ? 'w-[35%]' : 'w-[5%]'} fixed top-0 right-0 z-10 flex flex-col ${commentOn ? 'items-start' : ''} justify-center gap-10 text-lg dark:text-gray-400 transition-all shadow-2xl`}>
                            <div className={`absolute w-[80%] h-[90%] border-[2px] border-gray-400 dark:border-slate-600 rounded-md ${commentOn ? 'block' : 'hidden'} top-10 right-10 p-4 flex flex-col items-center justify-start divide-y-2 dark:divide-slate-600 divide-slate-400`}>
                                <div className='w-full h-[90%] flex flex-col items-center justify-start gap-4 overflow-y-scroll mb-4'>
                                    {
                                        !commentLoader ?
                                            comments.map((comment, index) =>
                                                <div key={index} className='w-full h-auto rounded-md bg-gray-100 dark:bg-slate-700 border-slate-600 border-[0px] p-2 dark:text-gray-200'>
                                                    <div className='flex items-center justify-start gap-2'>
                                                        <img src={comment.commentUser.profilePic || userPic} className='size-[40px] object-cover rounded-full' />
                                                        <div className=''>
                                                            <p>{comment.commentUser.name}</p>
                                                            <p className='text-sm text-slate-400'>@{comment.commentUser.username}</p>
                                                        </div>
                                                    </div>
                                                    {comment.content}
                                                    <div className='w-full flex items-center justify-between text-sm text-slate-400'>
                                                        <div className='space-x-6 flex items-center justify-center'>
                                                            <div className='space-x-2'>
                                                                <i className={`fa-heart fa-regular cursor-pointer`} onClick={() => { handleLikeComment(comment._id) }}></i>
                                                                <span>{comment.likedBy.length}</span>
                                                            </div>
                                                            <div className='space-x-2'>
                                                                <i className='fa-comment fa-regular cursor-pointer'></i>
                                                                <span>{comment.replies.length}</span>
                                                            </div>
                                                        </div>
                                                        <div className='flex items-center gap-2'>
                                                            <p>{changeDateIntoString(comment.createdAt.slice(0, 10))}</p>
                                                            <p>{comment.createdAt.slice(11, 16)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) :
                                            <Spinner />
                                    }
                                </div>
                                <form onSubmit={handleSubmit(submit)} className='w-[100%] h-[10%] flex items-center justify-center gap-4'>
                                    <Input register={register} name='content' className='dark:bg-slate-700 w-[20vw] m-0 text-[0.9em]' placeholder='Write a comment...' />
                                    <Button type='submit' className='dark:bg-slate-700'>
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </Button>
                                </form>
                            </div>
                            <div><i className={`fa-${isLiked ? 'solid text-red-500' : 'regular'} fa-heart cursor-pointer text-2xl mx-3`}
                                onClick={handleToggleLike}
                            ></i><span className='hover:underline cursor-pointer' onClick={handleLikeViewers}>{totalLikes}</span></div>
                            <div><i className="fa-regular fa-comment cursor-pointer text-2xl mx-3" onClick={() => setCommentOn((prev) => !prev)}></i>{blog.totalComments}</div>
                            <div onClick={handleToggleBookmark}><i className={`${bookmark ? 'fa-solid' : 'fa-regular'} fa-bookmark cursor-pointer text-2xl mx-3`}></i></div>
                            <div><i className="fa-solid fa-share-nodes cursor-pointer text-2xl mx-3"></i></div>
                        </div>
                        <div className={`w-[100%] flex flex-col items-center justify-start gap-10 ${commentOn ? 'opacity-50' : 'opacity-100'} transition`} onClick={() => {
                            setCommentOn(false);
                            setLikedOn(false);
                        }}>
                            <div className='w-[80%] h-[20%] text-6xl mt-[8vh] font-bold text-center'>
                                <h1>{blog.title}</h1>
                            </div>
                            <div className='flex items-center justify-center gap-4'>
                                <NavLink to={`/profile/${blog.blogUser.username}`} className='flex items-center justify-center gap-4'>
                                    <img src={blog.blogUser.profilePic || user} className='size-[50px] object-cover rounded-full' />
                                    <div>
                                        <p className='text-xl font-semibold'>{blog.blogUser.name}</p>
                                        <p className='text-md text-gray-400'>@{blog.blogUser.username}</p>
                                    </div>
                                </NavLink>
                                <div className='text-gray-400'>
                                    <p className='text-lg'>{changeDateIntoString(blog.createdAt.slice(0, 10))}</p>
                                    <p>{blog.createdAt.slice(11, 16)}</p>
                                </div>
                                <div className='flex flex-wrap gap-6'>
                                    {blog.topics.map((topic, index) => <div key={index} className='dark:bg-slate-800 bg-gray-200 text-md p-2 rounded-lg font-semibold dark:text-gray-400'>
                                        {topic}
                                    </div>)}
                                </div>
                            </div>
                            <div className='w-[80%] flex flex-col items-center justify-center gap-10'>
                                <img src={blog.frontImage || image} className='w-full h-auto object-cover aspect-[16/9] rounded-md' />
                                <div className='text-xl w-[60vw]'>{blog.description}</div>
                            </div>
                            <div className='prose dark:prose-invert prose-lg w-[60%] max-w-none' dangerouslySetInnerHTML={{ __html: blog.content }}>
                            </div>
                        </div>
                    </>
                    : <Spinner />
            }
        </Container>
    )
}

export default Blog