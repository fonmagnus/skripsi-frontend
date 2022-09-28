import NotificationRepository from "../repositories/notification.repository";

const NotificationService = {
  registerDevice(body, token) {
    return new Promise((resolve, reject) =>
      NotificationRepository.registerDevice(
        body, 
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
  sendNewNotification(slug, body, token) {
    return new Promise((resolve, reject) =>
      NotificationRepository.sendNewNotification(
        slug,
        body, 
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
}

export default NotificationService;