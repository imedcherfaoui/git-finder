const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/script.js", (req, res) => {
  res.sendFile(path.join(__dirname, "script.js"), {
    headers: { "Content-Type": "application/javascript" },
  });
});

app.get("/search/:username", async (req, res) => {
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

app.get("/search/:username/repos", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${req.params.username}/repos`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
        },
      }
    );

    const reposData = response.data.map((repo) => ({
      name: repo.name,
      html_url: repo.html_url,
    }));

    res.json(reposData);
  } catch (error) {
    console.error(error);
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: "Repos not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
