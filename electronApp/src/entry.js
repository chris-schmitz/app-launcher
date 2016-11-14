const Vue = require('vue')

const App = require('./App.vue')
const Store = require('./VuexStore')
const store = require('./VuexStore')

require('./style/base.sass')

new Vue({
    el: '#app',
    store,
    render: h => h(App)
})
