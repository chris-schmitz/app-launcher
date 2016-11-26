const {Menu, Tray} = require('electron')
const path = require('path')
const groupLauncher = require('../lib/GroupLauncher')
const windowHelper = require('./electronHelpers/Window')
const chalk = require('chalk')
const {Storage, StorageActions} = require('../lib/StorageInterface')
const {app} = require('electron')



// I can't decide if it's a good idea to inject the app as
function TrayMenu(win){
    this.win = win
}

TrayMenu.prototype.newTray = function(){
    this.tray = new Tray(path.resolve(__dirname, './assets/rocketTemplate.png'))
}

TrayMenu.prototype.setTray = function(){
    console.log(chalk.blue('Loading groups from tray menu'))

    Storage.handleRequest(StorageActions.GETALLGROUPS, [])
        .then(result => {

            this.newTray()
            this.tray.setToolTip('Launch applications by group')

            let menuitems = []

            addOpenAppMenuItem(menuitems)
            menuitems.push({type: 'separator'})

            addLaunchGroupMenuItems(menuitems, result.records)
            menuitems.push({type: 'separator'})

            addAboutMenuItem(menuitems)
            menuitems.push({type: 'separator'})

            addQuitMenuItem(menuitems)

            const contextMenu = Menu.buildFromTemplate(menuitems)
            this.tray.setContextMenu(contextMenu)

        })
        .catch(error => console.error(chalk.red(error)))
}

TrayMenu.prototype.refreshTray = function(win){
    this.tray.destroy()
    this.setTray(win)
}

function addQuitMenuItem(menuitems){
    menuitems.push({
        label: 'Quit AppLauncher',
        click:() => {
            app.exit(0)
        }
    })
}

function addAboutMenuItem(menuitems){
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

function addLaunchGroupMenuItems(menuitems, groups){
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

function addOpenAppMenuItem(menuitems){
    menuitems.unshift({
        label: 'Open Launcher',
        click:() => {
            this.win.show()
        }
    })
}

module.exports = TrayMenu
