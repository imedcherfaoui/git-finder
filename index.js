const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/:username", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${req.params.username}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
          "Access-Control-Allow-Origin": "*", // Add this line
        },
      }
    );

    const userData = {
      name: response.data.name || response.data.login,
      bio: response.data.bio || "",
      avatarUrl: response.data.avatar_url,
      followers: response.data.followers,
      following: response.data.following,
      publicRepos: response.data.public_repos,
    };

    res.json(userData);
  } catch (error) {
    console.error(error);
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: "User not found" });
  }
});

app.get("/script.js", (req, res) => {
  res.sendFile(path.join(__dirname, "script.js"), {
    headers: { "Content-Type": "application/javascript" },
  });
});

app.get("/users/:username", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${req.params.username}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
        },
      }
    );

    const userData = {
      name: response.data.name || response.data.login,
      bio: response.data.bio || "",
      avatarUrl: response.data.avatar_url,
      followers: response.data.followers,
      following: response.data.following,
      publicRepos: response.data.public_repos,
    };

    res.json(userData);
  } catch (error) {
    console.error(error);
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: "User not found" });
  }
});

app.listen();
