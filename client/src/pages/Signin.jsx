import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { Button, Input, Container } from "../components/index.js"
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice.js'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import darkLogo from "../assets/darklogo.png"
import logo from "../assets/logo.png"
// import GitHubOAuth from '../Auth/GithubAuth.jsx'

function Signin() {

    const { handleSubmit, register } = useForm();
    const [visible, setVisible] = useState(false);
    const [msg, setMsg] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submit = async (data) => {
        try {
            const response = await axios.post('/api/v1/users/login', data);
            dispatch(login(response.data.data));
            navigate("/");
        } catch (e) {
            console.log(e.response.data);
            setMsg(e.response.data.message);
        }
    }


    return (
        <Container className='flex' height='100vh'>
            <div className="sidebar w-[30vw] h-[100vh] flex flex-col items-start justify-center gap-6 dark:bg-slate-800 bg-slate-200 m-0 p-6 shadow-sm">
                <h1 className='text-5xl font-bold'>Welcome!</h1>
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum saepe suscipit earum libero ad necessitatibus officia inventore atque quod eos molestias accusantium at eveniet, nihil culpa! Voluptatum corporis repellendus omnis molestiae porro!
                </p>
            </div>
            <div className='w-[70vw] h-[100%] flex flex-col justify-center items-center gap-10 relative'>
                <div className={`bg-red-400 w-full h-auto text-center ${msg?.length ? "p-2" : ""} text-black absolute top-0 left-0 overflow-hidden text-xl`}>{msg}
                </div>
                <img src={localStorage.getItem("theme") === 'dark' ? darkLogo : logo} className='w-[30%] h-min' />
                <form onSubmit={handleSubmit(submit)} className='w-auto h-auto flex flex-col items-center justify-center'>

                    <Input
                        register={register}
                        name='usernameOrEmail'
                        placeholder='Username Or Email'
                        label={<i className="fa-solid fa-user"></i>}
                    />

                    <Input
                        type={visible ? 'text' : 'password'}
                        register={register}
                        name='password'
                        placeholder='Password'
                        label={<i className="fa-solid fa-lock"></i>}
                    />

                    <div className='self-start ml-4 cursor-pointer'>
                        <input
                            type="checkbox"
                            id='showPass'
                            onClick={() => setVisible((prev) => !prev)}
                            className='m-2'
                        />
                        <label htmlFor="showPass">Show Password</label>
                    </div>
                    <NavLink to='/signup' className='self-start ml-6 text-blue-500 underline hover:text-blue-800'>New User? Sign Up</NavLink>
                    <Button
                        type='submit'
                        className=''
                    >Sign In</Button>
                </form>
                <div className='text-3xl flex items-center justify-center gap-10 dark:text-slate-500'>
                    <i className="fa-brands fa-google cursor-pointer hover:text-slate-300 after:absolute relative after:left-[-2vw] after:top-10 after:hover:content-['google'] after:text-sm after:text-slate-900 transition-colors after:bg-slate-200 after:dark:bg-slate-400 after:hover:p-2 after:rounded-xl after:transition after:tracking-widest"></i>
                    <i className="fa-brands fa-github cursor-pointer hover:text-slate-300 after:absolute relative after:text-sm after:text-slate-900 after:left-[-2vw] after:top-10 after:hover:content-['github'] transition-colors after:bg-slate-200 after:dark:bg-slate-400 after:hover:p-2 after:rounded-xl after:transition after:tracking-widest"></i>
                    <i className="fa-brands fa-facebook cursor-pointer hover:text-slate-300 after:absolute relative after:text-sm after:text-slate-900 after:left-[-2vw] after:top-10 after:hover:content-['facebook'] transition-colors after:bg-slate-200 after:dark:bg-slate-400 after:hover:p-2 after:rounded-xl after:transition after:tracking-widest"></i>
                    <i className="fa-brands fa-hashnode cursor-pointer hover:text-slate-300 after:absolute relative after:text-sm after:text-slate-900 after:left-[-2vw] after:top-10 after:hover:content-['hashnode'] transition-colors after:bg-slate-200 after:dark:bg-slate-400 after:hover:p-2 after:rounded-xl after:transition after:tracking-widest"></i>
                </div>
                {/* <GitHubOAuth /> */}
            </div>
        </Container>
    )
}

export default Signin