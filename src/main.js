/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import store from '@/products'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'


loadFonts()


// Create vue app
const stores = createPinia()
const app = createApp(App)


// Use plugins
app.use(vuetify)
app.use(stores)
app.use(router)
app.use(store)

// Mount vue app
app.mount('#app')
