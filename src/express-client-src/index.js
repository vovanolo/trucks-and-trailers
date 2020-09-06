import axios from 'axios';

let jwtToken = localStorage.getItem('JWT_TOKEN');

function setJwtToken(token) {
  jwtToken = token;
  localStorage.setItem('JWT_TOKEN', token);
  authHeaders = {
    ...authHeaders,
    'Authorization': `Bearer ${token}`
  };
}

function removeJwtToken() {
  jwtToken = null;
  localStorage.removeItem('JWT_TOKEN');
}

const defaultHeaders = {
  'Content-Type': 'application/json'
};

let authHeaders = {
  ...defaultHeaders,
  'Authorization': `Bearer ${jwtToken}`
};

/**
 *
 * @param {String} host
 * @returns find, findOne, create, update, remove methods
 */
function client(host) {
  return {
    /**
     *
     * @param {Object} credentials username, password
     * @returns {Promise}
     */
    authenticate: (credentials) => {
      const url = `${host}/auth/authenticate`;
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios(url, {
            headers: defaultHeaders,
            method: 'POST',
            data: credentials
          });
          setJwtToken(res.data.accessToken);
          resolve(res.data);
        } catch (error) {
          reject(error);
        }
      });
    },
    reAuthenticate: () => {
      const url = `${host}/auth/reauthenticate`;
      return new Promise(async (resolve, reject) => {
        if (jwtToken === null) {
          reject('No token found');
        }
        else {
          try {
            const res = await axios(url, {
              headers: authHeaders,
              method: 'POST'
            });
            resolve(res.data);
          } catch (error) {
            removeJwtToken();
            reject(error);
          }
        }
      });
    },
    logout: () => {
      removeJwtToken();
    },
    /**
     *
     * @param {String} entity
     * @param {Boolean} useAuth
     * @returns {Promise}
     */
    find: async (entity, useAuth, body) => {
      const url = `${host}/${entity}`;
      if (body) {
        return await axios(url, {
          headers: useAuth ? authHeaders : defaultHeaders,
          method: 'POST',
          data: body
        });
      }
      else {
        return await axios(url, {
          headers: useAuth ? authHeaders : defaultHeaders,
          method: 'GET'
        });
      }
    },
    /**
     *
     * @param {String} entity
     * @param {Number} id
     * @param {Boolean} useAuth
     * @returns {Promise}
     */
    findOne: async (entity, id, useAuth) => {
      const url = `${host}/${entity}/${id}`;
      return await axios(url, {
        headers: useAuth ? authHeaders : defaultHeaders,
        method: 'GET'
      });
    },
    /**
     *
     * @param {String} entity
     * @param {any} data
     * @param {Boolean} useAuth
     * @returns {Promise}
     */
    create: async (entity, data, useAuth) => {
      const url = `${host}/${entity}`;
      return await axios(url, {
        headers: useAuth ? authHeaders : defaultHeaders,
        method: 'POST',
        data
      });
    },
    /**
     *
     * @param {String} entity
     * @param {any} data
     * @param {Boolean} useAuth
     * @returns {Promise}
     */
    update: async (entity, data, useAuth) => {
      const url = `${host}/${entity}/${data.id}`;
      return await axios(url, {
        headers: useAuth ? authHeaders : defaultHeaders,
        method: 'PATCH',
        data
      });
    },
    /**
     *
     * @param {String} entity
     * @param {Boolean} useAuth
     * @returns {Promise}
     */
    delete: async (entity, id, useAuth) => {
      const url = `${host}/${entity}/${id}`;
      return await axios(url, {
        headers: useAuth ? authHeaders : defaultHeaders,
        method: 'DELETE'
      });
    }
  };
}

export default client;