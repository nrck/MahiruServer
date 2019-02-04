import Vue from 'vue';
import Router from 'vue-router';
import AgentList from './views/AgentList.vue';
import Dashboard from './views/Dashboard.vue';
import JobnetList from './views/Jobnet.vue';

Vue.use(Router);

export default new Router({
  'base': process.env.BASE_URL,
  'mode': 'history',
  'routes': [
    {
      'component': Dashboard,
      'name': 'home',
      'path': '/'
    },
    {
      'component': Dashboard,
      'name': 'dashboard',
      'path': '/Dashboard'
    },
    {
      'component': AgentList,
      'name': 'agentlist',
      'path': '/Agent'
    },
    {
      'component': JobnetList,
      'name': 'jobnetlist',
      'path': '/Jobnet'
    }]
});
