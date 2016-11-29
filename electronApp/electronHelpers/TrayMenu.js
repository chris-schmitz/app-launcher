const {Menu, Tray, app} = require('electron')
const path = require('path')
const groupLauncher = require('../../lib/GroupLauncher')
const windowHelper = require('./Window')
const chalk = require('chalk')
const {Storage, StorageActions} = require('../../lib/StorageInterface')
const {aboutMenuItem, quitMenuItem, openAppMenuItem} = require('./SharedMenuItems')




// I can't decide if it's a good idea to inject the app as
function TrayMenu(win){
    this.win = win
    this.tray = null
}

TrayMenu.prototype.newTray = function(){
    this.tray = new Tray(path.resolve(__dirname, '../assets/rocketTemplate.png'))
}

TrayMenu.prototype.setTray = function(){
    console.log(chalk.blue('Loading groups from tray menu'))

    Storage.handleRequest(StorageActions.GETALLGROUPS, [])
        .then(result => {

            this.newTray()
            this.tray.setToolTip('Launch applications by group')

            let menuitems = []

            menuitems.push(openAppMenuItem(this.win, "Open AppLauncher"))
            menuitems.push({type: 'separator'})

            this.addLaunchGroupMenuItems(menuitems, result.records)
            menuitems.push({type: 'separator'})

            menuitems.push(aboutMenuItem)

            menuitems.push({type: 'separator'})

            menuitems.push(quitMenuItem)


            const contextMenu = Menu.buildFromTemplate(menuitems)
            this.tray.setContextMenu(contextMenu)

        })
        .catch(error => console.error(`Tray Error: ${chalk.red(error)}`))
}

TrayMenu.prototype.refreshTray = function(win){
    this.tray.destroy()
    this.setTray(win)
}


TrayMenu.prototype.addLaunchGroupMenuItems = function(menuitems, groups){
    let groupMenuItems = groups.map(group => {
        return {
            label: `Launch group: ${group.name}`,
            click: (menuitem, browserWin, event) => {
                groupLauncher.launch(group.name, (launchResult) => {
                    if(!this.win.isDestroyed()){
                        this.win.webContents.send('groupLaunchedFromTray', launchResult)
                    }
                })
            }
        }
    })
    .forEach(item => menuitems.push(item))
}

module.exports = TrayMenu
