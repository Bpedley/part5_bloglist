import React from "react";
import PropTypes from "prop-types";

const BlogDetails = ({ blog, user, handleAddLike, handleDelete }) => {
  return (
    <div>
      <p>{blog.url}</p>
      <p>
        {blog.likes} likes
        <button onClick={handleAddLike} id="addLike">
          like
        </button>
      </p>
      <p>{blog.user.name}</p>
      {blog.user.name === user.name ? (
        <button onClick={handleDelete} id="deleteBlog">
          remove
        </button>
      ) : null}
    </div>
  );
};

BlogDetails.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleAddLike: PropTypes.func,
  handleDelete: PropTypes.func
};

export default BlogDetails;
