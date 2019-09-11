// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import './filter';
import './icon';
import router from './router';
import SocialSharing from 'vue-social-sharing';
import VueAnalytics from 'vue-analytics'

Vue.config.productionTip = false;

Vue.use(SocialSharing);
// 'UA-122659990-3' : Production
// id: 'UA-116836151-1' : Testing
Vue.use(VueAnalytics, {
  id: 'UA-122659990-3'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
