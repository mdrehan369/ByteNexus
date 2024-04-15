import React, { useState } from 'react'
import { Editor, Container, Input, TextArea, Button, Spinner } from "../components/index.js"
import { useForm } from "react-hook-form"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Write() {

    const { register, control, handleSubmit, getValues } = useForm({
        defaultValues: {
            title: "",
            description: "",
            content: "Hello there! Lets Write!"
        }
    })
    const [topics, setTopics] = useState([]);
    const [loader, setLoader] = useState(false);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleTopics = () => {
        const value = document.getElementById("select").value;
        setTopics((prev) => prev.filter((topic) => (topic !== value)));
        setTopics((prev) => [value, ...prev]);
    }

    const submit = async (data) => {

        const formData = new FormData();
        formData.append("title", data.title)
        formData.append("description", data.description)
        formData.append("content", data.content)
        // formData.append("topics", topics)
        formData.append("frontImage", data.frontImage[0])
        topics.forEach((topic) => {
            formData.append("topics[]", topic)
        });

        console.log(topics);
        console.log(formData);

        setLoader(true);
        try {
            await axios.post("/api/v1/blogs/addBlog", formData)
            navigate("/");
        } catch (e) {
            console.log(e);
            setMsg(e.response.data.message);
        } finally {
            setLoader(false);
        }
    }

    return (
        <Container>
            {
                loader && 
                <Spinner className='fixed left-0 right-0 z-30 bg-black opacity-50' />   
            }
                    <form className='w-full h-full flex items-center justify-center relative' onSubmit={handleSubmit(submit)}>
                        {msg && <div className='absolute top-5 left-[30%] bg-red-500 w-[40%] text-xl font-semibold p-2 bg-opacity-80 rounded-lg z-10 text-center flex flex-row items-center justify-between'>{msg}<i className="fa-solid fa-x mr-3 text-2xl pl-3 border-l-[1px] border-red-400 cursor-pointer" onClick={() => setMsg("")}></i></div>}
                        <div className='flex flex-col items-center justify-start w-[30vw] h-[88vh] m-4'>
                            <Input register={register} name='title' placeholder='Title...' className='w-[30vw] shadow-sm' required />
                            <div className='flex items-center justify-around w-full'>
                                <h1 className='text-xl font-bold'>Front Image: </h1>
                                <input type="file" {...register("frontImage")} />
                            </div>
                            <TextArea register={register} name='description' placeholder='Description...' className='p-2 shadow-sm h-[25vh] w-[30vw]' required />
                            <div className='w-full flex gap-4 items-center justify-center'>
                                <select className='p-2 m-2 dark:text-slate-400 text-slate-900 rounded-lg dark:bg-slate-800 bg-slate-200 w-[85%] h-[6vh]' id='select'>
                                    <option value="Tech">Technology</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Development">Development</option>
                                    <option value="Food">Food</option>
                                    <option value="Web Dev">Web Dev</option>
                                </select>
                                <Button className='' type='button' onClick={handleTopics}>
                                    <i className="fa-solid fa-plus"></i>
                                </Button>
                            </div>
                            <div className='w-full h-[18vh] rounded-lg flex flex-wrap overflow-y-scroll'>
                                {
                                    topics.map((topic, index) => <div key={index} className='dark:bg-slate-800 shadow-lg bg-slate-200 p-3 mx-2 my-1 rounded-lg h-[6vh]'>
                                        {topic}
                                    </div>)
                                }
                            </div>
                            <Button type='submit'>
                                Post
                            </Button>
                        </div>
                        <div className='p-4 w-[70vw] h-full'>
                            <Editor control={control} name='content' defaultValue={getValues('content')} />
                        </div>
                    </form>
                
        </Container>
    )
}

export default Write