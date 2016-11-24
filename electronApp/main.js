const {app} = require('electron')
const appConfig = require('./appConfig')
const ipc = require('electron').ipcMain
const groupLauncher = require('../lib/GroupLauncher')
const fs = require('fs')
const path = require('path')
const config = require('../config')
const TrayMenu = require('./TrayMenu')
const windowHelper = require('./electronHelpers/Window')

const settings = require('electron-settings')
const {Storage} = require('../lib/StorageInterface')

if(process.env.NODE_ENV !== 'development'){
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..' ,'node_modules', '.bin', 'electron')
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
    storageInitilization()
    createMainAppWindow()
    createTrayMenu()

    // if(process.env.NODE_ENV !== 'production'){
    //     require('vue-devtool').install()
    // }
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
    console.log(payload)
    event.sender.send('launchGroup-reply', payload)
}

ipc.on('launchGroup', (event, group) => {
    Promise.all(groupLauncher.getPromiseArrayForGroup(group))
        .then(result =>  sendLaunchReply(event, {success: true, message: result.join('\n')} ))
        .catch(result => sendLaunchReply(event, { success: false, message: result} ))
})

function sendStorageReply(event, eventResult){
    event.sender.send('storageRequest-reply', eventResult)
}
ipc.on('storageRequest', (event, requestType, payload) => {
    Storage.handleRequest(requestType, payload)
        .then(result => {
            // tray.refreshTray(win)
            sendStorageReply(event, result)
        })
        .catch(err => err)
})

function storageInitilization(){
    let chalk = require('chalk')
    console.log(chalk.green('initilizing storage'))
    Storage.getAllGroups([], (result) => {
        console.log(chalk.red(JSON.stringify(result)))
        if(result.records.length === 0){
            console.log(chalk.green('upserting initial record'))
            Storage.upsert(
                {id: 123, name: 'test', launchApps:[]},
                (result) => {
                    console.log(chalk.blue(JSON.stringify(result)))
                }
            )
        }
    })
}
