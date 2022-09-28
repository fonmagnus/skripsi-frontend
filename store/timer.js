export const state = () => ({
  timer: 0,
  isCountingDown: false,
  timerInterval: {}
})

export const mutations = {
  setTimer(state, timer) {
    state.timer = timer;
  },
  setIsCountingDown(state, val){
    state.isCountingDown = val;
  },
  setTimerInterval(state, val) {
    state.timerInterval = val;
  }
}

export const getters = {
  getTimer(state) {
    return state.timer;
  },
  isCountingDown(state) {
    return state.isCountingDown;
  },
  getTimerInterval(state) {
    return state.timerInterval;
  }
}

export const actions = {
  setTimer({ commit }, timer) {
    commit('setTimer', timer)
  },
  setTimerInterval({ commit }, timerInterval) {
    commit('setTimerInterval', timerInterval)
  },
  setIsCountingDown({ commit }, val) {
    commit('setIsCountingDown', val);
  },
}