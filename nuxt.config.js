require('dotenv').config()
const fs = require('fs')

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  csp: true,
  loading: '~/components/ui/LoadingSpinner.vue',
  generate: {
    fallback: true
  },
  server: {
    port: process.env.PORT || 3000 // default: 3000
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Vertex',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Oxygen&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lato&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Ubuntu+Mono&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap",
      },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'boxicons/css/boxicons.min.css',
    'vuesax/dist/vuesax.css', 
    'vuetify/dist/vuetify.min.css',
    'latex2js/latex2js.css',
    '@/assets/css/main.scss',
    '@/assets/css/main.css',
    { src: '~/node_modules/highlight.js/styles/hopscotch.css', lang: 'css' },
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vuesax.js', ssr: false },
    { src: '~/plugins/services.js' },
    { src: '~/plugins/vuetify.js' },
    { src: '~/plugins/bootstrap-vue.js' },
    { src: '~/plugins/vue-cryptojs.js' },
    { src: '~/plugins/vuex-persist.js', mode: 'client'},
    { src: '~/plugins/hotjar.js', mode: 'client'},
    { src: '~/plugins/latex2js.js', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    {
      path: '~/components', // will get any components nested in let's say /components/test too
      pathPrefix: false,
    },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/moment',
    '@nuxtjs/dotenv',
    '@nuxt/postcss8',
  ],
  
  moment: {
    defaultTimezone: 'Asia/Jakarta'
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/toast',
    '@nuxtjs/markdownit',
  ],
  toast: {
    position: 'top',
    duration: 2000
  },
  vuetify: {
    customVariables: ['~/assets/css/variables.scss'],
    treeShake: true
  },
  markdownit: {
    injected: true,
    preset: 'default',
    linkify: true,
    html: true,
    breaks: false,
    use: [
      'markdown-it',
      'markdown-it-mathjax',
      'markdown-it-container',
      'markdown-it-attrs',
      'markdown-it-highlightjs'
    ]
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_BASE_URL,
  },

  router: {
    middleware: ['auth']
  },

  env: {
    BASE_URL: process.env.APP_ENV === 'production' ? 'http://skripsi-frontend.netlify.app' : 'http://localhost:3000',
    API_BASE_URL: process.env.API_BASE_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    AES_SECRET_KEY: process.env.AES_SECRET_KEY,
    APP_ENV: process.env.APP_ENV,
  },

  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },
  auth: {
    redirect: {
      login: '/',
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'access',
          maxAge: 1800
        },
        refreshToken: {
          property: 'refresh',
          data: 'refresh',
          maxAge: 60 * 60 * 24 * 30
        },
        endpoints: {
          login: {
            url: '/auth/jwt/create', 
            method: 'post', 
            propertyName: 'access' 
          },
          refresh: { 
            url: '/auth/jwt/refresh', 
            method: 'post' 
          },
          logout: false,
          user: {
            url: '/account/me', 
            method: 'get', 
            propertyName: false,
          },
        },
        tokenRequired: true,
        tokenType: 'JWT'
      },
    }
  }
}
