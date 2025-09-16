import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { checkLicenseKey } from './db.js'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { initDb } from './db.js'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import prompt from 'electron-prompt'
import { StrictMode } from 'react'

const __ifilename = fileURLToPath(import.meta.url)
const __idirname = path.dirname(__ifilename)

// let db = initDb()
let db
let currentSession = null

async function createWindow() {
  // Create the browser window.
  const preloadPath = path.join(__idirname, '../preload/index.mjs')
  console.log('Preload script path:', preloadPath)

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      sandbox: false
    }
  })

  // prompt({
  //   title:"License Key Required",
  //   label:"Enter license key",
  //   inputAttrs:{type:"text"},
  //   type:"input"
  // }).then((key) => {
  //   if(!key){
  //     return app.quit()
  //   }
  //   if(checkLicenseKey(key)){
  //     window.loadFile("index.html")
  //   }
  // }).catch(console.error)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__idirname, '../renderer/index.html'))
  }
}

// Create license window

// ipcMain.on('submit-key', (event, key) => {
//   const win = BrowserWindow.fromWebContents(event.sender);

//   if (checkLicenseKey(key)) {
//     dialog.showMessageBox({
//       type: 'info',
//       buttons: ['Ok'],
//       title: 'Success',
//       message: 'License key validated. Loading app...'
//     }).then(() => {
//       createWindow(); // ✅ open main app
//       if (win) win.close(); // ✅ close license window after
//     });
//   } else {
//     dialog.showMessageBox({
//       type: 'error',
//       buttons: ['Ok'],
//       title: 'Unauthorized',
//       message: 'Invalid license key'
//     }).then(() => {
//       app.quit(); // quit completely
//     });
//   }
// });
// Listen for key from modal
// ipcMain.on('submit-key', (event, key) => {
//   if (checkLicenseKey(key)) {
//     // Valid → close modal, open main
//     const win = BrowserWindow.fromWebContents(event.sender)
//     win.close()
//     // Optional: show success message
//     dialog.showMessageBox({
//         type: 'info',
//         buttons: ['Ok'],
//         title: 'Success',
//         message: 'License key validated. Loading app...'
//       })
//   } else {
//     dialog.showErrorBox('Unauthorized', 'Invalid license key')
//     app.quit()
//   }
// })

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // initialize Database
  try {
    //  db =  initDb(app.getPath('userData'))
    db = initDb()

    // Initialize Database
    try {
      db = initDb()
    } catch (error) {
      dialog.showErrorBox('Sqlite Database Error ', error.message)
      app.quit()
      return
    }

    // Prompt the user for the license key
    prompt({
      title: ' License Key Required',
      label: '🔑 License key',
      value: '',
      inputAttrs: {
        type: 'password', // hides input
        // minLength: 5,       // input constraints
        placeholder: 'Enter license key'
      },
      type: 'input',

      // UI Customization
      width: 400,
      height: 200,
      resizable: false,

      // Styling
      // your own CSS file
      buttonLabels: {
        ok: 'Validate',
        cancel: 'Exit'
      }
    })
      .then((key) => {
        if (key === null) {
          // User clicked cancel
          app.quit()
          return
        }
        if (checkLicenseKey(key)) {
          createWindow() // Create main window if key is valid
        } else {
          dialog.showErrorBox('Unauthorized', 'Invalid license key.')
          app.quit()
        }
      })
      .catch(console.error)
    // License check before loading UI
    // if (!checkLicense()) {
    //   mainWindow.loadFile("index.html");

    // }
    // else {
    //   mainWindow.loadFile("unauthorized.html"); // Make a simple page saying "Unauthorized system"
    // }

    // dialog.showMessageBox({
    //   type:"info",
    //   buttons:["Ok"],
    //   title: "Database Connection",
    //   message:"Database Connected Successfully"

    // })
  } catch (error) {
    dialog.showErrorBox('Sqlite Database Error ', error.message)
  }
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('get-session', async () => {
  return currentSession ? { ok: true, user: currentSession } : { ok: false }
})

ipcMain.handle('login', async (event, { username, password }) => {
  try {
    // fetch user from DB
    const stmt = db.prepare('SELECT * FROM users WHERE username = ? ')
    const user = stmt.get(username)

    if (!user) {
      return { ok: false, message: 'User not found' }
    }

    // compare password with stored hash
    const match = await bcrypt.compare(password, user.password_hash) // user.password = hashed
    if (!match) {
      return { ok: false, message: 'Invalid credentials' }
    }

    // create session
    currentSession = {
      username: user.username,
      id: user.id,
      role: user.role,
      loggedInAt: new Date()
    }
    return { ok: true, user: currentSession }
  } catch (error) {
    return { ok: false, message: error.message }
  }
})

// getting orders
// ipcMain.handle('get-orders', () => {
//   const stmt = db.prepare('SELECT * FROM orders')
//   return stmt.all()
// })

// add order
ipcMain.handle('add-order', (event, order) => {
  // const paymentStatus = order.paidAmount >= order.totalAmount ? 'PAID' : 'PARTIAL'
  const paymentStatus = order.paidAmount >= order.totalAmount ? 'PAID' :order.paidAmount > 0 ? 'PARTIAL' : 'UNPAID';
  const stmt = db.prepare(
    "INSERT INTO orders (customer_name, customer_address, marble_type, unit_price, marble_category, marble_length, marble_width, total_amount, paid_amount, remaining_amount, payment_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))"
  )
  stmt.run(
  order.customerName,     // customer_name
  order.customerAddress,  // customer_address
  order.marbleType,       // marble_type
  order.unitPrice,        // unit_price
  order.marbleCategory,   // marble_category
  order.marbleLength,     // marble_length
  order.marbleWidth,      // marble_width
  order.totalAmount,      // total_amount
  order.paidAmount,             // paid_amount
  order.remainingAmount,  // remaining_amount
  paymentStatus           // payment_status
)
  return true
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// ipcMain.handle('get-orders', () => {
//   return new Promise((resolve, reject) => {
//     db.prepare(`
//       SELECT 
//        order_id, 
//         customer_name, 
//         marble_type, 
//         marble_category, 
//         marble_length, 
//         marble_width, 
//         total_amount, 
//         paid_amount, 
//         remaining_amount, 
//         payment_status, 
//         created_at
//        FROM orders
//        ORDER BY created_at DESC`).all()
//        (err, rows) => {
//          if (err) reject(err);
//         else resolve(rows);
//        }
//     )

//   })
// })
ipcMain.handle("get-orders", () => {
  try {
    const rows = db
      .prepare(`
        SELECT 
         order_id,
          customer_name,
          marble_type,
          marble_category,
          marble_length,
          marble_width,
          total_amount,
          paid_amount,
          remaining_amount,
          payment_status,
          created_at
        FROM orders
        ORDER BY created_at DESC
      `)
      .all(); // <- runs immediately, returns rows

    return rows; // ipcMain can resolve this directly
  } catch (err) {
    console.error("Error in get-orders:", err);
    throw err;
  }
});

// export function getOrder(){
//   return db.prepare('SELECT * FROM orders').all()
// }