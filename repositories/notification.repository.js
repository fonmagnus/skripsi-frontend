import $axios from './axiosClient';

const resource = '/notification';

export default {
  sendNewNotification(slug, body, config = null) {
    return $axios.post(`${resource}/send/${slug}`, body, config);
  },
}
