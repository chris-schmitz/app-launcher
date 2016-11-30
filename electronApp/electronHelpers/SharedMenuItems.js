const windowHelper = require('./Window')
const {app, globalShortcut} = require('electron')
const groupLauncher = require('../../lib/GroupLauncher')
const {Storage, StorageActions} = require('../../lib/StorageInterface')




let aboutMenuItem = {
    label: 'About AppLauncher',
    click(){
        let win = windowHelper.newWindow({
            height: 240,
            width: 310,
            // titleBarStyle: 'hidden',
            resizable: false
        })

        win.loadURL(`file://${__dirname}/../src/about.html`)

        win.on('closed', () => {
            win = null
        })
    }
}

let quitMenuItem = {
    label: 'Quit AppLauncher',
    click:() => {
        app.exit(0)
    }
}

let openAppMenuItem = (win, label) => {
    return {
        label,
        click:() => {
            win.show()
        }
    }
}

let launchGroupsMenuItems = function(win){
    return new Promise((resolve, reject) => {
        Storage.handleRequest(StorageActions.GETALLGROUPS, [])
            .then(result => {

                let groupMenuItems = result.records.map(group => {
                    return {
                        label: `Launch group: ${group.name}`,
                        click: (menuitem, browserWin, event) => {
                            groupLauncher.launch(group.name, (launchResult) => {
                                if(!win.isDestroyed()){
                                    win.webContents.send('groupLaunchedFromTray', launchResult)
                                }
                            })
                        }
                    }
                })
                resolve(groupMenuItems)
            })
            .catch(error => {
                reject(error)
            })
    })
}


module.exports= {
    aboutMenuItem,
    quitMenuItem,
    openAppMenuItem,
    launchGroupsMenuItems
}
