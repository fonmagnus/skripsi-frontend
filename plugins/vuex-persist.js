import VuexPersistence from 'vuex-persist';

export default ({ store }) => {
  new VuexPersistence({
    key: ['answers', 'activeSubmissionId'],
    storage: window.localStorage,
    modules: ['answers'],
  }).plugin(store);
  
  new VuexPersistence({
    key: ['onlyShowMine'],
    storage: window.localStorage,
    modules: ['leaderboard'],
  }).plugin(store);

  new VuexPersistence({
    key: ['timer', 'timerInterval', 'isCountingDown'],
    storage: window.localStorage,
    modules: ['timer'],
  }).plugin(store);

  new VuexPersistence({
    key: ['isProfileCompleted'],
    storage: window.localStorage,
    modules: ['profile'],
  }).plugin(store);

  new VuexPersistence({
    key: ['getTheme'],
    storage: window.localStorage,
    modules: ['theme'],
  }).plugin(store);
};