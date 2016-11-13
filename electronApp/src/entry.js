const Vue = require('vue')
const App = require('./App.vue')
const ipc = require('electron').ipcRenderer

require('./style/base.sass')

new Vue({
    el: '#app',
    render: h => h(App)
})
