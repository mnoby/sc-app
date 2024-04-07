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
    setUpdateValues(state, value){
      state.updateValues = value
    },
  },
})

export default store
