const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}


blogsRouter.get('/', async (request, response) => {
    const all = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(all.map(a => a.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
    const token = getTokenFrom(request)
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const body = request.body
        const name = body.title
        console.log(body)
        console.log(name)

        const u = await User.findById(body.user)

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: u
        })


        const savedBlog = await blog.save()
        u.blogs = u.blogs.concat(savedBlog.id)
        u.save()
        response.status(201).json(savedBlog)
    } catch (exception) {
        console.log(exception)
    }

})


blogsRouter.get('/:id', async (request, response) => {
    try {
        const blog = await Blog.findById(request.params.id)
        if (blog) {
            response.json(blog.toJSON())
        } else {
            response.status(404).end()
        }
    } catch (exception) {
        console.log(exception)
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        console.log(exception)
    }
})

module.exports = blogsRouter