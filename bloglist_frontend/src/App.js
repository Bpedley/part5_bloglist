import React, { useState, useEffect, useRef } from "react";
import Blogs from "./components/Blogs";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./App.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: null });
  const blogFormRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialBlogs = await blogService.getAll();
        setBlogs(sortBlogs(initialBlogs));
      } catch (error) {
        showNotification(error.response.data.error, "error");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const login = async loginData => {
    try {
      const user = await loginService.login(loginData);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      showNotification(`${user.name} logged in`, "success");
    } catch (error) {
      showNotification("Wrong username or password", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
    blogService.setToken(null);
  };

  const createBlog = async data => {
    try {
      const blog = await blogService.create(data);
      setBlogs(sortBlogs(blogs.concat(blog)));
      blogFormRef.current.toggleVisibility();
      showNotification(`a new blog ${blog.title} added`, "success");
    } catch (error) {
      showNotification(error.response.data.error, "error");
    }
  };

  const updateLikes = async (id, body) => {
    try {
      const updatedBlog = await blogService.update(id, body);
      setBlogs(
        sortBlogs(
          blogs.map(blog => (blog.id === updatedBlog.id ? updatedBlog : blog))
        )
      );
    } catch (error) {
      showNotification(error.response.data.error, "error");
    }
  };

  const deleteBlog = async id => {
    try {
      await blogService.remove(id);
      const blogsAfterDelete = await blogService.getAll();
      setBlogs(sortBlogs(blogsAfterDelete));
      showNotification("Blog was deleted", "success");
    } catch (error) {
      showNotification(error.response.data.error, "error");
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null }), 5000);
  };

  const sortBlogs = unsortedBlogs => {
    return unsortedBlogs.sort((a, b) => b.likes - a.likes);
  };

  return (
    <div>
      <h1>Blogs</h1>
      <Notification notification={notification} />
      {user === null ? (
        <LoginForm login={login} />
      ) : (
        <div>
          <p>
            {user.name} logged-in<button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
          <Blogs
            blogs={blogs}
            user={user}
            updateLikes={updateLikes}
            deleteBlog={deleteBlog}
          />
        </div>
      )}
    </div>
  );
};

export default App;
