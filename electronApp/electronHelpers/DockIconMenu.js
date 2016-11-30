const {Menu, app} = require('electron')
const {aboutMenuItem, quitMenuItem, openAppMenuItem, launchGroupsMenuItems} = require('./SharedMenuItems')
const co = require('co')

function DockIconMenu(win){
    this.win = win
}

DockIconMenu.prototype.setMenu = function(){
    co(function *(){
        let template = []

        template.push(openAppMenuItem(this.win, "Preferences"))
        template.push({type: 'separator'})

        let launchGroupMenu = yield launchGroupsMenuItems(this.win)

        template.push({
            label: 'Launch Group',
            submenu: launchGroupMenu
        })

        const menu = Menu.buildFromTemplate(template)
        setDocMenu(menu)
    })
    .catch(error => {
        console.error(error)
    })
}

function setDocMenu(menu){
    app.dock.setMenu(menu)
}

DockIconMenu.prototype.refreshDockIcon = function(){
    this.setMenu()
}

module.exports = DockIconMenu
