import { useRef, useCallback, useState, useEffect } from 'react'

import { runInAnimationFrames } from './misc'


export function useRect() {
   const ref = useRef(null)
   const rect = useRef(null)

   const getRect = useCallback(() => {
         if(!ref.current) return
         rect.current = ref.current.getClientRects()[0]
   }, [])

   const runReload = useCallback(() => {
      getRect()
   }, [getRect])

   const setRef = useCallback((node) => {
      if(!ref.current && !node) return null
      ref.current = node

      getRect()
   }, [ref, getRect])

   useEffect(() => {
      window.addEventListener('resize', getRect, false)
      return () => window.removeEventListener('resize', getRect, false)
   }, [getRect])

   return [ref, rect, setRef, runReload]
}

export function useTouchScroller() {
   const ref = useRef(null)
   const [, nodeRect, setNodeRect] = useRect()
   const [, containerRect, setContainerRect] = useRect()
   const setRef = useCallback(node => {
      if (!node) return null

      ref.current = node

      setNodeRect(node)
      setContainerRect(node.parentNode)

      let limit = 0
      let start = 0
      let position = 0
      let move = 0

      const touchmove = (event) => {
         move = position + (event.changedTouches[0].pageX - start)
         if (move > 0) move = 0
         if (move < limit) move = limit
         node.style.transition = 'none'
         node.style.transform = `translateX(${move}px)`
      }

      const localOperations  = {
         touchstart({ changedTouches: [{ pageX }]}) {
            limit = -1 * (nodeRect.current.width - containerRect.current.width)
            start = pageX
            node.addEventListener('touchmove', touchmove, false)
         },
         touchend() {
            position = move
            node.removeEventListener('touchmove', touchmove, false)
         }
      }

      Object.entries(localOperations).map((args) => {
         const result = [...args, false]
         node.addEventListener(...result)
         return result
      })
   }, [containerRect, nodeRect, setContainerRect, setNodeRect])

   return [ref, setRef]
}

export function useMouseScroller() {
   const ref = useRef(null)
   const [renderController, setRenderController] = useState(false)
   const [state, setState] = useState({
      left: false,
      right: true,
   })
   const [, scrollerRect, setScrollerRect, scrollerRectReload] = useRect()
   const [, containerRect, setContainerRect, containerRectReload] = useRect()
   const [, nextRect, setNextRect] = useRect()
   const [, firstRect, setFirstRect] = useRect()
   const [, secondRect, setSecondRect] = useRect()

   // const verifyDirection = useCallback(() => {
   //    if (
   //       !renderController
   //       || !scrollerRect.current
   //       || !containerRect.current
   //    ) return
   //    // console.log('===============================')
   //    // console.log('firstRect', firstRect.current.left)
   //    // console.log('scrollerRect', scrollerRect.current.width)
   //    // console.log('containerRect', containerRect.current.width)
   //    // firstRectReload()
   //    // scrollerRectReload()
   //    // containerRectReload()
   //    // console.log('containerRect', containerRect.current.width)
   //    // console.log('scrollerRect', scrollerRect.current.width)
   //    // console.log('firstRect', firstRect.current.left)
   //    // console.log('===============================')

   //    // if (firstRect.current.left < 0) {
   //    //       ref.current.style.minWidth = ''
   //    //       ref.current.style.justifyContent = ''
   //    // }

   //    setState((state) => ({
   //       right: scrollerRect.current.width >= containerRect.current.width,
   //       left: state.left,
   //    }))

   //    // if (!newState.right) {
   //    //       ref.current.style.minWidth = '100%'
   //    //       ref.current.style.justifyContent = 'space-around'
   //    // }
   // }, [renderController, containerRect, scrollerRect, state])

   const setRef =  useCallback((node) => {
      if (!node) return null

      ref.current = node
      setRenderController(true)
   }, [])



   const setHandler = useCallback((node) => {
      if(!node || !ref.current) return null

      const scroller = ref.current

      if(!scrollerRect.current) setScrollerRect(scroller)
      if(!containerRect.current) setContainerRect(scroller.parentNode)
      if(!firstRect.current) setFirstRect(scroller.querySelector('li:first-of-type'))
      if(!secondRect.current) setSecondRect(scroller.querySelector('li:nth-of-type(2)'))

      node.addEventListener('click', (event) => {
         event.preventDefault()
         scrollerRectReload()
         containerRectReload()

         const direction = node.getAttribute('href').replace('#','')

         let perPage = +scroller.getAttribute('data-per')

         if (!perPage) {
            perPage = Math.floor((containerRect.current.width - firstRect.current.width) / secondRect.current.width) + 1
         }

         const [currentChildren, currentChildrenNumber] = getNextChildren(scroller, direction, +scroller.getAttribute('data-current'))
         const [nextChildren, nextChildrenNumber] = getNextChildren(scroller, direction, currentChildrenNumber, perPage)

         const sameElement = nextChildren === currentChildren

         if(!sameElement) setNextRect(nextChildren)


         const moveSize = (!nextRect.current || sameElement) ? 0 : scrollerRect.current.left - nextRect.current.left

         const newState = {
            left: moveSize < 0,
            right: scrollerRect.current.width + (moveSize + containerRect.current.left) >= containerRect.current.width
         }

         setState(newState)

         let save  = () => {
            scroller.setAttribute('data-current', nextChildrenNumber)
            scroller.setAttribute('data-per', Math.floor(containerRect.current.width / nextRect.current.width))
         }

         let config = () => {
            scroller.style.transition = `${(containerRect.current.left * 2 + containerRect.current.width)/perPage}ms ease-in-out`
         }

         let move = () => {
            scroller.style.transform = `translateX(${moveSize}px)`
         }

         const operations = {
               left({ left }) {
                  if(left) return
                  save = () => {
                     scroller.removeAttribute('data-per')
                     scroller.removeAttribute('data-current')
                  }
                  config = () => null
                  move = () => {
                     scroller.style.transform = `translateX(0)`
                  }
               },
               right({ right }) {
                  if (right) return
                  save = () => null
                  move = () => {
                     scroller.style.transform = `translateX(${-scrollerRect.current.width + containerRect.current.width}px)`
                  }
               }
         }

         operations[direction](newState)

         runInAnimationFrames(
            save,
            config,
            move,
         )
      }, false)
   }, [
      containerRect,
      firstRect,
      nextRect,
      scrollerRect,
      secondRect,
      setContainerRect,
      setFirstRect,
      setNextRect,
      setScrollerRect,
      setSecondRect,
      containerRectReload,
      scrollerRectReload
   ])

   // useEffect(() => {
   //    verifyDirection()
   //    window.addEventListener('resize', verifyDirection, false)
   //    return () => window.removeEventListener('resize', verifyDirection, false)
   // }, [renderController, verifyDirection])

   return [renderController, setRef, state, setHandler]
}

function getNextChildren(target, direction, currentChildrenNumber, perPage = 0) {
   const getElementOfType = createGetElementOfType(target)
   return ({
      left: () => getElementOfType(currentChildrenNumber - perPage),
      right: () => getElementOfType(currentChildrenNumber + perPage)
   })[direction]()
}

function createGetElementOfType(target) {
   return (number, fromLast = false) => {
      const getResult = (number) => ([
         target.querySelector(`li:nth${(fromLast && '-last') || ''}-of-type(${number})`),
         number,
      ])

      const result = getResult(number || 1)

      if (!result[0]) return getResult(1)

      return result
   }
}

