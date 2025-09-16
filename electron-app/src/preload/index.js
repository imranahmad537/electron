// preload.js
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)

    contextBridge.exposeInMainWorld('api', {
      login: (username, password) => ipcRenderer.invoke('login', { username, password }),
      getSession: () => ipcRenderer.invoke('get-session'),
      //  validateLicense: (key) => ipcRenderer.invoke("submit-key", key),
      // add order
      addOrder: (order) => ipcRenderer.invoke("add-order", order),
      // get order
       getOrders: () => ipcRenderer.invoke("get-orders"), // fetch orders
        addProduct: (product) => ipcRenderer.invoke("add-product", product),
  getProducts: () => ipcRenderer.invoke("get-products"),

    getUsers: () => ipcRenderer.invoke("get-users"),
  addUser: (user) => ipcRenderer.invoke("add-user", user),
  updateUser: (user) => ipcRenderer.invoke("update-user", user),
  deleteUser: (id) => ipcRenderer.invoke("delete-user", id),

    })
  } catch (error) {
    console.error(error)
  }
} else {
  // fallback for when contextIsolation is off
  window.electron = electronAPI
  window.api = {
    login: (username, password) => ipcRenderer.invoke('login', { username, password }),

    getSession: () => ipcRenderer.invoke('get-session'),
     // add order
      addOrder: () => ipcRenderer.invoke("add-order"),
      // get order
      getOrders: () => ipcRenderer.invoke("get-orders")
  }
}
