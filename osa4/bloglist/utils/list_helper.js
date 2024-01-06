
const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
return blogs.reduce((sum, blog) => sum + blog.likes, 0);
  }

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
      return null;
    }
  
    let favorite = blogs[0];
  
    blogs.forEach(blog => {
      if (blog.likes > favorite.likes) {
        favorite = blog;
      }
    });
  
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    };
  }

const ld = require('lodash');

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    const blogCounts = ld.countBy(blogs, 'author');
    const authorWithMostBlogs = ld.maxBy(Object.keys(blogCounts), (author) => blogCounts[author]);

    return {
        author: authorWithMostBlogs,
        blogs: blogCounts[authorWithMostBlogs]
    };
    }

const mostLikes = (blogs) => {
    const likesByAuthor = {};
    
    blogs.forEach(blog => {
        if (!likesByAuthor[blog.author]) {
            likesByAuthor[blog.author] = 0;
        }
        likesByAuthor[blog.author] += blog.likes;
    });
    
    let maxLikes = 0;
    let maxAuthor = '';
    
    for (const author in likesByAuthor) {
        if (likesByAuthor[author] > maxLikes) {
        maxLikes = likesByAuthor[author];
        maxAuthor = author;
        }
    }
    
    return maxLikes === 0 ? null : { author: maxAuthor, likes: maxLikes };
    }
      

module.exports = {
    dummy, 
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
  }