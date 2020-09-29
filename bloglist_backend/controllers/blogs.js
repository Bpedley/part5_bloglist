const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

blogRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

blogRouter.post("/", async (req, res) => {
  const body = req.body;
  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!req.token || !decodedToken.id) {
    return res.status(401).json({
      error: "token missing or invalid"
    });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    user: user._id,
    likes: body.likes || 0
  });

  blog.populate("user", { username: 1, name: 1 }).execPopulate();
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.json(savedBlog);
});

blogRouter.put("/:id", async (req, res) => {
  const body = req.body;

  if (Object.keys(body).length) {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, body, {
      new: true
    }).populate("user", { username: 1, name: 1 });
    res.json(updatedBlog);
  } else {
    res.status(400).end();
  }
});

blogRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const blogToDelete = await Blog.findById(id);

  if (!blogToDelete) {
    return res.status(400).json({
      error: `No blog with the following id: ${id}`
    });
  }

  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  } else if (decodedToken.id !== blogToDelete.user.toString()) {
    return res.status(401).json({ error: "Not authorized" });
  }

  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = blogRouter;
