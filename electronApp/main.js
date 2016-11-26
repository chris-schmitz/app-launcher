const {app} = require('electron')
const appConfig = require('./appConfig')
const ipc = require('electron').ipcMain
const groupLauncher = require('../lib/GroupLauncher')
const fs = require('fs')
const path = require('path')
const config = require('../config')
const TrayMenu = require('./TrayMenu')
const windowHelper = require('./electronHelpers/Window')
const chalk = require('chalk')

const settings = require('electron-settings')
const {Storage, StorageActions} = require('../lib/StorageInterface')

if(process.env.NODE_ENV !== 'development'){
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..' ,'node_modules', '.bin', 'electron'),
      hardRestMethod: 'exit'
    })
}

let win, tray

function createMainAppWindow(){
    win = windowHelper.newWindow({
        height: appConfig.window.height,
        width: appConfig.window.width,
        titleBarStyle: 'hidden'
    })


    win.loadURL(`file://${__dirname}/client/index.html`)

    if(appConfig.debugMode){
        win.webContents.openDevTools()
    }

    win.on('close', event => {
        if(!app.isQuitting){
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


app.on('ready', () => {

    Storage.handleRequest(StorageActions.INITIALIZESTORAGE)
        .then(result => {
            console.log(`rezultz :P ${JSON.stringify(result)}`)
            createMainAppWindow()

            Storage.handleRequest(StorageActions.GETHIDEAPPONLAUNCHSTATE, [])
                .then(result => {
                    let {hide} = result.records[0]
                    if(hide){
                        win.hide()
                    }
                })
                .catch(result => console.error('init', JSON.stringify(result.error)))

            createTrayMenu()

            // if(process.env.NODE_ENV !== 'production'){
            //     require('vue-devtool').install()
            // }

        })
        .catch(error => {
            console.error('init', JSON.stringify(error))
            createMainAppWindow()
            // display an error notification
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

// Event bridges

function EventResult(success = false, message = 'Error generating message', payload = []){
    return {success, message, payload}
}

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
                tray.refreshTray(win)
            }
            sendStorageReply(event, result)
        })
        .catch(err => {
            console.error(new Error(chalk.red(err)))
        })
})
