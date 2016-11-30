const {Menu} = require('electron')
const {aboutMenuItem, quitMenuItem, openAppMenuItem} = require('./SharedMenuItems')
const appConfig = require('../appConfig')

function OsMenu(win){
    this.win = win
}

OsMenu.prototype.setMenu = function(){
    // Note that we're not launching groups from this menu and, because of this,
    // we don't need to refresh the menu so there's no need to make a call to storage
    // or to wrap this all in a generator. Just pull the shared menu items we need.
    let template = []

    template.push(createAppMenu(this.win))

    const menu = Menu.buildFromTemplate(template)
    setApplicationMenu(menu)
}

function setApplicationMenu(menu){
    console.log('setting application menu')
    Menu.setApplicationMenu(menu)
}

function createAppMenu(win){
    return {
        label: appConfig.appName,
        submenu:[
            aboutMenuItem,
            {type: 'separator'},
            openAppMenuItem(win, "Preferences"),
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            quitMenuItem
        ]
    }
}

module.exports = OsMenu
