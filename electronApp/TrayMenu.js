const {Menu, Tray} = require('electron')
const path = require('path')
const config = require('../config')
const groupLauncher = require('../lib/GroupLauncher')
const icp = require('electron').icpMain
const windowHelper = require('./electronHelpers/Window')

module.exports = function setTrayIcon(win){
    tray = new Tray(path.resolve(__dirname, './assets/rocketTemplate.png'))
    tray.setToolTip('Launch applications by group')

    let menuitems = config.groups.map(group => {
        return {
            label: `Launch group: ${group.name}`,
            click: (menuitem, browserWin, event) => {
                groupLauncher.launch(group.name, (launchResult) => {
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
                    win.webContents.send('groupLaunched', launchResult)
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
    tray.setContextMenu(contextMenu)
}
