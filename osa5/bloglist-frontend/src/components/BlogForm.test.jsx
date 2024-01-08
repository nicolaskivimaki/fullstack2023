import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


describe('<BlogForm />', () => {
  const createBlog = jest.fn()
  const testBlog = {
    title: 'This is a test',
    author: 'best tester',
    url: 'besttesting.com',
  }

  test('BlogForm is called with correct parameters on submit', async () => {
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)
    const inputs = screen.getAllByRole('textbox')
    const submitButton = screen.getByRole('button', { name: /save new blog/i })

    await user.type(inputs[0], testBlog.title)
    await user.type(inputs[1], testBlog.author)
    await user.type(inputs[2], testBlog.url)
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    const callParams = createBlog.mock.calls[0][0]
    expect(callParams).toEqual(testBlog)
  })
})