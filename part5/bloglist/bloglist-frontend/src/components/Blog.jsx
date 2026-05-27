import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Card, CardContent, CardActions,
  Typography, Button
} from '@mui/material'

const Blog = ({ blog, addLike, deleteBlog, user }) => {

  const [visible, setVisible] = useState(false)

  if (!blog) {
    return null
  }

  return (
    <Card sx={{ maxWidth: 600, mb: 2 }}>
      <CardContent>
        <Typography variant='h5' sx={{ fontSize: '1.7rem', mb: 1.3}}>{blog.title}</Typography>
        <Typography sx={{ color: 'grey', fontSize: '1rem'}}>
          by {blog.author}
        </Typography>
        <Typography 
          variant="body2" 
          component="a" 
          href='#' 
          sx={{ mt: 1, display: 'block', color: 'primary.main' }}
        >
          {blog.url}
        </Typography>
        <Typography sx={{ mt: 1, color: 'grey', fontSize: '.8rem'}}>
          Added by {user.name}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, mt: -2, alignItems: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }} >
          {blog.likes} likes
        </Typography>
        {user && <Button 
          size="small" 
          variant="outlined"
          color="primary"
          onClick={() => {
            addLike(blog.id, {...blog, likes: blog.likes + 1})
          }}
        >
          Like
        </Button>}
        {user && user.username === blog.user.username && <Button 
          size="small" 
          variant="outlined"
          color="error"
          onClick={() => deleteBlog(blog)}
        >
          Remove
        </Button>}
      </CardActions>        
    </Card>
  )}

export default Blog