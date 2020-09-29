const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/"
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html"
  }
];

const validBlog = {
  url: "https://github.com/atkinsio/full-stack-open-2020",
  title: "How to be a fullstack master",
  author: "Aaron Atkins"
};

const nonExistingId = async () => {
  const blog = new Blog({
    url: "www.ya.ru",
    title: "Test blog post",
    author: "Egor Kuchin"
  });

  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

module.exports = {
  initialBlogs,
  validBlog,
  nonExistingId,
  blogsInDb,
  usersInDb
};
