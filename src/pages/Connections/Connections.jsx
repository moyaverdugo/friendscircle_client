import { useNavigate } from "react-router-dom";
import "./Connections.scss";

const Connections = () => {
  const navigate = useNavigate();

  return (
    <div className="connections-page">
      <header className="connections-header">
        <button
          className="back-button"
          onClick={() => navigate("/")}
          aria-label="Go back to Home"
        >
          ←
        </button>
        <button className="add-friend-button">+ Friend</button>
      </header>

      <section className="hero-section">
        <div className="user-info">
          <h1 className="user-name">User Name</h1>
        </div>
        <div className="user-photo">[Photo Placeholder]</div>
      </section>

      <div className="tabs-card">
        <div className="tabs">
          <button className="tab selected">Circles</button>
          <button className="tab">Contacts</button>
          <button className="tab">My Profile</button>
        </div>

        <div className="tab-content">
          <p>Content will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default Connections;