import { useRef, useEffect } from 'react'

export function Scroll() {
   const scroll = useRef(0)

   useEffect(() => {
      window.addEventListener('scroll', scrollEvents, false)

      function scrollEvents() {
         const nscroll = window.scrollY

         const limit =
            document.body.offsetHeight - document.body.offsetHeight / 20

         const ended = window.innerHeight + window.scrollY >= limit

         if (nscroll > scroll.current && !ended) dispatchScrollEvent('DOWN')
         else if (nscroll < scroll.current) dispatchScrollEvent('UP')

         if (window.scrollY <= 0) dispatchScrollEvent('START')
         else if (ended) dispatchScrollEvent('END')

         function dispatchScrollEvent(type) {
            const event = new CustomEvent('SCROLL', {
               detail: {
                  type
               }
            })
            window.dispatchEvent(event)
         }

         scroll.current = nscroll
      }

      return () => {
         window.removeEventListener('scroll', scrollEvents)
      }
   }, [])

   return null
}

export default Scroll
