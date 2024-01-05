export interface IElectronAPI {
  loadPreferences: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
    darkMode: any
    // electron: any
  }
  interface Navigator {
    browserLanguage: string
  }
}
