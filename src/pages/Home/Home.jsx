import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import searchIcon from "../../assets/icons/search.svg";
import ButtonAddPost from "../../components/ButtonAddPost/ButtonAddPost.jsx";
import PostModal from "../../components/PostModal/PostModal.jsx";
import ClickPostModal from "../../components/ClickPostModal/ClickPostModal.jsx"; // Import your modal
import { useUser } from "../../context/UserContext.jsx"; // Access user context
import "./Home.scss";

const baseUrl = import.meta.env.VITE_APP_SERVER_URL;

const HomePage = () => {
  const { user, isLoading } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // State to manage selected post
  const [myPosts, setMyPosts] = useState([]);
  const [newPosts, setNewPosts] = useState([]);
  const [pastPosts, setPastPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
        fetchPosts();
    }  
  }, [user]);
  
  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    const token = localStorage.getItem('authToken');

    try {
        const { data } = await axios.get(`${baseUrl}/homedata/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setMyPosts(data.myPosts);
        setNewPosts(data.newPosts);
        setPastPosts(data.pastPosts);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    } finally {
        setIsLoadingPosts(false);
    }
};

  const handleAddPost = async (postData) => {
    const token = localStorage.getItem("authToken");

    const postDataWithUser = {
        ...postData,
        user: user.id,
    };

    try {
        await axios.post(`${baseUrl}/posts`, postDataWithUser, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Re-fetch posts after creating a new post
        fetchPosts();
    } catch (error) {
        console.error("Error creating post:", error);
    }
  };
  const handlePostClick = (post) => {
    setSelectedPost(post); // Set the selected post to open the modal
  };

  const renderPosts = (posts) =>
    posts.map((post, index) => (
      <div
        key={index}
        className="post-card"
        onClick={() => handlePostClick(post)} // Add onClick handler
        style={{ cursor: "pointer" }} // Add pointer cursor
      >
        <div className="post-card-header">
          <span className="post-card-user">{post.user_name}</span>
          <div className="post-card-dates">
            <span className="post-card-label">Created:</span>
            <span className="post-card-created">
              {new Date(post.post_createdate).toLocaleDateString()}
            </span>
            <span className="post-card-label">Due:</span>
            <span className="post-card-duedate">
              <strong>{new Date(post.post_duedate).toLocaleDateString()}</strong>
            </span>
          </div>
        </div>
        <div className="post-card-body">
          <h3 className="post-card-title">{post.post_title}</h3>
        </div>
      </div>
    ));

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="home-page">
      {isModalOpen && (
        <PostModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddPost}
        />
      )}
     {selectedPost && (
      <ClickPostModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        isOwner={selectedPost.post_createuser === user.id}
        fetchPosts={fetchPosts}
        baseUrl={baseUrl}
      />
    )}
      <div className="header">
        <div className="search-bar__container">
          <div className="search-bar">
            <input type="text" placeholder="Search" className="search-input" />
          </div>
          <img src={searchIcon} alt="Search Icon" className="search-icon" />
        </div>
        <div className="profile-circle"
        onClick={() => navigate("/connections")} // Navigate to Connections
        style={{ cursor: "pointer" }}
        >
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" />
          ) : (
            <div className="placeholder" />
          )}
        </div>
      </div>

      <div className="section">
        <div className="title">
          <h2>My Dashboard</h2>
          <ButtonAddPost text="Post +" onClick={() => setModalOpen(true)} />
        </div>
        <div className="scroll-container">{renderPosts(myPosts)}</div>
      </div>

      <div className="section">
        <h2>New Posts</h2>
        <div className="scroll-container">{renderPosts(newPosts)}</div>
      </div>

      <div className="section">
        <h2>Past Posts</h2>
        <div className="scroll-container">{renderPosts(pastPosts)}</div>
      </div>
    </div>
  );
};

export default HomePage;