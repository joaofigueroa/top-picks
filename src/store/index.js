import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    search: ""
  },
  getters: {
    search(state) {
      return state.search
    }
  },
  mutations: {
    setSearch(state, payload) {
      state.search = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
