const {app} = require('electron')
const appConfig = require('./appConfig')
const ipc = require('electron').ipcMain
const groupLauncher = require('../lib/GroupLauncher')

const fs = require('fs')
const path = require('path')
const config = require('../config')
const trayIcon = require('./TrayMenu')
const windowHelper = require('./electronHelpers/Window')

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

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', () => {
    createMainAppWindow()
    trayIcon(win)
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit()
    }
})


app.on('activate', () => {
    if(win === null){
        createMainAppWindow()
    }
})

function sendLaunchReply(event, payload = {success: false, message: 'Main process error.'}){
    console.log(payload)
    event.sender.send('launchGroup-reply', payload)
}

ipc.on('launchGroup', (event, group) => {
    Promise.all(groupLauncher.getPromiseArrayForGroup(group))
    .then(result =>  sendLaunchReply(event, {success: true, message: result.join('\n')} ))
    .catch(result => sendLaunchReply(event, { success: false, message: result} ))
})

function getGroups(){
    // note, we're extracting this function because eventually it will
    // be replaced with a command that reads from indexdb
    return require('../config').groups
}

ipc.on('loadGroups', event => {
    debugger
    event.sender.send('loadGroups-reply', {success: true, groups: getGroups()})
})
