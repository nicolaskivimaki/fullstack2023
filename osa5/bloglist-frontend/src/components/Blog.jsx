import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, changeLikesOfBlog, handleBlogDelete, user }) => {
  const [state, changeState] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showInfo = () => (
    <div>
      <p>{blog.url}</p>
      <p>{blog.likes}
        <button onClick={changeLikesOfBlog}
        >like</button></p>
      <p>{blog.user.username}</p>
      {user.username === blog.user.username && (<button onClick={handleBlogDelete}>delete</button>)}
    </div>
  )


  const changeInfoStatus = () => {
    if (state === true) {
      changeState(false)
    } else if (state === false) {
      changeState(true)
    }
  }

  const label = state
    ? 'hide' : 'view'

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={changeInfoStatus}>{label}</button>
      {state === true ? showInfo() : null}
    </div>
  )}

Blog.propTypes = {
  changeLikesOfBlog: PropTypes.func.isRequired,
  handleBlogDelete: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog
