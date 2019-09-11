import HostingPage from '@/components/HostingPage';
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'HostingPage',
      component: HostingPage
    }
  ]
});
