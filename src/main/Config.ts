import { ipcMain } from 'electron'

ipcMain.on('config:set', (event, args) => {
  global.config = args
})

ipcMain.handle('config:get', (event, args) => {
 return global.config
})

export { }
