const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => {
        return acc + blog.likes
    }, 0)

    
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const maxLikes = Math.max(
        ...blogs.map(blog => blog.likes)
    )

    return blogs.find(blog => blog.likes === maxLikes)
    

}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const counts = _.countBy(blogs, 'author')

    const topAuthor = Object.keys(counts).reduce((a, b) =>
        counts[a] > counts[b] ? a : b
    )

    return {
        author: topAuthor,
        blogs: counts[topAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const grouped = _.groupBy(blogs, 'author')

    const likeCounts = _.mapValues(grouped, (authorBlogs) =>
        _.sumBy(authorBlogs, 'likes')
    )

    const topAuthor = Object.keys(likeCounts).reduce((a, b) => 
        likeCounts[a] > likeCounts[b] ? a : b
    )

    return {
        author: topAuthor,
        likes: likeCounts[topAuthor]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}