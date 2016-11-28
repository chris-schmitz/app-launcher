const {Menu, Tray} = require('electron')
const path = require('path')
const groupLauncher = require('../../lib/GroupLauncher')
const windowHelper = require('./Window')
const chalk = require('chalk')
const {Storage, StorageActions} = require('../../lib/StorageInterface')
const {app} = require('electron')



// I can't decide if it's a good idea to inject the app as
function TrayMenu(win){
    this.win = win
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

            this.addOpenAppMenuItem(menuitems)
            menuitems.push({type: 'separator'})

            this.addLaunchGroupMenuItems(menuitems, result.records)
            menuitems.push({type: 'separator'})

            this.addAboutMenuItem(menuitems)
            menuitems.push({type: 'separator'})

            this.addQuitMenuItem(menuitems)

            const contextMenu = Menu.buildFromTemplate(menuitems)
            this.tray.setContextMenu(contextMenu)

        })
        .catch(error => console.error(`Tray Error: ${chalk.red(error)}`))
}

TrayMenu.prototype.refreshTray = function(win){
    this.tray.destroy()
    this.setTray(win)
}

TrayMenu.prototype.addQuitMenuItem = function(menuitems){
    menuitems.push({
        label: 'Quit AppLauncher',
        click:() => {
            app.exit(0)
        }
    })
}

TrayMenu.prototype.addAboutMenuItem = function(menuitems){
    menuitems.push({
        label: 'About AppLauncher',
        click(){
            let win = windowHelper.newWindow({
                height: 240,
                width: 310,
                // titleBarStyle: 'hidden',
                resizable: false
            })

            win.loadURL(`file://${__dirname}/src/about.html`)

            win.on('closed', () => {
                win = null
            })
        }
    })
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

TrayMenu.prototype.addOpenAppMenuItem = function(menuitems){
    menuitems.unshift({
        label: 'Open Launcher',
        click:() => {
            this.win.show()
        }
    })
}

module.exports = TrayMenu
