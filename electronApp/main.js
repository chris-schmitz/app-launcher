const {app, BrowserWindow} = require('electron')
const appConfig = require('./appConfig')

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
