import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      isMainPage: true,
    }
  },
  mutations: {
    setMainPage(state, value) {
      state.isMainPage = value
    },
    
  },
})

export default store
