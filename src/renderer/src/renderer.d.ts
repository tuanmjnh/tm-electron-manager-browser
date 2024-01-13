export interface IElectronAPI {
  loadPreferences: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
    // electron: any
    DarkMode: any
    DarkMode: any
    Dialog: any
    Config: any
    Puppeteer: any
  }
  interface Navigator {
    browserLanguage: string
  }
}
