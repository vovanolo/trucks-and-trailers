import axios from 'axios';

const defaultHeaders = {
  'Content-Type': 'application/json'
};

const authHeaders = {
  ...defaultHeaders,
  'Authorization': `Bearer ${localStorage.JWT_TOKEN}`
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
          localStorage.setItem('JWT_TOKEN', res.data.accessToken);
          resolve(res.data);
        } catch (error) {
          reject(error);
        }
      });
    },
    reAuthenticate: () => {
      const url = `${host}/auth/reauthenticate`;
      return new Promise(async (resolve, reject) => {
        if (!localStorage.JWT_TOKEN) {
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
            localStorage.removeItem('JWT_TOKEN');
            reject(error);
          }
        }
      });
    },
    logout: () => {
      localStorage.removeItem('JWT_TOKEN');
    },
    /**
     *
     * @param {String} entity
     * @param {Boolean} useAuth
     * @returns {Promise}
     */
    find: async (entity, useAuth) => {
      const url = `${host}/${entity}`;
      return await axios(url, {
        headers: useAuth ? authHeaders : defaultHeaders,
        method: 'GET'
      });
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
      const url = `${host}/${entity}/:id`;
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
    delete: async (entity, useAuth) => {
      const url = `${host}/${entity}/:id`;
      return await axios(url, {
        headers: useAuth ? authHeaders : defaultHeaders,
        method: 'DELETE'
      });
    }
  };
}

export default client;