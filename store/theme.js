export const state = () => ({
  theme: ''
})

export const mutations = {
  setTheme(state, theme) {
    state.theme = theme;
  },
}

export const getters = {
  getTheme(state) {
    return state.theme;
  },
}

export const actions = {
  setTheme({ commit }, theme) {
    commit('setTheme', theme)
  },
}