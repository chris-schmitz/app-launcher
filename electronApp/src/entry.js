const Vue = require('vue')
const App = require('./App.vue')

require('./style/base.sass')

new Vue({
    el: '#app',
    render: h => h(App)
})
