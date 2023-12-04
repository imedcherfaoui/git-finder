const API_URL = "https://phenomenal-naiad-d76466.netlify.app/search/";

const main = document.getElementById("main");
const search = document.getElementById("search");

async function searchUser() {
  const username = search.value.trim();
  if (username) {
    try {
      const { data } = await axios.get(API_URL + username);
      createUserCard(data);
      getRepos(username);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        createErrorCard("No profile with this username");
      } else {
        createErrorCard("Problem fetching user data");
      }
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios.get(API_URL + username + "/repos");
    addReposToCard(data);
  } catch (error) {
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
  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `;
  main.innerHTML = cardHTML;
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
