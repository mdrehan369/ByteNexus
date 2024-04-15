import React, { useEffect, useState } from 'react'
import { Container, BlogCard, Spinner } from "../components/index.js"
import axios from 'axios';

function Bookmarks() {

    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        ;(async () => {
            try {
                const response = await axios.get("/api/v1/blogs/getHistory");
                console.log(response)
                setBlogs(response.data.data[0].historyBlog);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        })()
    }, [])

  return (
    !loading ?
    <Container className='w-[60%] mx-auto my-10 space-y-6'>
        {
            blogs.map((blog, index) => <BlogCard key={index} blog={blog} />)
        }
    </Container>:
    <Spinner />
  )
}

export default Bookmarks