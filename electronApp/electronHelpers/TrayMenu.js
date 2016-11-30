const {Menu, Tray, app} = require('electron')
const path = require('path')
const windowHelper = require('./Window')
const chalk = require('chalk')
const co = require('co')
const {aboutMenuItem, quitMenuItem, openAppMenuItem, launchGroupsMenuItems} = require('./SharedMenuItems')




function TrayMenu(win){
    this.win = win
    this.tray = null
}

// hmm, I don't think this is actually needed.
TrayMenu.prototype.newTray = function(){
    this.tray = new Tray(path.resolve(__dirname, '../assets/rocketTemplate.png'))
}

TrayMenu.prototype.setTray = function(){
    let me = this
    co(function *(){

        me.newTray()
        me.tray.setToolTip('Launch applications by group.')
        let menuitems = []

        menuitems.push(openAppMenuItem(me.win, "Open AppLauncher"))
        menuitems.push({type: 'separator'})

        let launchGroupMenu = yield launchGroupsMenuItems(me.win)
        menuitems = menuitems.concat(launchGroupMenu)

        menuitems.push({type: 'separator'})

        menuitems.push(aboutMenuItem)

        menuitems.push({type: 'separator'})

        menuitems.push(quitMenuItem)


        const contextMenu = Menu.buildFromTemplate(menuitems)
        me.tray.setContextMenu(contextMenu)

    })
    .catch(error => console.error(error))
}


TrayMenu.prototype.refreshTray = function(){
    this.tray.destroy()
    this.setTray()
}



module.exports = TrayMenu
