const _ = require("lodash");

const dummy = blogs => {
  console.log(blogs);
  return 1;
};

const totalLikes = blogs => {
  return blogs.reduce((acc, curr) => acc + curr.likes, 0);
};

const favoriteBlog = blogs => {
  const max = (Array.isArray(blogs) && blogs.length > 0
    ? blogs.reduce((acc, curr) => (acc.likes > curr.likes ? acc : curr))
    : 0);

  return max ? {
    title: max.title,
    author: max.author,
    likes: max.likes
  } : null;
};

const mostBlogs = blogs => {
  if (!blogs.length) return null;

  const result = _.groupBy(blogs, "author");

  const blogsLength = [];

  for (const prop in result) {
    blogsLength.push({
      author: prop,
      blogs: result[prop].length
    });
  }

  return blogsLength.reduce((acc, curr) => (acc.blogs > curr.blogs ? acc : curr));
};

const mostLikes = blogs => {
  if (!blogs.length) return null;

  const result = _.groupBy(blogs, "author");

  const authorLikes = [];

  for (const prop in result) {
    authorLikes.push({
      author: prop,
      likes: result[prop].reduce((a, b) => a + b.likes, 0)
    });
  }

  return authorLikes.reduce((acc, curr) => (acc.likes > curr.likes ? acc : curr));
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
