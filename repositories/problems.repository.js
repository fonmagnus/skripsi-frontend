import $axios from './axiosClient';

const resource = '/problems';

export default {
  getAll(config = null, my = false) {
    return $axios.get(`${resource}/all${my ? '/my' : ''}`, config);
  },

  get(slug, config = null) {
    return $axios.get(`${resource}/${slug}`, config);
  },

  toggleContest(slug, config = null) {
    return $axios.post(`${resource}/toggle/${slug}`, {}, config);
  },

  postAnswers(body, slug, config = null) {
    return $axios.post(
      `${resource}/submit/${slug}`,
      body,
      config,
    )
  },

  saveAnswer(body, config = null) {
    return $axios.post(
      `${resource}/save-answer`,
      body,
      config
    )
  },

  getAnswers(submission_id, config = null) {
    return $axios.get(
      `${resource}/get-answers/${submission_id}`,
      config
    )
  },

  getMyAnswers(submission_id, config = null) {
    return $axios.get(
      `${resource}/get-my-answers/${submission_id}`,
      config
    )
  },

  makeSubmission(slug, config = null) {
    return $axios.post(
      `${resource}/submission/new/${slug}`,
      { slug },
      config
    )
  },

  getSubmissions(slug, config = null) {
    return $axios.get(`${resource}/get-submissions/${slug}`, config);
  },

  getMySubmissions(slug, config = null) {
    return $axios.get(`${resource}/get-my-submissions/${slug}`, config);
  },

  getLeaderboard(slug, config = null) {
    return $axios.get(`${resource}/leaderboard/${slug}`, config);
  },

  updateSubmission(body, config = null) {
    return $axios.post(
      `${resource}/update-submission`,
      body,
      config
    )
  },

  parseOJ(body, config = null) {
    return $axios.post(
      `${resource}/parse-oj`,
      body, config
    )
  },
  
  submitOJProblem(body, config = null) {
    return $axios.post(
      `${resource}/submit-oj-problem`,
      body, config
    )
  },

  registerContest(body, slug, config = null) {
    return $axios.post(
      `${resource}/register-contest/${slug}`,
      body, config
    )
  },

  submitCodingProblem(body, config = null) {
    return $axios.post(
      `${resource}/judge`,
      body, config
    )
  },

  rejudgeCodingSubmission(submission_id, config = null) {
    return $axios.post(
      `${resource}/rejudge-coding-submission/${submission_id}`,
      {}, config
    )
  },

  batchJudgeCodingProblems(problemset_slug, coding_problem_slug, config = null) {
    return $axios.post(
      `${resource}/batch-judge-coding-problems/${problemset_slug}/${coding_problem_slug}`,
      {}, config
    )
  },

  getSubmissionId(crawlRequestId, config = null) {
    return $axios.get(
      `${resource}/get-crawl-request/${crawlRequestId}`, config
    )
  },

  getOJSubmissionVerdict(ojName, ojProblemCode, submissionId, config = null) {
    return $axios.get(
      `${resource}/get-oj-submission-verdict/${ojName}/${ojProblemCode}/${submissionId}`, config
    )
  },

  getCodingSubmissionVerdict(submissionId, config = null) {
    return $axios.get(
      `${resource}/get-coding_submission-verdict/${submissionId}`, config
    )
  },

  getOJSubmissionVerdictForContest(ojName, ojProblemCode, submissionId, slug, config = null) {
    return $axios.get(
      `${resource}/get-oj-submission-verdict-for-contest/${ojName}/${ojProblemCode}/${submissionId}/${slug}`, config
    )
  },

  getOJSubmissionsHistory(ojName, ojProblemCode, config = null) {
    return $axios.get(
      `${resource}/get-oj-submissions-history/${ojName}/${ojProblemCode}`, config
    )
  },

  getOJSubmissionsHistoryForContest(ojName, ojProblemCode, slug, config = null) {
    return $axios.get(
      `${resource}/get-oj-submissions-history-for-contest/${ojName}/${ojProblemCode}/${slug}`, config
    )
  },
  
  getAllOJSubmissionsHistoryForContest(ojName, ojProblemCode, slug, config = null) {
    return $axios.get(
      `${resource}/get-all-oj-submissions-history-for-contest/${ojName}/${ojProblemCode}/${slug}`, config
    )
  },

  getUsersOJSubmissionsHistoryForContest(ojName, ojProblemCode, slug, email, config = null) {
    return $axios.get(
      `${resource}/get-users-oj-submissions-history-for-contest/${ojName}/${ojProblemCode}/${slug}/${escape(email)}`, config
    )
  },

  getCodingSubmissionsHistoryForContest(problemsetSlug, slug, config = null) {
    return $axios.get(
      `${resource}/get-coding-submissions-history-for-contest/${problemsetSlug}/${slug}`, config
    )
  },

  getUsersCodingSubmissionsHistoryForContest(problemsetSlug, slug, email, config = null) {
    return $axios.get(
      `${resource}/get-users-coding-submissions-history-for-contest/${problemsetSlug}/${slug}/${escape(email)}`, config
    )
  },

  getOJSubmissionDetail(id, config = null) {
    return $axios.get(
      `${resource}/get-oj-submission-detail/${id}`, config
    )
  },

  getCodingProblemSubmissionsFromProblemset(problemset_slug, coding_problem_slug, config = null) {
    return $axios.get(
      `${resource}/get-all-coding-problems-submissions-from-problemset/${problemset_slug}/${coding_problem_slug}`, config
    )
  },

  getCodingSubmissionDetail(id, config = null) {
    return $axios.get(
      `${resource}/get-coding-submission-detail/${id}`, config
    )
  },

  getContestProblems(slug, config = null) {
    return $axios.get(
      `${resource}/get-contest-problems/${slug}`, config
    )
  },

  getContestProblemsSlug(slug, config = null) {
    return $axios.get(
      `${resource}/get-contest-problems-slug/${slug}`, config
    )
  },

  getContestLeaderboard(slug, config = null) {
    return $axios.get(
      `${resource}/get-contest-leaderboard/${slug}`, config
    )
  },

  endContest(slug, config = null) {
    return $axios.get(
      `${resource}/end-contest/${slug}`, config
    )
  },

  getProblemsetMeta(slug, config = null) {
    return $axios.get(
      `${resource}/get-problemset-meta/${slug}`, config
    )
  },
  
  newVirtualContest(slug, config = null) {
    return $axios.post(
      `${resource}/virtual-contest/new/${slug}`, {}, config
    )
  },
  
  endVirtualContest(slug, config = null) {
    return $axios.post(
      `${resource}/virtual-contest/end/${slug}`, {}, config
    )
  },
    
  getActiveVirtualContest(slug, config = null) {  
    return $axios.get(
      `${resource}/virtual-contest/${slug}`, config
    )
  },

  scrapOjProblem(oj_name, oj_problem_code, config = null) {
    return $axios.get(
      `${resource}/get-oj-problem/${oj_name}/${oj_problem_code}`,
      config
    )
  },

  fetchCodingProblem(slug, config = null) {
    return $axios.get(
      `${resource}/get-coding-problem/${slug}`,
      config
    )
  },

  createNewProblemset(body, config = null) {
    return $axios.post(
      `${resource}/problemset/new`,
      body, config
    )
  },

  createNewRecommendedProblemset(body, config = null) {
    return $axios.post(
      `${resource}/problemset/recommend`,
      body, config
    )
  },

  updateContestProblems(slug, body, config = null) {
    return $axios.post(
      `${resource}/problemset/update-contest-problem/${slug}`,
      body, 
      config
    )
  },

  deleteOJProblemForContest(slug, body, config = null) {
    return $axios.post(
      `${resource}/problemset/delete-oj-problem-for-contest/${slug}`,
      body, 
      config
    )
  },

  deleteCodingProblemForContest(slug, body, config = null) {
    return $axios.post(
      `${resource}/problemset/delete-coding-problem-for-contest/${slug}`,
      body, 
      config
    )
  },

  getParticipantsForContest(slug, config = null) {
    return $axios.get(
      `${resource}/get-participants-for-contest/${slug}`, config
    )
  },
  
  updateParticipantStatus(body, config = null) {
    return $axios.post(
      `${resource}/update-participant-status`,
      body, 
      config
    )
  },

  getClarifications(slug, config = null) {
    return $axios.get(
      `${resource}/clarification/get/${slug}`, config
    )
  },

  askClarification(body, slug, config = null) {
    return $axios.post(
      `${resource}/clarification/ask/${slug}`,
      body, 
      config
    )
  },

  answerClarification(body, config = null) {
    return $axios.post(
      `${resource}/clarification/answer`,
      body, 
      config
    )
  },

  writeLog(slug, body, config = null) {
    return $axios.post(
      `${resource}/log/${slug}`,
      body, 
      config
    )
  },
  
  
  getMyTeams(config = null) {
    return $axios.get(
      `${resource}/get-my-teams`,
      config
    )
  },

  getMyTeamInProblemset(slug, config = null) {
    return $axios.get(
      `${resource}/get-my-team-in-problemset/${slug}`,
      config
    )
  },
  
  registerNewTeam(body, config = null) {
    return $axios.post(
      `${resource}/register-team-members`,
      body, 
      config
    )
  },

  registerNewTeamForContest(slug, body, config = null) {
    return $axios.post(
      `${resource}/register-team-for-contest/${slug}`,
      body, 
      config
    )
  },

  getTeamMembers(team_id, config = null) {
    return $axios.get(
      `${resource}/get-team-members/${team_id}`,
      config
    )
  },
  
  getOjProblems(config = null) {
    return $axios.get(
      `${resource}/get-oj-problems`,
      config
    )
  },

  getOjSubmissions(config = null) {
    return $axios.get(
      `${resource}/get-oj-submissions`,
      config
    )
  },

  getOjProblem(ojName, ojProblemCode, config = null) {
    return $axios.get(
      `${resource}/get-oj-problem/${ojName}/${ojProblemCode}`,
      config
    )
  },
};