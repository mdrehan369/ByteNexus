import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice.js'
import darklogo from '../assets/darklogo.png'
import logo from '../assets/logo.png'
import user from '../assets/user.png'
import Button from './Button.jsx'
import axios from 'axios'

// Header Component

function Header() {

    const status = useSelector(state => state.auth.user)
    const [mode, setMode] = useState(localStorage.getItem('theme'))
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const toggleTheme = () => {
        if (mode === 'dark') {
            localStorage.setItem('theme', 'light')
            document.documentElement.classList.remove('dark')
            setMode('light')
        } else {
            localStorage.setItem('theme', 'dark')
            document.documentElement.classList.add('dark')
            setMode('dark')
        }
    }

    const handleLogout = async () => {
        try {
            await axios.get("/api/v1/users/logout");
            dispatch(logout());
            navigate("/login");
        } catch (e) {
            console.log(e);
        }
    }



    // Routes

    const routes = [
        {
            path: '/',
            name: 'Feed',
            valid: true
        },
        {
            path: '/write',
            name: 'Write',
            valid: status
        },
        {
            path: '/users',
            name: 'Users',
            valid: true
        },
    ]

    // console.log(window.location)

    return (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/signup' &&
        <nav className='w-full h-[12vh] md:flex items-center justify-around dark:border-b-blue-950 border-b-2 sticky z-50 dark:bg-slate-900 bg-white left-0 top-0 m-0'>
            <div className='md:w-[20%] w-[60%] h-full'>
                <img src={mode === 'dark' ? darklogo : logo} className='md:w-auto py-2 mx-4 md:h-full h-full w-full' />
            </div>

            <ul className='md:w-[50%] w-[20%] h-full flex items-center justify-start text-lg gap-6 dark:text-slate-400'>
                {
                    routes.map((route, index) => {
                        return (
                            route.valid &&
                            <li key={index} className='cursor-pointer dark:hover:bg-blue-900 hover:bg-blue-700 hover:text-white rounded-md px-2 py-1 md:block hidden'>
                                <NavLink
                                    to={route.path}
                                    className={({ isActive }) => isActive ? 'text-blue-400 font-semibold' : ''}
                                >
                                    {route.name}

                                </NavLink>
                            </li>
                        )
                    })
                }
            </ul>

            <ul className='w-[30%] h-full flex items-center text-2xl justify-end md:gap-10 gap-6 mr-8 dark:text-slate-400'>
                <li onClick={toggleTheme} className='cursor-pointer'><i className={`fa-solid fa-${mode === 'dark' ? 'sun' : 'moon'} text-2xl cursor-pointer}`}></i></li>
                {status && <li><i className="fa-solid fa-bell"></i></li>}
                {status && <li className='hidden md:block'><div onClick={() => setShowDropdown((prev) => !prev)}><img className='w-[50px] h-[50px] cursor-pointer rounded-full object-cover' src={status?.profilePic || user} /></div></li>}
                {!status && <li><NavLink to='/login'><Button>Sign In</Button></NavLink></li>}
                {!status && <li><NavLink to='/signup'><Button>Sign Up</Button></NavLink></li>}
                <li className='md:hidden block'><button><i className="fa-solid fa-bars"></i></button></li>
            </ul>
                <div className={`dropdown absolute top-[13vh] right-12 bg-slate-200 dark:bg-slate-800 py-2 px-2 ${showDropdown?'block':'hidden'} space-y-0 w-[10%] rounded-lg shadow-xl transition backdrop-blur-2xl bg-transparent`} onClick={() => setShowDropdown((prev) => !prev)}>
                    <div className='hover:dark:bg-slate-700 transition w-full hover:bg-slate-300 px-2 rounded cursor-pointer py-2' onClick={() => navigate('/profile')}>Profile</div>
                    <div className='hover:dark:bg-slate-700 transition w-full hover:bg-slate-300 px-2 rounded cursor-pointer py-2' onClick={() => navigate('/bookmarks')}>Bookmarks</div>
                    <div className='hover:dark:bg-slate-700 transition w-full hover:bg-slate-300 px-2 rounded cursor-pointer py-2' onClick={() => navigate('/history')} >History</div>
                    <div className='hover:dark:bg-slate-700 transition w-full hover:bg-slate-300 px-2 rounded cursor-pointer py-2' onClick={handleLogout}>Log Out</div>
                </div>
        </nav>
    )
}

export default Header