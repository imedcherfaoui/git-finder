const API_URL = "http://localhost:3000/search/";
const main = document.getElementById("main");
const search = document.getElementById("search");
const searchButton = document.getElementById("searchButton");

async function getUser(username) {
  try {
    const { data } = await axios(API_URL + username);
    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      createErrorCard("No profile with this username");
    } else {
      createErrorCard("Problem fetching user data");
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(API_URL + username + "/repos");
    addReposToCard(data);
  } catch (err) {
    createErrorCard("Problem fetching repos");
  }
}

function createUserCard(user) {
  const userBio = user.bio ? `<p>${user.bio}</p>` : "";
  const cardHTML = `
    <div class="card">
      <div>
        <img src="${user.avatarUrl}" alt="${user.name}" class="avatar">
      </div>
      <div class="user-info">
        <h2>${user.name}</h2>
        ${userBio}
        <ul>
          <li>${user.followers} <strong>Followers</strong></li>
          <li>${user.following} <strong>Following</strong></li>
          <li>${user.publicRepos} <strong>Repos</strong></li>
        </ul>
        <div id="repos"></div>
      </div>
    </div>
  `;

  if (main) {
    main.innerHTML = cardHTML;
  } else {
    console.error("Main element not found");
  }
}

function createErrorCard(msg) {
  const cardHTML = `
    <div class="card">
      <h1>${msg}</h1>
    </div>
  `;

  if (main) {
    main.innerHTML = cardHTML;
  } else {
    console.error("Main element not found");
  }
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");
  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;
    reposEl.appendChild(repoEl);
  });
}

if (searchButton) {
  searchButton.addEventListener("click", function () {
    const user = search.value;
    if (user) {
      getUser(user);
      search.value = "";
    }
  });
} else {
  console.error("Search button not found");
}
