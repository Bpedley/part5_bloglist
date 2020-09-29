import React, { useState } from "react";
import BlogDetails from "./BlogDetails";
import PropTypes from "prop-types";

const Blog = ({ blog, user, updateLikes, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
  };

  const handleAddLike = () => {
    const blogObj = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    };
    updateLikes(blog.id, blogObj);
  };

  const handleDelete = () => {
    const result = window.confirm(`Remove blog ${blog.title}?`);
    if (result) {
      deleteBlog(blog.id);
    }
  };

  const showDetailsOnClick = () => setShowDetails(!showDetails);

  return (
    <div style={blogStyle} id="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={showDetailsOnClick} id="showDetails">
          {showDetails ? "hide" : "view"}
        </button>
      </div>
      {showDetails ? (
        <BlogDetails
          blog={blog}
          user={user}
          handleAddLike={handleAddLike}
          handleDelete={handleDelete}
        />
      ) : null}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  updateLikes: PropTypes.func,
  deleteBlog: PropTypes.func
};

export default Blog;
