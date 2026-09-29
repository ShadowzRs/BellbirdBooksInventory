import { useState } from "react";
import { Link, Links } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <div>
        <h1>
          Welcome, {user.username}, FN: {user.first_name}, LN: {user.last_name}
        </h1>
      </div>
    </>
  );
}

export default Dashboard;
