
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
    if (blogs.length === 0) {
        return null;
    }
    
    const Authorlikes = ld.mapValues(ld.groupBy(blogs, 'author'), (blogs) => 
        ld.sumBy(blogs, 'likes')
    );
    
    const maxLikesAuthor = ld.maxBy(Object.keys(Authorlikes), (author) => Authorlikes[author]);
    
    return {
        author: maxLikesAuthor,
        likes: Authorlikes[maxLikesAuthor]
    };
    }


module.exports = {
    dummy, 
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
  }