import React from 'react'

import styles from '../assets/css'

export function Row({ children }) {
   const { row } = styles.components
   return <div className={row.container}>{children}</div>
}

export default Row
