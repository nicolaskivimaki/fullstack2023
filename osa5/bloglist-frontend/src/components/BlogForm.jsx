import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
  
    const handleUrlChange = (event) => {
      setUrl(event.target.value)
    }
  
    const handleTitleChange = (event) => {
      setTitle(event.target.value)
    }
  
    const handleAuthorChange = (event) => {
      setAuthor(event.target.value)
    }
  
    const addBlog = (event) => {
      event.preventDefault()
      createBlog({
        title: title,
        author: author,
        url: url
      })
      setTitle('')
      setAuthor('')
      setUrl('')
  
    }

    return (
        <form onSubmit={addBlog}>
      title:
      <input
        value={title}
        onChange={handleTitleChange}
      />
      <br></br>
      author:
      <input
        value={author}
        onChange={handleAuthorChange}
      />
      <br></br>
      url:
      <input
        value={url}
        onChange={handleUrlChange}
      />
      <br></br>
      <button type="submit">save new blog</button>
    </form>
    )
}

export default BlogForm