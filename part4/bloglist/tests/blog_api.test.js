const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

let token

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    // attach user to each blog
    const blogs = helper.initialBlogs.map(b => ({ ...b, user: user._id }))
    await Blog.insertMany(blogs)

    // login to get token
    const response = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
    
    token = response.body.token
})

test('blogs are returned as jSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blogs have id property not _id', async () => {
    const response = await api.get('/api/blogs')

    const blogs = response.body
    blogs.forEach(blog => {
        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
    })
})

test('a valid note can be added', async () => {
    const newBlog = {
        title: "The Art of Slow Mornings",
        author: "James Whitfield",
        url: "https://www.slowmornings.co/articles/morning-rituals",
        likes: 14,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const title = blogsAtEnd.map(b => b.title)
    assert(title.includes('The Art of Slow Mornings'))
})

test("if likes isn't mentioned, it defaults to 0", async () => {
    const newBlog = {
        title: "The Art of Slow Mornings",
        author: "James Whitfield",
        url: "https://www.slowmornings.co/articles/morning-rituals",
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(b => b.title === "The Art of Slow Mornings")
    assert.strictEqual(addedBlog.likes, 0)
})

test('if title or url is missing, return 400 bad request', async () => {
    const blogNoTitle = {
        author: "James Whitfield",
        url: "https://www.slowmornings.co/articles/morning-rituals",
        likes: 14,
    }

    const blogNoUrl = {
        title: "The Art of Slow Mornings",
        author: "James Whitfield",
        likes: 14,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogNoTitle)
        .expect(400)
    
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogNoUrl)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    
})

test('deletion of a note', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(b => b.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

})

test('succeeds to update the like a the blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const update = { likes: 99 }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(update)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

    assert.strictEqual(updatedBlog.likes, update.likes)

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('adding a blog fails with 401 if token is not provided', async () => {
    const newBlog = {
        title: 'No token blog',
        author: 'Anonymous',
        url: 'http://example.com',
        likes: 1,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

describe('User tests', () => {
    test('valid user can be added', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "mluukkai",
            name: "Matti Luukkainen",
            password: "mluukkai",
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const username = usersAtEnd.map(u => u.username)
    assert(username.includes('mluukkai'))

    })

    test('fails with 400 when username is invalid', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "ml",
            name: "Matti Luukkainen",
            password: "mluukkai",
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails with 400 if password is invalid', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "mluukkai",
            name: "Matti Luukkainen",
            password: "ml",
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        
        assert(result.body.error.includes('password must be at least 3 characters'))
    })

    test('fails with 400 if password/username is missing', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser_no_username = {
            name: "Matti Luukkainen",
            password: "mluukkai",
        }

        const newUser_no_password = {
            username: "mluukkai",
            name: "Matti Luukkainen",
        }

        await api
            .post('/api/users')
            .send(newUser_no_username)
            .expect(400)
        
        await api
            .post('/api/users')
            .send(newUser_no_password)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails with 400 if username already exists', async () => {
    const existingUser = {
        username: "mluukkai",
        name: "Matti Luukkainen",
        password: "mluukkai",
    }

    // add the user first
    await api
        .post('/api/users')
        .send(existingUser)
        .expect(201)
    
    const existingUsers = await helper.usersInDb()

    // try adding same username again
    const result = await api
        .post('/api/users')
        .send(existingUser)
        .expect(400)

    assert(result.body.error.includes('expected `username` to be unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, existingUsers.length)
})
})

after(async () => {
    await mongoose.connection.close()
})