import axios from 'axios';

const defaultHeaders = {
  headers: {
    'Content-Type': 'application/json'
  }
};

const authHeaders = {
  headers: {
    'Authorization': `Bearer ${localStorage.JWT_TOKEN}`
  }
};

/**
 *
 * @param {String} host
 */
function client(host) {
  return {
    find: async function(entity) {
      const url = `${host}/${entity}`;
      return await axios(url, defaultHeaders);
    }
  };
}

export default client;