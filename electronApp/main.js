const {app} = require('electron')
const appConfig = require('./appConfig')
const ipc = require('electron').ipcMain
const groupLauncher = require('../lib/GroupLauncher')
const fs = require('fs')
const path = require('path')
const config = require('../config')
const TrayMenu = require('./electronHelpers/TrayMenu')
const OsMenu = require('./electronHelpers/OSMenu')
const DockMenu = require('./electronHelpers/DockIconMenu')
const windowHelper = require('./electronHelpers/Window')
const chalk = require('chalk')
const co = require('co')

const settings = require('electron-settings')
const {Storage, StorageActions} = require('../lib/StorageInterface')

if(process.env.NODE_ENV !== 'development'){
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..' ,'node_modules', '.bin', 'electron'),
      hardRestMethod: 'exit'
    })
}

let win, tray, osMenu, dockMenu
let forceQuit = false

function createMainAppWindow(hideWindowOnCreation = false){
    win = windowHelper.newWindow({
        height: appConfig.window.height,
        width: appConfig.window.width,
        titleBarStyle: 'hidden',
    show: !hideWindowOnCreation
    })



    win.loadURL(`file://${__dirname}/client/index.html`)

    if(appConfig.debugMode){
        win.webContents.openDevTools()
    }

    win.on('close', event => {
        if(!forceQuit){
            event.preventDefault()
            win.hide()
        }
        return false
    })

    win.on('closed', (event) => {
        win = null
    })
}

function createTrayMenu(){
    tray = new TrayMenu(win)
    tray.setTray()
}

function createOsMenu(){
    osMenu = new OsMenu(win)
    osMenu.setMenu()
}

function createDockIconMenu(){
    dockMenu = new DockMenu(win)
    dockMenu.setMenu()
}


app.on('ready', () => {
    co(function *(){
        // app.dock.hide()
        yield Storage.handleRequest(StorageActions.INITIALIZESTORAGE)
        let hideResult = yield Storage.handleRequest(StorageActions.GETHIDEAPPONLAUNCHSTATE)
        let {hide} = hideResult.records[0]

        createMainAppWindow(hide)
        createTrayMenu()
        createOsMenu()
        createDockIconMenu()

        // if(process.env.NODE_ENV !== 'production'){
        //     require('vue-devtool').install()
        // }

    })
    .catch(error => {
        console.error(error)
        createMainAppWindow()
        // show error notification
    })

})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit()
    }
})


app.on('activate', () => {
    win.show()
})

app.on('before-quit', () => {
    forceQuit = true
})

// Event bridges

function sendLaunchReply(event, payload = {success: false, message: 'Main process error.'}){
    event.sender.send('launchGroup-reply', payload)
}

ipc.on('launchGroup', (event, group) => {
    groupLauncher.launch(group, launchResult => sendLaunchReply(event, launchResult))
})

function sendStorageReply(event, eventResult){
    event.sender.send('storageRequest-reply', eventResult)
}
ipc.on('storageRequest', (event, requestType, payload) => {
    Storage.handleRequest(requestType, payload)
        .then(result => {
            if(result.requestedAction !== StorageActions.GETALLGROUPS){
                tray.refreshTray()
                dockMenu.refreshDockIcon()
            }
            sendStorageReply(event, result)
        })
        .catch(err => {
            console.error(err)
        })
})
