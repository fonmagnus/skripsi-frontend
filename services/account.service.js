import AccountRepository from '../repositories/account.repository';

const AccountService = {
 
  /**
   * Post answers
   * @param {Object} body
   * @returns {Promise}
   */
  resetPassword(body, config) {
    return new Promise((resolve, reject) =>
      AccountRepository.resetPassword(
        body, 
        config,
      )
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
  
  /**
   * Post answers
   * @param {Object} body
   * @returns {Promise}
   */
  changePassword(body, config) {
    return new Promise((resolve, reject) =>
      AccountRepository.changePassword(
        body, 
        config,
      )
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
  
  /**
   * Post answers
   * @param {Object} body
   * @returns {Promise}
   */
  activateAccount(uid, token, config) {
    return new Promise((resolve, reject) =>
      AccountRepository.activateAccount(
        uid,
        token, 
        config,
      )
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  /**
   * Post answers
   * @param {Object} body
   * @returns {Promise}
   */
  registerAccount(body, config) {
    return new Promise((resolve, reject) =>
      AccountRepository.registerAccount(
        body,
        config,
      )
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  uploadProfilePhoto(token, body, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      AccountRepository.uploadProfilePhoto(body, {
        headers: { 
          Authorization: token,
          // 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW', 
        },
      }, params)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  updateBiodata(token, body, params = null) {
    return new Promise((resolve, reject) =>
      AccountRepository.updateBiodata(body, {
        headers: { 
          Authorization: token,
        },
      }, params)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
  checkProfileCompletion(token, params = null) {
    return new Promise((resolve, reject) =>
      AccountRepository.checkProfileCompletion({
        headers: { 
          Authorization: token,
        },
      }, params)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
  getMembers(token, params = null) {
    return new Promise((resolve, reject) =>
      AccountRepository.getMembers({
        headers: { 
          Authorization: token,
        },
      }, params)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
  getCoaches(token, params = null) {
    return new Promise((resolve, reject) =>
      AccountRepository.getCoaches({
        headers: { 
          Authorization: token,
        },
      }, params)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
  getUserByIdOrUsername(id_or_username, token, params = null) {
    return new Promise((resolve, reject) =>
      AccountRepository.getUserByIdOrUsername(id_or_username, {
        headers: { 
          Authorization: token,
        },
      }, params)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
  getLatestActiveVerificationCode(token, params = null) {
    return new Promise((resolve, reject) =>
      AccountRepository.getLatestActiveVerificationCode({
        headers: { 
          Authorization: token,
        },
      }, params)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getUserByUsername(username, token, params = null) {
    return new Promise((resolve, reject) =>
      AccountRepository.getUserByUsername(username, {
        headers: { 
          Authorization: token,
        },
        params
      })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getUserStatistics(token, username, params = null) {
    return new Promise((resolve, reject) =>
      AccountRepository.getUserStatistics(username, {
        headers: { 
          Authorization: token,
        },
        params
      })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
};

export default AccountService;