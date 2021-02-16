import React from 'react'
import MediaQuery from 'react-responsive'

import Arrows from './Arrows'
import styles from '../assets/css'

export function Header({ text: contenText, stateDirection, setHandler, renderController }) {
   const { text, components } = styles
   const { header } = components

   return (
      <header className={header.container}>
         <h1 className={text.t1}>{contenText}</h1>
         <MediaQuery minWidth={800}>
           <Arrows stateDirection={stateDirection} renderController={renderController} setHandler={setHandler} />
         </MediaQuery>
      </header>
   )
}

export default Header
