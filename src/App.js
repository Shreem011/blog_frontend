import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteConfirmationPopup from "./DeleteConfirmationPopup";
import "./App.css";

const BASE_API_URL = "https://blog-backend-bgl.vercel.app/api/posts";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [currentPostId, setCurrentPostId] = useState(null);

  // added
  // State for managing the delete confirmation popup
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const response = await axios.get(BASE_API_URL);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const createPost = async () => {
    try {
      const formattedContent = formData.content.replace(/\n/g, "<br><br>");
      const response = await axios.post(BASE_API_URL, {
        ...formData,
        content: formattedContent,
      });
      setPosts([...posts, response.data]);
      setFormData({ title: "", content: "" });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const updatePost = async () => {
    try {
      const formattedContent = formData.content.replace(/\n/g, "<br><br>");
      await axios.put(`${BASE_API_URL}/${currentPostId}`, {
        ...formData,
        content: formattedContent,
      });
      getPosts();
      setFormData({ title: "", content: "" });
      setCurrentPostId(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  // Function to show the delete confirmation popup
  const confirmDeletePost = (postId) => {
    setPostToDelete(postId);
    setShowDeletePopup(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_API_URL}/${postToDelete}`);
      getPosts();
      setShowDeletePopup(false);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (currentPostId) {
      updatePost();
    } else {
      createPost();
    }
  };

  const handlePostEdit = (post) => {
    setFormData({ title: post.title, content: post.content });
    setCurrentPostId(post._id);
  };

  return (
    <div>
      {/* navbar */}
      <nav className="navbar">
        <h1 className="navbar-heading">Blog Application</h1>
      </nav>

      {/* form */}
      <form onSubmit={handleFormSubmit} className="post-form">
        <input
          type="text"
          className="form-input"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          className="form-textarea"
          placeholder="Content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />
        <button type="submit" className="form-button">
          {currentPostId ? "Update Post" : "Create Post"}
        </button>
      </form>

      {/* posts */}
      <div className="posts-section">
        <h1 className="posts-heading">POSTS ...</h1>
      </div>
      <ul className="post-list">
        {posts.map((post) => (
          <li className="post-item" key={post._id}>
            <h3 className="post-title">{post.title}</h3>
            {/* <p className="post-content">{post.content}</p> */}
            <p
              className="post-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></p>

            <div className="post-buttons">
              <button onClick={() => handlePostEdit(post)}>Edit</button>
              {/* <button onClick={() => deletePost(post._id)}>Delete</button> */}
              <button onClick={() => confirmDeletePost(post._id)}>
                Delete
              </button>
            </div>
            {/* Show the custom delete confirmation popup */}
            {showDeletePopup && (
              <DeleteConfirmationPopup
                onCancel={() => setShowDeletePopup(false)}
                onConfirm={handleDelete}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
