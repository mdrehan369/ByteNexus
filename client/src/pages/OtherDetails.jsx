import React, { useState } from 'react'
import { Container, Input, Button, TextArea, Spinner } from '../components'
import { useSelector, useDispatch } from 'react-redux'
import { login } from "../store/authSlice.js"
import coverPic from "../assets/cover.jpg"
import profilePic from "../assets/user.png"
import { useForm } from 'react-hook-form'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

function OtherDetails() {

    const user = useSelector(state => state.auth.user);
    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: user.name,
            links: user.links,
            about: user.about,
            headline: user.headline,
            location: user.location
        }
    })
    const dispatch = useDispatch()
    const [profile, setProfile] = useState(user.profilePic || profilePic);
    const [cover, setCover] = useState(user.coverPic || coverPic);
    const navigate = useNavigate();
    const [profilePicPath, setProfilePicPath] = useState(null);
    const [coverPicPath, setCoverPicPath] = useState(null);
    const [loading, setLoading] = useState(false);
    // console.log(user);

    const allLinks = ['Github', 'Facebook', 'Hashnode', 'Instagram']

    const submit = async (data) => {
        setLoading(true);
        try {
            await axios.post("/api/v1/users/updateUserDetails", data);

            if (profilePicPath !== null) {
                const formData = new FormData();
                formData.append("profilePic", profilePicPath)
                await axios.post("/api/v1/users/updateProfilePic", formData);
            }

            if (coverPicPath !== null) {
                const formData = new FormData();
                formData.append("coverPic", coverPicPath)
                await axios.post("/api/v1/users/updateCoverPic", formData);
            }

            const response = await axios.get("/api/v1/users/getCurrentUser");
            dispatch(login(response.data.data));
            navigate("/profile");

        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading && <Spinner className='fixed bg-black left-0 top-0 z-30 bg-opacity-50' />}
            <Container>
                <div className='w-[60%] m-auto mt-5 rounded-lg overflow-hidden h-auto flex flex-col items-start justify-start border-2 border-blue-900'>
                    <div className='w-full h-[50vh] relative cursor-pointer'>

                        <img src={profile} className='w-[200px] h-[200px] object-cover opacity-50 rounded-full absolute bottom-10 left-10 z-20' />
                        <Button className='text-2xl hover:dark:bg-green-700 dark:bg-green-500 absolute left-[8%] top-[55%] z-30'>
                            <label htmlFor="profile" className=''>
                                <i class="fa-solid fa-plus"></i>
                            </label>
                        </Button>
                        <Button className='text-2xl dark:bg-red-500 bg-red-500 hover:dark:bg-red-700 hover:bg-red-700 absolute left-[16%] top-[55%] z-30' onClick={(e) => {
                            setProfile(profilePic);
                            setProfilePicPath("")
                        }}>
                            <i class="fa-solid fa-trash"></i>
                        </Button>

                        <img src={cover} className='w-full h-full object-cover opacity-30' />
                        <Button className='text-2xl hover:dark:bg-green-700 dark:bg-green-500 absolute left-[45%] top-[45%] z-30'>
                            <label htmlFor="cover">
                                <i class="fa-solid fa-plus"></i>
                            </label>
                        </Button>
                        <Button className='text-2xl dark:bg-red-500 bg-red-500 hover:dark:bg-red-700 hover:bg-red-700 absolute left-[55%] top-[45%] z-30' onClick={() => {setCover(coverPic);
                        setCoverPicPath("")}}>
                            <i class="fa-solid fa-trash"></i>
                        </Button>

                    </div>
                    <div className='w-[90%] h-auto m-auto my-10'>
                        <form onSubmit={handleSubmit(submit)}>
                            <input type="file" id='profile' name='profilePic' hidden onChange={(e) => { setProfile(URL.createObjectURL(e.target.files[0])); setProfilePicPath(e.target.files[0]) }
                            } />
                            <input type="file" id="cover" name='coverPic' hidden onChange={(e) => { setCover(URL.createObjectURL(e.target.files[0])); setCoverPicPath(e.target.files[0]) }} />
                            <h1 className='text-4xl font-semibold ml-4'>Name</h1>
                            <Input
                                placeholder='Name'
                                name='name'
                                register={register}
                                className='w-[100%]'
                            />

                            <h1 className='text-4xl font-semibold ml-4'>Headline</h1>
                            <Input
                                placeholder='Headline'
                                name='headline'
                                register={register}
                                className='w-[100%]'
                            />

                            <h1 className='text-4xl font-semibold ml-4'>About</h1>
                            <TextArea
                                placeholder='About'
                                name='about'
                                register={register}
                                className='w-[97%]'
                            />

                            <h1 className='text-4xl font-semibold ml-4'>Links</h1>
                            {
                                allLinks.map((link, index) => <Input
                                    key={index}
                                    placeholder={link + " URL"}
                                    name={`links[${index}]`}
                                    register={register}
                                    className='w-[100%]'
                                />)
                            }

                            <h1 className='text-4xl font-semibold ml-4'>Location</h1>
                            <Input
                                placeholder='Location'
                                name='location'
                                register={register}
                                className='w-[100%]'
                            />

                            <Button
                                type="submit"
                                disabled={loading}
                                className='ml-5'>
                                Save
                            </Button>

                        </form>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default OtherDetails