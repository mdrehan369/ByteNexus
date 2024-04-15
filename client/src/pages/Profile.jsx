import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button';
import { login, logout } from '../store/authSlice.js';
import Spinner from "../components/Spinner.jsx"
import cover from "../assets/cover.jpg"
import profilePic from "../assets/user.png"

const linksArr = ['github', 'facebook', 'linkedin', 'instagram']

function Profile() {

    const { username } = useParams();
    const [user, setUser] = useState(useSelector(state => state.auth.user));
    const OtherUser = useSelector(state => state.auth.user);
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (username) {
            ; (async () => {
                try {
                    const response = await axios.get(`/api/v1/users/user/${username}`);
                    setUser(response.data.data)
                } catch (e) {
                    console.log(e);
                } finally {
                    setLoading((prev) => false);
                }
            })()
        }
        else {
            setLoading((prev) => false);
        }

    }, [OtherUser])

    const handleFollow = async () => {
        try {
            setFollowLoading(true);
            await axios.get(`/api/v1/users/follow/${user._id}`);
            const response = await axios.get("/api/v1/users/getCurrentUser");
            dispatch(login(response.data.data))
        } catch (e) {
            console.log(e);
        } finally {
            setFollowLoading(false);
        }
    }

    return (
        !loading ?
            <>
                <div className="w-[60%] dark:bg-transparent bg-slate-100 h-auto border-2 dark:border-blue-900 border-slate-400 rounded-xl flex flex-col items-start justify-start mx-auto my-10 overflow-hidden">
                    <div className='w-full h-[50vh] relative'>
                        <img src={user.coverPic || cover} className='object-cover h-full w-full' />
                        <img src={user.profilePic || profilePic} className='w-[200px] h-[200px] object-cover rounded-full absolute bottom-6 left-6' />
                    </div>
                    <div className='w-[90%] flex items-center justify-between mx-auto mt-10'>
                        <div>
                            <h1 className='text-4xl font-bold'>{user.name}</h1>
                            <p className='text-lg dark:text-slate-400 text-slate-800 font-light italic'>@{user.username}</p>
                        </div>
                        {
                            (username && (username === OtherUser.username) || !username) ?
                                <Button><NavLink to='/edit'>Edit</NavLink></Button> :
                                (OtherUser.following.includes(user._id) ?
                                    <Button onClick={handleFollow} disabled={followLoading}>Unfollow</Button> :
                                    <Button onClick={handleFollow} disabled={followLoading}>Follow</Button>)
                        }
                    </div>
                    <div className='w-[90%] flex items-center justify-start gap-16 mx-auto flex-wrap mt-6'>
                        <p className='text-lg text-slate-800 dark:text-slate-400'><span className='font-bold dark:text-white text-slate-800'>{user.following.length}</span> following</p>
                        <p className='text-lg text-slate-800 dark:text-slate-400'><span className='font-bold dark:text-white text-slate-800'>{user.followers.length}</span> followers</p>
                        <p className='text-lg text-slate-800 dark:text-slate-400'><span className='font-bold dark:text-white text-slate-800'>{user.blogs.length}</span> blogs</p>
                        {
                            user.links?.map((link, index) =>
                                link &&
                                <NavLink target='__blank' to={link} key={index}><i className={`fa-brands fa-${linksArr[index]} text-2xl hover:text-slate-400 dark:hover:text-blue-900`}></i></NavLink>
                            )
                        }
                    </div>
                    <div className='w-[90%] flex items-center justify-start gap-10 mx-auto'>
                        <p className='text-slate-800 dark:text-slate-400'>{user.location && <><i className='fa-solid fa-location-dot'></i>{user.location}</>}</p>
                        <p className='text-slate-800 dark:text-slate-400'><i className='fa-solid fa-envelope'></i>{user.email}</p>
                    </div>
                    <div>
                        {/* TODO: Add Skills */}
                    </div>
                    <div className='w-[90%] mx-auto mt-10 text-2xl font-semibold italic text-center'>
                        {user.headline}
                    </div>
                    <div className='w-[90%] mx-auto mt-6 text-xl dark:text-slate-300 text-slate-700'>
                        {user.about}
                    </div>
                    {/* TODO: Add Blogs */}
                </div>
            </> :
            <Spinner />
    )
}

export default Profile