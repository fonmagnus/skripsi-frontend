import ManagementRepository from '../repositories/management.repository';

const ManagementService = {
  /**
   * Returns list of problems
   * @param {array} params
   * @returns {Promise}
   */
   getMyLogs(token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getMyLogs(
        { 
          headers: { Authorization: token },
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

  getMySessions(token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getMySessions(
        { 
          headers: { Authorization: token },
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

  getCoachingSessionsForCoach(token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getCoachingSessionsForCoach(
        { 
          headers: { Authorization: token },
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

  getAllSessions(token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getAllSessions(
        { 
          headers: { Authorization: token },
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

  getSubscriptionPackages(params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getSubscriptionPackages()
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getMySubscriptions(token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getMySubscriptions({
        headers: { Authorization: token },
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

  getMyActiveSubscriptions(token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getMyActiveSubscriptions({
        headers: { Authorization: token },
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

  getBankAccounts(token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getBankAccounts({
        headers: { Authorization: token },
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
  
  getSubscribedProblems(subscription_package_id, token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getSubscribedProblems(subscription_package_id, {
        headers: { Authorization: token },
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

  getEditorial(problem_id, token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getEditorial(problem_id, {
        headers: { Authorization: token },
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

  requestSubscription(package_id, token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.requestSubscription(package_id, {
        headers: { Authorization: token },
      }, params)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  uploadPaymentReceipt(token, body, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.uploadPaymentReceipt(body, {
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

  registerEliteMembership(token, body, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.registerEliteMembership(body, {
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

  getEliteMembers(token, star_level, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getEliteMembers(star_level, {
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

  getStudentLogs(email, token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getStudentLogs(email, {
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

  createStudentLog(body, token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.createStudentLog(body, {
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

  createCoachingSession(body, token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.createCoachingSession(body, {
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

  deleteCoachingSession(id, token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.deleteCoachingSession(id, {
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

  getMyUpcomingCoachingSession(token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getMyUpcomingCoachingSession({
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

  getGathers(token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getGathers({
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

  getStudentUpcomingCoachingSession(email, token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.getStudentUpcomingCoachingSession(email, {
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

  updateCoachingSession(body, token, params = null) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ManagementRepository.updateCoachingSession(body, {
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
}

export default ManagementService;