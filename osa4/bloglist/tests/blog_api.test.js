const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require("../models/user")
const bcrypt = require("bcrypt")
const helper = require('./test_helper')

describe("Not logged in", () => {
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
})

describe("Logged in", () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("topsecretpassword", 10)
    const testUser = new User({ username: "Jeriko", passwordHash })
    await testUser.save()

    const testBlog = new Blog({
      title: 'Jarkko on the beach',
      author: 'Timo',
      url: 'www.timoscrushes.com',
      likes: 78,
      user: testUser.id,
    })

    await testBlog.save()
  })

  test('a blog can be added successfully', async () => {
    const userLoginResponse = await api
      .post("/api/login")
      .send({
        username: "Jeriko", 
        password: "topsecretpassword" 
      })
      .expect(200)

    const token = userLoginResponse.body.token
    const blogsAtStart = await helper.blogsInDb()

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(helper.testBlogOne)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const response = await helper.blogsInDb()
    const authors = response.map((r) => r.author)

    expect(response).toHaveLength(blogsAtStart.length + 1)
    expect(authors).toContain("Jeriko")
  })

  test('likes 0 if not given', async () => {
    const userLoginResponse = await api
      .post("/api/login")
      .send({ 
        username: "Jeriko", 
        password: "topsecretpassword" 
      })
      .expect(200)

    const token = userLoginResponse.body.token

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(helper.testBlogNoLikes)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const response = await helper.blogsInDb()
    const blogWithZeroLikes = response.find((blog) => blog.title === "Jeriko no likes")

    expect(blogWithZeroLikes.likes).toBe(0)
  })

  test("Cannot add blog without token", async () => {
    const blogsAtStart = await helper.blogsInDb()

    await api
      .post("/api/blogs")
      .send(helper.testBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test("cannot add blog without title or url", async () => {
    const userLoginResponse = await api
      .post("/api/login")
      .send({ 
        username: "Jeriko", 
        password: "topsecretpassword" 
      })
      .expect(200)

    const token = userLoginResponse.body.token
    const blogsAtStart = await helper.blogsInDb()

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(helper.testBlogNoUrl)
      .expect(400)
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(helper.testBlogNoTitle)
      .expect(400)

    const response = await helper.blogsInDb()
    expect(response.length).toBe(blogsAtStart.length)
  })

  test("deleting blog with correct id", async () => {
    const blogList = await helper.blogsInDb()
    const correctId = blogList[0].id

    const userLoginResponse = await api
      .post("/api/login")
      .send({ 
        username: "Jeriko", 
        password: "topsecretpassword" 
      })
      .expect(200)

    const token = userLoginResponse.body.token

    await api
      .delete(`/api/blogs/${correctId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)
  })

  test('updating a blog with correct id', async () => {
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
    expect(updatedBlogList[0].likes).toBe(10)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
