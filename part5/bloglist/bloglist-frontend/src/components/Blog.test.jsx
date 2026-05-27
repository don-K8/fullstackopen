import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const blog = {
  id: '1',
  title: 'Test Blog Title',
  author: 'Test Author',
  url: 'https://testblog.com', 
  likes: 5,
  user: { name: 'John Doe', username: 'johndoe' }
}

const renderBlog = (user = null) => {
  return render(
    <MemoryRouter initialEntries={['/1']}>
      <Routes>
        <Route 
          path="/:id" 
          element={
            <Blog
              blog={blog}
              user={user}
              addLike={vi.fn()}
              deleteBlog={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

test('unauthenticated user sees blog info and likes but no buttons', () => {
  renderBlog(null)

  expect(screen.getByText('Test Blog Title')).toBeDefined()
  expect(screen.getByText(/likes 5/)).toBeDefined()
  expect(screen.getByText(/Added by John Doe/)).toBeDefined()

  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
    
})

test('authenticated non-creator sees only the like button', () => {
  const otherUser = { username: 'otheruser' }
  renderBlog(otherUser)

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()

})

test('blog creator sees both like and delete buttons', () => {
  const creator = {username: 'johndoe' }
  renderBlog(creator)

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('remove')).toBeDefined()
})

