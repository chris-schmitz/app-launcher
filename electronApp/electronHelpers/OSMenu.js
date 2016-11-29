const {Menu} = require('electron')
const groupLauncher = require('../../lib/GroupLauncher')
const chalk = require('chalk')
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
            // this.newMenu()

            let template = []

            // Note that this style of adding the menus differs structurally from
            // the way the tray menu constructs itself. After you're done with
            // the OS menu, go back and compare the two, pick the one you like
            // more, and refactor the other to match
            template.push(createAppMenu(this.win))

            // what menus do we actually need for the mac os?
            // Application (About, hides, Quit)
            // Help?
            //

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
