import React, { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import Spinner from "../components/Spinner"
import axios from "axios"
import userLogo from "../assets/user.png"
import { useNavigate } from "react-router-dom"

function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const controller = new AbortController();
    const navigate = useNavigate()

    useEffect(() => {
        setLoading((prev) => true)
        ;(async() => {
            try {
                const response = await axios.get("/api/v1/users/getAllUsers");
                setUsers(response.data.data);
            } catch (e) {
                console.log(e)
            } finally {
                setLoading((prev) => false)
            }
        })()
    }, [])

    useEffect(() => {
        setLoading((prev) => true)
        ;(async() => {
            try {
                if(query) {
                    const signal = controller.signal;
                    const response = await axios.get(`/api/v1/users/searchUsers/${query}`, {signal});
                    controller.abort();
                    setUsers(response.data.data);
                }else{
                    const response = await axios.get("/api/v1/users/getAllUsers");
                    setUsers(response.data.data);
                }
            } catch (e) {
                console.log(e);
            } finally {
                setLoading((prev) => false)
            }
        })()
    }, [query])

    return (
        <div>
            <SearchBar value={query} onChange={(e) => {setQuery(e.target.value)}}/>
            {!loading ?
            <div className='flex flex-wrap justify-center items-center gap-12 w-[90%] m-auto h-auto'>
                {
                    users?.map((user, index) => (
                        <div key={index} className='flex flex-col w-[23%] p-4 rounded-lg h-[30vh] items-start justify-start dark:bg-slate-800 cursor-pointer bg-slate-200 border-2 dark:border-slate-800 border-slate-400 hover:shadow-slate-400 hover:dark:shadow-slate-800 shadow-md' onClick={() => navigate(`/profile/${user.username}`)}>
                            <div className='flex items-center justify-start gap-6'>
                                <div>
                                    <img src={user.profilePic || userLogo}
                                    className='w-[60px] h-[60px] object-cover rounded-full'
                                    />
                                </div>
                                <div>
                                    <h1 className='text-3xl font-bold'>{user.name}</h1>
                                    <p className='text-md dark:text-slate-400 text-slate-600'>@{user.username}</p>
                                </div>
                            </div>
                            <div className='w-[80%] h-[2px] bg-slate-400 self-center mt-4'></div>
                            <div className='mt-4'>
                                {user.headline}
                            </div>
                        </div>
                    ))
                }
                {
                    !users.length && <h1 className='text-4xl font-bold m-auto'>No Users</h1>
                }
            </div>:
                <Spinner />}
        </div>
    )
}

export default Users