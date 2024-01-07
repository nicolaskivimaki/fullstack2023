const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are the right number of blogs', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('identifier is id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
})

describe('adding a blog', () => {
  test('a blog can be added successfully', async () => {
      const newBlog = {
        title: 'Jarkko on the beach',
        author: 'Timo',
        url: 'www.timoscrushes.com',
        likes: 78
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const updatedBlogList = await helper.blogsInDb()
      expect(updatedBlogList).toHaveLength(helper.initialBlogs.length + 1)
    
      const titles = updatedBlogList.map(n => n.title)
      expect(titles).toContain(
        'Jarkko on the beach'
      )
  })

  test('likes 0 if not given', async () => {
      const newBlog = {
        title: 'Jorman juomapelit',
        author: 'Jorma',
        url: 'www.funwithjorma.com'
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const updatedBlogList = await helper.blogsInDb()
      expect(updatedBlogList).toHaveLength(helper.initialBlogs.length + 1)
    
      const likes = updatedBlogList.map(n => n.likes)
      expect(likes[helper.initialBlogs.length]).toBe(0)
  })

  test('cannot add blog without title or url', async () => {
      const newBlog = {
        author: 'Kuusiston Jeremias'
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const updatedBlogList = await helper.blogsInDb()
      expect(updatedBlogList).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deleting a blog with id', () => {
    test('blog deleted with code 204', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const titles = blogsAtEnd.map(r => r.title)

        expect(titles).not.toContain(blogToDelete.title)
    })
})

describe('updating a blog with id', () => {
    test('id updates with status code 201', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const update = {
        likes: 10
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(update)
        .expect(201)

    const updatedBlogList = await helper.blogsInDb()
    expect(updatedBlogList).toHaveLength(helper.initialBlogs.length)
  
    expect(updatedBlogList[0].likes).toBe(10)
    })
})

afterAll(async () => {
  await mongoose.connection.close()
})
