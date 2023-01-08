import { createApp } from 'vue'
import App from './App.vue'
import VueHighlightJS from 'vue3-highlightjs'
// import 'highlight.js/styles/vs.css'
import './css/sni-ba.css'

const app = createApp(App)
app.mount('#app')
app.use(VueHighlightJS)


 
 