import React from 'react';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET;
// const GITHUB_CALLBACK_URL = 'http://Byte_Nexus/auth/github/callback';
const GITHUB_CALLBACK_URL = 'http://localhost:5173/';
const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user`;

const GitHubOAuth = () => {
  const handleLogin = async (code) => {
    console.log(code)
    try {
      // Exchange the code for an access token
      const data = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        body: {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          // "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Origin':"*",
          // 'Content-Type': 'application/json'
        }
      }).then((response) => response.json());

      const accessToken = data.access_token;

      // Fetch the user's GitHub profile
      const userProfile = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'Byte-Nexus'
        }
      });

      // Handle the user profile data (e.g., store it in your database and log the user in)
      console.log(`Welcome, ${userProfile.data.name}!`);
      console.log(userProfile);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGitHubCallback = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');

    if (code) {
      handleLogin(code);
    }
  };

  React.useEffect(() => {
    handleGitHubCallback();
  }, []);

  return (
    <div>
      <a href={githubOAuthURL}>Sign in with GitHub</a>
    </div>
  );
};

export default GitHubOAuth;