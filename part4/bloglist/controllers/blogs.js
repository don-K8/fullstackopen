const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body

    if (!body.title || !body.url) {
        return response.status(400).end()
    }

    const user = request.user

    if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
    }
    
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes ?? 0,
        user: user._id,
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()
    
    response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {

    const user = request.user

    if (!user) {
        return response.status(401).json({ error: 'userId missing or invalid' })
    }

    const blog =  await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }

    if (!(blog.user.toString() === user.id.toString())) {
        return response.status(401).json({ error: 'blog doesn`t belong to the user' })
    }

    await blog.deleteOne()
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const {title, author, url, likes} = request.body

    const blog = await Blog.findById(request.params.id)
    
    if (!blog) {
        return response.status(404).end()
    }

    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes

    const savedBlog = await blog.save()
    response.json(savedBlog)

})

module.exports = blogsRouter