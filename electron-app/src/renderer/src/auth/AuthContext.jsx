import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await window.api.login(username, password);
      if (res.ok) {
        setUser(res.user);
        return { ok: true, user: res.user };
      } else {
        setError(res.message);
        return { ok: false, message: res.message };
      }
    } catch (err) {
      setError(err.message);
      return { ok: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}

// import React, { createContext, useContext, useEffect, useState } from 'react'

// const MyAuthContext = createContext(null)

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     ;(async () => {
//       try {
//         // Check if window.api exists
//         if (!window.api || !window.api.getSession) {
//           throw new Error('API not available')
//         }
        
//         const res = await window.api.getSession()
//         if (res?.ok) setUser(res.user)
//       } catch (err) {
//         console.error('Failed to get session:', err)
//         setError('API not available')
//       } finally {
//         setLoading(false)
//       }
//     })()
//   }, [])

//   const login = async (username, password) => {
//     setError('')
//     try {
//       // Check if window.api exists
//       if (!window.api || !window.api.login) {
//         throw new Error('API not available')
//       }
      
//       const res = await window.api.login(username, password)
//       if (res.ok) {
//         setUser(res.user)
//         return { ok: true }
//       } else {
//         setError(res.message || 'Login failed')
//         return { ok: false, message: res.message }
//       }
//     } catch (err) {
//       console.error('Login error:', err)
//       setError('API not available')
//       return { ok: false, message: 'API not available' }
//     }
//   }

//   const logout = async () => {
//     try {
//       if (window.api && window.api.logout) {
//         await window.api.logout()
//       }
//     } catch (err) {
//       console.error('Logout error:', err)
//     } finally {
//       setUser(null)
//     }
//   }

//   const value = { user, loading, error, login, logout }
//   return <MyAuthContext.Provider value={value}>{children}</MyAuthContext.Provider>
// }

//  function useAuth() {
//   const context = useContext(MyAuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }
// export default useAuth;
// // import React, { createContext, useContext, useEffect, useState } from 'react'

// // const MyAuthContext = createContext(null)

// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null)
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState('')

// //   useEffect(() => {
// //     ;(async () => {
// //       try {
// //         const res = await window.api.getSession()
// //         if (res?.ok) setUser(res.user)
// //       } finally {
// //         setLoading(false)
// //       }
// //     })()
// //   }, [])

// //   const login = async (username, password) => {
// //     setError('')
// //     const res = await window.api.login(username, password)
// //     if (res.ok) {
// //       setUser(res.user)
// //       return { ok: true }
// //     } else {
// //       setError(res.message || 'Login failed')
// //       return { ok: false, message: res.message }
// //     }
// //   }

// //   const logout = async () => {
// //     await window.api.logout()
// //     setUser(null)
// //   }

// //   const value = { user, loading, error, login, logout }
// //   return <MyAuthContext.Provider value={value}>
// //     {children}
// //     </MyAuthContext.Provider>
// // }

// // export function useAuth() {
// //   return useContext(MyAuthContext)
// // }
