const {app, BrowserWindow} = require('electron')
const appConfig = require('./appConfig')
const ipc = require('electron').ipcMain
const {getPromiseArrayForGroup} = require('../lib/launchGroup')
const fs = require('fs')
const path = require('path')

let win

function createWindow(){
    win = new BrowserWindow({
        height: appConfig.window.height,
        width: appConfig.window.width
    })

    win.loadURL(`file://${__dirname}/client/index.html`)

    if(appConfig.debugMode){
        win.webContents.openDevTools()
    }

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit()
    }
})


app.on('activate', () => {
    alert('activated!')
    console.log('activated!')
    if(win === null){
        createWindow()
    }
})


function sendLaunchReply(event, payload = {success: false, message: 'Main process error.'}){
    console.log(payload)
    event.sender.send('launchGroup-reply', payload)
}

ipc.on('launchGroup', (event, group) => {
    Promise.all(getPromiseArrayForGroup(group))
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
