import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('Initially shows only shows only title and author', () => {

  const testBlog = {
    title: 'Hello World',
    author: 'Mika Kivenoja',
    url: 'jfhsdjkf',
    likes: 3
  }

  render(<Blog blog={testBlog} />)

  const element = screen.getByText('Hello World Mika Kivenoja')

  expect(element).toBeDefined()
  expect(screen.queryByText(testBlog.url)).toBeNull()
  expect(screen.queryByText(testBlog.likes)).toBeNull()
})

test('Url and likes are shown too after clicking on a blog', async () => {
  const testBlogtwo = {
    title: 'Hello World',
    author: 'Mika Kivenoja',
    url: 'www.mika.fi',
    likes: 78,
    user: {
      id: 75,
      username: 'Mika'
    }
  }
  const userObject = {
    id: 75,
    username: 'Mika'
  }

  render(<Blog blog={testBlogtwo} user={userObject} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const element1 = screen.getByText('www.mika.fi')
  expect(element1).toBeDefined()
  const element2 = screen.getByText('78')
  expect(element2).toBeDefined()
  const element3 = screen.getByText('Mika')
  expect(element3).toBeDefined()
})

test('Liking a blog twice calls the same event handler twice', async () => {
  const testBlog = {
    title: 'Testing',
    author: 'Simo',
    url: 'simo.fi',
    likes: 5,
    user: {
      id: 6,
      username: 'Tester'
    }
  }
  const userObject = {
    id: 45,
    name: 'Tester'
  }

  const mockHandler = jest.fn()

  render(
    <Blog blog={testBlog} changeLikesOfBlog={mockHandler} user={userObject}  />
  )

  const testUser = userEvent.setup()
  const expand = await screen.findByText('view')
  await testUser.click(expand)

  const likeButton = screen.getByText('like')
  await testUser.click(likeButton)
  await testUser.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

