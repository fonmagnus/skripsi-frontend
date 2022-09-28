import services from '../services';

export default (context, inject) => {
  // inject services into Nuxt context and app
  inject('services', services);

  // For Nuxt <= 2.12, also add 👇
  // context.$services = services;
};