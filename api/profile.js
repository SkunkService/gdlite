const axios = require("axios");

const apiBaseUrl = 'https://gdbrowser.com/api'; // Replace with the actual API base URL

function fetchProfile(uidOrName) {
  const url = `${apiBaseUrl}/profiles/${uidOrName}`;

  return axios.get(url)
    .then(response => {
      const profileData = response.data;
      // Create a Profile object from the data
      const profile = new Profile(profileData);
      return profile;
    })
    .catch(error => {
      console.error('Error fetching profile:', error);
      throw error;
    });
}

module.exports = [fetchProfile];
