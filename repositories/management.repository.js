import $axios from './axiosClient';

const resource = '/management';

export default {
  getMyLogs(config = null) {
    return $axios.get(`${resource}/get-my-logs`, config)
  },
  getMySessions(config = null) {
    return $axios.get(`${resource}/get-my-sessions`, config)
  },
  getCoachingSessionsForCoach(config = null) {
    return $axios.get(`${resource}/get-coaching-sessions-for-coach`, config)
  },
  getAllSessions(config = null) {
    return $axios.get(`${resource}/get-all-sessions`, config)
  },
  getSubscriptionPackages(config = null) {
    return $axios.get(`${resource}/subscription-packages`, config)
  },
  getMySubscriptions(config = null) {
    return $axios.get(`${resource}/my-subscriptions`, config)
  },
  getMyActiveSubscriptions(config = null) {
    return $axios.get(`${resource}/my-subscriptions/active`, config)
  },
  requestSubscription(package_id, config = null){
    return $axios.post(
      `${resource}/renew-subscription/${package_id}`,
      {},
      config
    );
  },
  getBankAccounts(config = null) {
    return $axios.get(`${resource}/get-bank-accounts`, config)
  },
  uploadPaymentReceipt(body, config = null) {
    return $axios.post(`${resource}/upload-payment-receipt`, body, config);
  },
  
  getSubscribedProblems(subscription_package_id, config = null) {
    return $axios.get(`${resource}/subscription-problems/${subscription_package_id}`, config)
  },

  getEditorial(problem_id, config = null) {
    return $axios.get(`${resource}/subscription-editorial/${problem_id}`, config)
  },

  registerEliteMembership(body, config) {
    return $axios.post(`${resource}/register-elite-membership`, body, config);
  },

  getEliteMembers(star_level, config) {
    return $axios.get(`${resource}/get-elite-members/${star_level}`, config);
  },
  
  getStudentLogs(email, config) {
    return $axios.get(`${resource}/get-student-logs/${encodeURI(email)}`, config);
  },

  createStudentLog(body, config) {
    return $axios.post(`${resource}/create-student-log`, body, config);
  },

  createCoachingSession(body, config) {
    return $axios.post(`${resource}/create-coaching-session`, body, config);
  },

  deleteCoachingSession(id, config) {
    return $axios.post(`${resource}/delete-coaching-session/${id}`, {}, config);
  },

  getMyUpcomingCoachingSession(config) {
    return $axios.get(`${resource}/get-my-upcoming-coaching-session`, config);
  },

  getGathers(config) {
    return $axios.get(`${resource}/get-gathers`, config);
  },

  getStudentUpcomingCoachingSession(email, config) {
    return $axios.get(`${resource}/get-student-upcoming-coaching-session/${encodeURI(email)}`, config);
  },
  
  updateCoachingSession(body, config) {
    return $axios.post(`${resource}/update-coaching-session`, body, config);
  },
}