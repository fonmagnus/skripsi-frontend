export const state = () => ({
  isProfileCompleted: false,
})

export const mutations = {
  setIsProfileCompleted(state, isProfileCompleted) {
    state.isProfileCompleted = isProfileCompleted;
  },
}

export const getters = {
  isProfileCompleted(state) {
    return state.isProfileCompleted;
  },
}

export const actions = {
  setIsProfileCompleted({ commit }, isProfileCompleted) {
    commit('setIsProfileCompleted', isProfileCompleted)
  },
}