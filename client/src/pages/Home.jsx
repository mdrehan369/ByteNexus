import React, { useEffect, useState } from 'react'
import { BlogCard, Container, SearchBar, Spinner } from "../components/index.js"
import axios from 'axios';
import { useSelector } from 'react-redux';

function Home() {

    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const [isAll, setIsAll] = useState(true);
    const user = useSelector(state => state.auth.user);
    const [search, setSearch] = useState('');
    // const controller = new AbortController();
    const [searchTopics, setSearchTopics] = useState([]);
    const topics = ['Technology', 'Web Dev', 'Food', 'Entertainment', 'Development', 'Android Dev', 'IOS Dev', 'Game Dev', 'MERN Stack', 'Databases', 'Mongo DB', 'SQL', 'Oracle', 'MySQL', 'Frontend', 'Backend', 'Postgress', 'Wordpress', 'React JS', 'Flutter', 'Canva', 'Next JS']

    useEffect(() => {
        ;(async() => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/v1/blogs/getBlogs?isAll=${isAll?'1':'0'}&title=${search}&topics=${searchTopics.join(',')}&id=${user._id}`);
                setBlogs(response.data.data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        })()
    }, [isAll, searchTopics, search]);

    const handleTopics = (topic) => {
        if(searchTopics.includes(topic)){
            setSearchTopics((prev) => prev.filter((tag) => tag != topic));
        }else{
            setSearchTopics((prev) => [...prev, topic]);
        }
    }

    return (
        <Container className='flex items-center justify-center'>
            <div className='w-[60vw] h-full overflow-y-scroll flex flex-col items-start justify-start gap-6 m-4 p-10'>
                {
                    !loading ?
                        blogs.length ?
                        blogs.map((blog, index) =>
                            <BlogCard blog={blog} key={index} />
                        ) :
                        <div className='w-full h-full flex items-center justify-center text-4xl font-bold'>
                            No Blogs To Show Currently!!
                        </div>
                        :
                        <Spinner className='w-full h-full' />
                }
            </div>
            <div className='w-[35vw] h-[80vh] m-10 p-5 flex flex-col items-center justify-start border-[2px] dark:border-slate-800 rounded-lg gap-6'>
                <SearchBar className='w-[100%] dark:text-slate-900' value={search} onChange={(e) => setSearch(e.target.value)} />
                <div className='flex w-full text-slate-200 gap-6 text-lg items-center justify-start'>
                    <div className={`p-2 px-4 dark:bg-slate-800 rounded-lg cursor-pointer ${isAll ? 'dark:border-[2px] font-bold dark:bg-blue-800 bg-blue-500' : 'border-0'} dark:bg-slate-700 border-slate-400 dark:text-slate-200 text-slate-900`} onClick={() => setIsAll(true)}>All</div>
                    <div className={`p-2 px-4 dark:bg-slate-800 ${!isAll ? 'dark:border-[2px] dark:bg-blue-800 font-bold bg-blue-500' : 'border-0'} rounded-lg cursor-pointer border-slate-400 dark:text-slate-200 text-slate-900`} onClick={() => setIsAll(false)}>Following</div>
                </div>
                <div className='w-full p-4 text-[1.1rem] h-auto border-[1px] border-slate-800 rounded-lg flex flex-wrap items-center gap-4'>
                    {
                        topics.map((topic, index) => <div key={index} className={`${searchTopics.includes(topic)?'border-0 dark:bg-blue-800 bg-blue-500':'border-0 dark:bg-slate-800 bg-gray-200'} border-slate-400 text-sm cursor-pointer hover:dark:bg-slate-700 hover:bg-blue-400 transition font-bold mx-0 p-2 rounded-lg`} onClick={() => {handleTopics(topic)}}>
                            {topic}<i className={`fa-solid fa-${searchTopics.includes(topic)?'x text-[0.7rem]':'plus'} ml-2`}></i>
                        </div>)
                    }
                </div>
            </div>
        </Container>
    )
}

export default Home