export const state = () => ({
  onlyShowMine: true,
})

export const mutations = {
  setOnlyShowMine(state, onlyShowMine) {
    state.onlyShowMine = onlyShowMine;
  },
}

export const getters = {
  getOnlyShowMine(state) {
    return state.onlyShowMine;
  },
}

export const actions = {
  setOnlyShowMine({ commit }, onlyShowMine) {
    commit('setOnlyShowMine', onlyShowMine)
  },
}