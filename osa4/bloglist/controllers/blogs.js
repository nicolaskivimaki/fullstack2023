const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog.find({}).then(notes => {
    response.json(notes)
  })
})

blogsRouter.post('/', (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    content: body.content,
    important: body.important || false,
  })

  blog.save()
    .then(savedBlog => {
      response.json(savedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter