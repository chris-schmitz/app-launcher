const {Menu, Tray} = require('electron')
const path = require('path')
const groupLauncher = require('../lib/GroupLauncher')
const icp = require('electron').icpMain
const windowHelper = require('./electronHelpers/Window')
const {Storage} = require('../lib/StorageInterface')


function TrayMenu(){
}

TrayMenu.prototype.newTray = function(){
    this.tray = new Tray(path.resolve(__dirname, './assets/rocketTemplate.png'))
}

TrayMenu.prototype.setTray = function(win){
    Storage.getAll(result => {
        let groups = result.records

        this.newTray()
        this.tray.setToolTip('Launch applications by group')

        let menuitems = groups.map(group => {
            return {
                label: `Launch group: ${group.name}`,
                click: (menuitem, browserWin, event) => {
                    console.log('launching group', group.name)
                    groupLauncher.launch(group.name, (launchResult) => {
                        console.log('got launch result')
                        // I'm not sure if I like the idea of passing along the payload
                        // regardless of success to the renderer function or not. Part
                        // of me wants to put a conditional check here for success,
                        // but realy if I do, what does that accomplish? Yeah I could
                        // branch off from here to do stuff, but in the end it seems
                        // like the only thing I would want to do is change the color
                        // of the notification message shown to the user, a task better
                        // handled by the renderer process. For now I'm going to pass
                        // it all through and see how it feels. Let future me deal
                        // with a refactor if this decission sucked ;)
                        if(!win.isDestroyed()){
                            win.webContents.send('groupLaunched', launchResult)
                        }
                    })
                }
            }
        })

        menuitems.unshift({type: 'separator'})
        menuitems.unshift({
            label: 'About AppLauncher',
            click: () => {
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
        menuitems.push({type: 'separator'})
        menuitems.push({label: 'Quit AppLauncher', role: 'quit'})

        const contextMenu = Menu.buildFromTemplate(menuitems)
        this.tray.setContextMenu(contextMenu)
    })
}

TrayMenu.prototype.refreshTray = function(win){
    this.tray.destroy()
    this.setTray(win)
}



module.exports = TrayMenu
