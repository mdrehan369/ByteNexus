import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../store/authSlice.js'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function AuthLayout({ children }) {

    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!user) {
            setLoading(true);
            ;(async () => {
                try {
                    const response = await axios.get("/api/v1/users/getCurrentUser");
                    if(response.data.statusCode === 200) {
                        dispatch(login(response.data.data));
                    }else{
                        navigate("/login");
                    }
                } catch (e) {
                    console.log(e);
                } finally {
                    setLoading(false);
                }
            })()
        }
    }, [])


    return (
        !loading && children
    )
}

export default AuthLayout