export interface IElectronAPI {
  loadPreferences: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
    // electron: any
  }
  interface Navigator {
    browserLanguage: string
  }
}
