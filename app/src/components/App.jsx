import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Menu from './Menu'
import Scroll from './Scroll'

import CustomSwitch from '../routes'

import styles from '../assets/css'

export function App() {
   const { app } = styles.components
   return (
      <Router>
         <section className={app.container}>
            <main className={app.main}>
               <CustomSwitch />
            </main>
            <Menu />
         </section>
         <Scroll />
      </Router>
   )
}

export default App
