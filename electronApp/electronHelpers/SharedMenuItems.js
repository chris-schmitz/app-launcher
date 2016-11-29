const windowHelper = require('./Window')
const {app, globalShortcut} = require('electron')


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

module.exports= {
    aboutMenuItem,
    quitMenuItem,
    openAppMenuItem
}
