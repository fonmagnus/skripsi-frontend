
import ProblemsRepository from '../repositories/problems.repository';

const ProblemService = {
  /**
   * Returns list of problems
   * @param {array} params
   * @returns {Promise}
   */
  getAll(token, my = false) {
    // set default order and sort
    return new Promise((resolve, reject) =>
      ProblemsRepository.getAll({ headers: { Authorization: token } }, my)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
  
  /**
   * Returns a problems data
   * @param {string} slug
   * @returns {Promise}
   */
  get(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.get(
        slug, { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  toggleContest(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.toggleContest(
        slug, { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  
  /**
   * Post answers
   * @param {Object} body
   * @returns {Promise}
   */
  postAnswers(body, slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.postAnswers(
        body, 
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  registerContest(body, slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.registerContest(
        body, 
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  /**
   * Post answers
   * @param {Object} body
   * @returns {Promise}
   */
  saveAnswer(body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.saveAnswer(
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

  /**
   * Returns list of user answers
   * @param {string} slug
   * @returns {Promise}
   */
   getAnswers(submission_id, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getAnswers(
        submission_id, { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  /**
   * Returns list of my answers
   * @param {string} slug
   * @returns {Promise}
   */
   getMyAnswers(submission_id, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getMyAnswers(
        submission_id, { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  /**
     * Returns list of participants
     * @param {string} slug
     * @returns {Promise}
     */
  getSubmissions(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getSubmissions(
        slug, { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getLeaderboard(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getLeaderboard(
        slug, { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  /**
     * Returns my submissions
     * @param {string} slug
     * @returns {Promise}
     */
  getMySubmissions(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getMySubmissions(
        slug, { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  /**
   * Update User submissions
   * @param {Object} body
   * @returns {Promise}
   */
  updateSubmission(body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.updateSubmission(
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
  
  /**
   * Update User submissions
   * @param {Object} body
   * @returns {Promise}
   */
  makeSubmission(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.makeSubmission(
        slug, 
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  parseOJ(body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.parseOJ(
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

  submitOJProblem(body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.submitOJProblem(
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

  submitCodingProblem(body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.submitCodingProblem(
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

  rejudgeCodingSubmission(submission_id, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.rejudgeCodingSubmission(
        submission_id,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  batchJudgeCodingProblems(problemset_slug, coding_problem_slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.batchJudgeCodingProblems(
        problemset_slug,
        coding_problem_slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getSubmissionId(crawlRequestId, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getSubmissionId(
        crawlRequestId, 
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getOJSubmissionVerdict(ojName, ojProblemCode, submissionId, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getOJSubmissionVerdict(
        ojName,
        ojProblemCode,
        submissionId, 
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getCodingSubmissionVerdict(submissionId, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getCodingSubmissionVerdict(
        submissionId, 
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getOJSubmissionVerdictForContest(ojName, ojProblemCode, submissionId, slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getOJSubmissionVerdictForContest(
        ojName,
        ojProblemCode,
        submissionId, 
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getOJSubmissionsHistory(ojName, ojProblemCode, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getOJSubmissionsHistory(
        ojName,
        ojProblemCode,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getAllOJSubmissionsHistoryForContest(ojName, ojProblemCode, slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getAllOJSubmissionsHistoryForContest(
        ojName,
        ojProblemCode,
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getOJSubmissionsHistoryForContest(ojName, ojProblemCode, slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getOJSubmissionsHistoryForContest(
        ojName,
        ojProblemCode,
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
  
  getUsersOJSubmissionsHistoryForContest(ojName, ojProblemCode, slug, email, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getUsersOJSubmissionsHistoryForContest(
        ojName,
        ojProblemCode,
        slug,
        email,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
  
  getCodingSubmissionsHistoryForContest(problemsetSlug, slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getCodingSubmissionsHistoryForContest(
        problemsetSlug, slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getUsersCodingSubmissionsHistoryForContest(problemsetSlug, slug, email, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getUsersCodingSubmissionsHistoryForContest(
        problemsetSlug, slug, email,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getOJSubmissionDetail(id, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getOJSubmissionDetail(
        id,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getCodingProblemSubmissionsFromProblemset(problemset_slug, coding_problem_slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getCodingProblemSubmissionsFromProblemset(
        problemset_slug,
        coding_problem_slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },


  getCodingSubmissionDetail(id, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getCodingSubmissionDetail(
        id,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getContestProblems(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getContestProblems(
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getContestProblemsSlug(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getContestProblemsSlug(
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getContestLeaderboard(slug, token, only_show_mine = false) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getContestLeaderboard(
        slug,
        { 
          headers: { Authorization: token },
          params: {
            only_show_mine,
          }, 
        })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  endContest(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.endContest(
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getProblemsetMeta(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getProblemsetMeta(
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  newVirtualContest(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.newVirtualContest(
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  endVirtualContest(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.endVirtualContest(
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getActiveVirtualContest(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getActiveVirtualContest(
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
  
  scrapOjProblem(oj_name, oj_problem_code, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.scrapOjProblem(
        oj_name, oj_problem_code,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  fetchCodingProblem(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.fetchCodingProblem(
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  createNewProblemset(body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.createNewProblemset(
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

  createNewRecommendedProblemset(body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.createNewRecommendedProblemset(
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

  updateContestProblems(slug, body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.updateContestProblems(
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

  deleteOJProblemForContest(slug, body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.deleteOJProblemForContest(
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
  
  deleteCodingProblemForContest(slug, body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.deleteCodingProblemForContest(
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

  getParticipantsForContest(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getParticipantsForContest(
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  updateParticipantStatus(body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.updateParticipantStatus(
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

  getClarifications(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getClarifications(
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  askClarification(body, slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.askClarification(
        body, 
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
  
  answerClarification(body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.answerClarification(
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

  writeLog(slug, body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.writeLog(
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

  getMyTeamInProblemset(slug, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getMyTeamInProblemset(
        slug,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getMyTeams(token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getMyTeams(
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  registerNewTeam(body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.registerNewTeam(
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

  registerNewTeamForContest(slug, body, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.registerNewTeamForContest(
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
  
  getTeamMembers(team_id, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getTeamMembers(
        team_id,
        { headers: { Authorization: token } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },

  getOjProblems(params, token) {
    return new Promise((resolve, reject) =>
      ProblemsRepository.getOjProblems(
        { 
          headers: { Authorization: token },
          params,
        })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        })
    );
  },
};

export default ProblemService;