const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/Blog')

const api = supertest(app)

const initialContent = [

    {
        title: "topkek",
        author: "meme",
        url: "isAstring",
        likes: 7
    },
    {
        title: "asdasgfasd",
        author: "dpkjaåakfas",
        url: "dakjaölgfja",
        likes: 12
    },
    {
        title: "asdasdasgagha",
        author: "asdlasdklaf",
        url: "asdgagfasd",
        likes: 2
    }
]

beforeEach(async () => {
    await Blog.remove({})
    for (let i = 0; i < initialContent.length; i++) {
        let blogObject = new Blog(initialContent[i])
        await blogObject.save()
    }

})


describe('Blog api tests: ', () => {

    test('Blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are three blogs', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body.length).toBe(3)
    })

    test('id field is correctly named', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })
    
    test('adding blog works', async () => {
        const newBlog = new Blog({
            title: "Test",
            author: "Add",
            url: "TestingAdding",
            likes: 1337
        })

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
    })

})

afterAll(() => {
    mongoose.connection.close()
})