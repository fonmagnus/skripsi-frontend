export const state = () => ({
  answers: {},
  activeSubmissionId: 0,
})

export const mutations = {
  setAnswers(state, answers) {
    state.answers = answers;
  },
  setAnswer(state, param) {
    state.answers[param.key] = param.answer;
  },
  setActiveSubmissionId(state, val) {
    state.activeSubmissionId = val;
  },
}

export const getters = {
  getAnswers(state) {
    return state.answers;
  },
  getAnswer: (state) => (id) => {
    return state.answers[id] || '';
  },
  getActiveSubmissionId(state) {
    return state.activeSubmissionId;
  }
}

export const actions = {
  setAnswers({ commit }, answers) {
    commit('setAnswers', answers)
  },
  setAnswer({ commit }, param) {
    commit('setAnswer', param);
  },
  setActiveSubmissionId({ commit }, val) {
    commit('setActiveSubmissionId', val);
  },
}