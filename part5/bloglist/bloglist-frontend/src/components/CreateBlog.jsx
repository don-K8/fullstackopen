import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const CreateBlog = ({ createBlog }) => {

  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    })

    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="title"
            value={newBlog.title}
            onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
            sx={{ marginBottom: 2, width: 500}}
          />
        </div>
        <div>
          <TextField
            label="author"
            value={newBlog.author}
            onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })} 
            sx={{ marginBottom: 2, width: 500}}
          />
        </div>
        <div>
          <TextField
            label="url"
            value={newBlog.url}
            onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
            sx={{ marginBottom: 2, width: 500}} 
          />
        </div>
        <Button type="submit" variant="contained">
          Create
        </Button>
      </form>
    </div>
  )
}

export default CreateBlog