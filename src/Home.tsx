import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to Task Manager 🚀</h1>
      <p>Manage your tasks efficiently</p>

      <Link to="/tasks">
        <button style={{ padding: "10px 20px" }}>
          Go to Tasks
        </button>
      </Link>
    </div>
  );
}

export default Home;