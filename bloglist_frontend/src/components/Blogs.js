import React from "react";
import Blog from "./Blog";
import PropTypes from "prop-types";

const Blogs = ({ blogs, user, updateLikes, deleteBlog }) => (
  <div id="blogs">
    {blogs.map(blog => (
      <Blog
        key={blog.id}
        blog={blog}
        user={user}
        updateLikes={updateLikes}
        deleteBlog={deleteBlog}
      />
    ))}
  </div>
);

Blogs.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object.isRequired,
  updateLikes: PropTypes.func,
  deleteBlog: PropTypes.func
};

export default Blogs;
