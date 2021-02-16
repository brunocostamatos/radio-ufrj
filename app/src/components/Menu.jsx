import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useQuery } from '@apollo/react-hooks'
import MediaQuery from 'react-responsive'

import { Link, useLocation } from 'react-router-dom'

import { GET_MENU } from '../graphql/Query'

import logoSrc from '../assets/img/logo.png'
import { ReactComponent as Selector } from '../assets/img/selector.svg'

import stylesModule from '../assets/css'
import { useRect } from '../utils/hooks'

export function Menu() {
   const { pathname } = useLocation()

   const {
      data: { menus }
   } = useQuery(GET_MENU)

   const { components, icons } = stylesModule
   const { menu: styles } = components

   const menuRef = useRef()
   const [listener, setListener] = useState()

   const [, containerRect, setContainerRect, reloadContainerRect] = useRect()
   const [originItemRef, itemRect, setItemRect, reloadItemRect] = useRect()
   const [selectorRef, selectorRect, setSelectorRect, reloadSelectorRect] = useRect()

   const moveSelector = useCallback((pathname) => {
      if (!selectorRef.current || !menuRef.current) return
      const htmlSelector = (str = '') => `a[href="/${str}"]`

      let current = menuRef.current.querySelector(htmlSelector(pathname.split('/')[1]))
      if (!current) current = menuRef.current.querySelector(htmlSelector())

      const item = current.parentNode
      if(!containerRect.current) setContainerRect(item.parentNode)
      else reloadContainerRect()
      if(!itemRect.current || originItemRef.current !== item) setItemRect(item)
      else reloadItemRect()
      if(!selectorRect.current) setSelectorRect(selectorRef.current)
      else reloadSelectorRect()
      const position = ((-selectorRect.current.width/2) + itemRect.current.width/2) + itemRect.current.x - containerRect.current.x
      requestAnimationFrame(() => {
         selectorRef.current.style.transform  = `translateX(${position}px)`
      })
   }, [
      containerRect,
      itemRect,
      selectorRect,
      selectorRef,
      setContainerRect,
      setItemRect,
      setSelectorRect,
      originItemRef, reloadItemRect,
      reloadSelectorRect
   ])

   useEffect(() => {
      if (!menuRef.current || listener) return
      const current = menuRef.current
      setListener(addScrollListener(current))
      return () => {
         if (!listener) return
         removeScrollListener(current, listener)()
      }
   }, [menuRef, listener])

   useEffect(() => {
      moveSelector(pathname)
   }, [selectorRef, menuRef, pathname, moveSelector])

   return (
      <header ref={menuRef} className={styles.container}>
         <MediaQuery minWidth={800}>
            <img className={styles.logo} src={logoSrc} alt="" />
         </MediaQuery>
         <nav className={styles.menu}>
            <Selector className={styles.selector} ref={setSelectorRect} />
            <ul className={styles.list} ref={menuRef}>
               {menus.map(({ icon, href, text }, i) => (
                  <li className={styles.item} key={i}>
                     <Link
                        className={`${styles.link} ${icons[icon]}`}
                        to={href}
                     >
                        {text}
                     </Link>
                  </li>
               ))}
            </ul>
         </nav>
      </header>
   )
}

function handleScroll(target) {
   return ({ detail: { type } }) => {
      if (!target) return
      if (type === 'START' || type === 'END' || type === 'UP')
            target.style.transform = 'translateY(0%)'
      if (type === 'DOWN') target.style.transform = 'translateY(100%)'
   }
}

function removeScrollListener([target, ...args]) {
   return () => {
      if (!target) return
      target.remveEventListener(...args)
   }
}

function addScrollListener(target) {
   return () => {
      if (!target) return
      const args =  ['SCROLL', handleScroll(target)]

      window.addEventListener(...args, false)

      return [window, ...args]
   }
}

export default Menu
