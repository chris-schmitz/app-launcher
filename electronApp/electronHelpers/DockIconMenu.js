const {Menu, app} = require('electron')
const groupLauncher = require('../../lib/GroupLauncher')
const {Storage, StorageActions} = require('../../lib/StorageInterface')
const {aboutMenuItem, quitMenuItem, openAppMenuItem} = require('./SharedMenuItems')
const appConfig = require('../appConfig')

function DockIconMenu(win){
    this.win = win
}

DockIconMenu.prototype.setMenu = function(){
    console.log('setting dock menu')
    Storage.handleRequest(StorageActions.GETALLGROUPS)
        .then(result => {

            let template = []

            template.push(aboutMenuItem)
            template.push({type: 'separator'})
            template.push(openAppMenuItem(this.win, "Preferences"))
            template.push({type: 'separator'})
            template.push(quitMenuItem)


            const menu = Menu.buildFromTemplate(template)
            setDocMenu(menu)
        })
        .catch(error => {
            console.error(new Error(error))
        })
}

function setDocMenu(menu){
    console.log('setting application menu')
    app.dock.setMenu(menu)
}

function createAppMenu(win){
    return {
    }
}

module.exports = DockIconMenu
