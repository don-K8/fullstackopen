import Blog from './Blog'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs, addLike, deleteBlog, user }) => {
  return (
    <div>
      <h2>blogs</h2>
        <ul>
          {blogs.map(blog =>
          <li key={blog.id}>
            <Link to={`/${blog.id}`}>{blog.title} by {blog.author}</Link>
          </li>
          )}
        </ul>
    </div>
  )
}

export default BlogList