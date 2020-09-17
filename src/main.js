import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from '@/router'
import store from './store'
import vuetify from './plugins/vuetify';
import { createProvider, isAuthenticated } from './vue-apollo'

Vue.config.productionTip = false

//Route Guards
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.forVisitors)) {
    if (isAuthenticated()) {
      console.log("authenticated")
      next({
        path: "/home",
      });
    } else next();
  } else if (to.matched.some((record) => record.meta.forAuth)) {
    if (!isAuthenticated()) {
      next({
        path: "/cadastro",
      });
    } else next();
  } else next();
});

new Vue({
  router,
  store,
  vuetify,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
