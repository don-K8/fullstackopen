import { render, screen } from '@testing-library/react'
import CreateBlog from './CreateBlog'
import userEvent from '@testing-library/user-event'

test('<CreateBlog /> updates parent state and calls onSubmit with correct details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<CreateBlog createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('title')
  const authorInput = screen.getByLabelText('author')
  const urlInput = screen.getByLabelText('url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'testing a form...')
  await user.type(authorInput, 'test author')
  await user.type(urlInput, 'http://testurl.com')
  await user.click(sendButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'testing a form...',
    author: 'test author',
    url: 'http://testurl.com'
  })
})