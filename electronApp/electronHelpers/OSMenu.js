const {Menu} = require('electron')
const {Storage, StorageActions} = require('../../lib/StorageInterface')
const {aboutMenuItem, quitMenuItem, openAppMenuItem} = require('./SharedMenuItems')
const appConfig = require('../appConfig')

function OsMenu(win){
    this.win = win
}

OsMenu.prototype.setMenu = function(){
    console.log('setting os menu')
    Storage.handleRequest(StorageActions.GETALLGROUPS)
        .then(result => {

            let template = []

            template.push(createAppMenu(this.win))

            const menu = Menu.buildFromTemplate(template)
            setApplicationMenu(menu)
        })
        .catch(error => {
            console.error(new Error(error))
        })
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
