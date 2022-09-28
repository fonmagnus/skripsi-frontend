import $axios from './axiosClient';

const resource = '/auth/users';
const resourceAccount = '/account';

export default {
  resetPassword(body, config = null) {
    return $axios.post(
      `${resource}/reset_password/`, body, config)
    },
  changePassword(body, config = null) {  
    return $axios.post(
      `${resource}/reset_password_confirm/`, body, config)
  },
  activateAccount(uid, token, config = null) {
    return $axios.post(
      `/account/activate/${uid}/${token}`,
      {},
      config
    );
  },
  registerAccount(body, config = null) {
    return $axios.post(
      `${resource}/`,
      body,
      config
    );
  },
  uploadProfilePhoto(body, config = null) {
    return $axios.post(`${resourceAccount}/upload-profile-photo`, body, config);
  },
  updateBiodata(body, config = null) {
    return $axios.post(`${resourceAccount}/update-biodata`, body, config);
  },
  getMembers(config = null) {
    return $axios.get(`${resourceAccount}/get-members`, config);
  },
  getCoaches(config = null) {
    return $axios.get(`${resourceAccount}/get-coaches`, config);
  },
  getUserByIdOrUsername(id_or_username, config = null) {
    return $axios.get(`${resourceAccount}/get-user-by-id-or-username/${id_or_username}`, config);
  },
  getLatestActiveVerificationCode(config = null) {
    return $axios.get(`${resourceAccount}/get-latest-active-verification-code`, config);
  },
}