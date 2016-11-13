const {BrowserWindow} = require('electron')

function WindowHelper (){}

WindowHelper.newWindow = function(properties){
    return new BrowserWindow(properties)
}

module.exports = WindowHelper
