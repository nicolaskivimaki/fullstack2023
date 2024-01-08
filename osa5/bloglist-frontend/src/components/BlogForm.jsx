import { useState } from 'react'

const BlogForm = ({ 
    addBlog,
    title,
    handleTitleChange,
    author,
    handleAuthorChange,
    url,
    handleUrlChange
}) => {

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