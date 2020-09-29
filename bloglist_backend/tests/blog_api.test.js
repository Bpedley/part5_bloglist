const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

let token;

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);

  const response = await api
    .post("/api/login/")
    .send({ username: "root", password: "secret" });

  token = response.body.token;
});

describe("when there is initially some blogs saved", () => {
  test("blog posts are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blog posts are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("a specific blog post is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");

    const titles = response.body.map(r => r.title);

    expect(titles).toContain("Go To Statement Considered Harmful");
  });

  test("unique identifier 'id' exists", async () => {
    const response = await api.get("/api/blogs");
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe("viewing a specific blog", () => {
  test("succeeds with a valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const result = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

    expect(result.body).toEqual(processedBlogToView);
  });

  test("fails with status code 404 if blog does not exist", async () => {
    const nonexistingId = await helper.nonExistingId();

    await api.get(`/api/blogs/${nonexistingId}`).expect(404);
  });

  test("fails with status code 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("adding a new blog post", () => {
  test("a valid blog post can be added and if likes not set default to 0", async () => {
    const newBlog = helper.validBlog;

    const savedBlog = await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(savedBlog.body.likes).toBe(0);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map(r => r.title);
    expect(titles).toContain("How to be a fullstack master");
  });

  test("fails with status code 400 if data is invalid", async () => {
    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send({ author: "Egor" })
      .expect(400);

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send({ url: "www.ya.ru" })
      .expect(400);

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send({ title: "Blog api" })
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("updating post", () => {
  test("succeeds with a valid request body", async () => {
    const blogs = await helper.blogsInDb();

    await api
      .put(`/api/blogs/${blogs[0].id}`)
      .send({
        author: "Test user",
        title: "Test title",
        url: "www.google.com",
        likes: 23
      })
      .expect(200);
  });

  test("fails with status code 400 if request body is empty", async () => {
    const blogs = await helper.blogsInDb();

    await api.put(`/api/blogs/${blogs[0].id}`).send({}).expect(400);
  });

  test("fails with status code 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api.put(`/api/blogs/${invalidId}`).send({ likes: 1 }).expect(400);
  });
});

describe("deletion of a post", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const newBlog = helper.validBlog;

    const res = await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogToDelete = res.body;

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const titles = blogsAtEnd.map(r => r.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
