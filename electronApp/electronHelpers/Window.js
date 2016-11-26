const {BrowserWindow} = require('electron')

function WindowHelper (){}

WindowHelper.newWindow = function(properties){
    console.log(properties)
    return new BrowserWindow(properties)

}

module.exports = WindowHelper
