const {Menu, app} = require('electron')
const groupLauncher = require('../../lib/GroupLauncher')
const {Storage, StorageActions} = require('../../lib/StorageInterface')
const {aboutMenuItem, quitMenuItem, openAppMenuItem, launchGroupsMenuItems} = require('./SharedMenuItems')
const appConfig = require('../appConfig')
const co = require('co')

function DockIconMenu(win){
    this.win = win
}

DockIconMenu.prototype.setMenu = function(){
    co(function *(){
    console.log('setting dock menu')

            let template = []

            // template.push(aboutMenuItem)
            // template.push({type: 'separator'})
            template.push(openAppMenuItem(this.win, "Preferences"))
            template.push({type: 'separator'})

            let launchGroupMenu = yield launchGroupsMenuItems(this.win)

            template.push({
                label: 'Launch Group',
                submenu: launchGroupMenu
            })

            // template = template.concat(launchGroupMenu)


            const menu = Menu.buildFromTemplate(template)
            setDocMenu(menu)
    })
    .catch(error => {
        console.error(new Error(error))
    })
}

function setDocMenu(menu){
    console.log('dock', app.dock)
    app.dock.setMenu(menu)
}

function createAppMenu(win){
    return {
    }
}

module.exports = DockIconMenu
