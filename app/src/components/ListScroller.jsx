import React from 'react'

import Header from './Header'

import styled from 'styled-components'
import { useCallback } from 'react'

import { useTouchScroller, useMouseScroller } from '../utils/hooks'


const ScrollableContainer = styled.section`
   display: flex;
   flex: 1;
   padding: var(--padding) 0 0 0;
   flex-direction: column;
   max-width: 100%;
   width: 100%;
`

const ScrollableWrapper  = styled.div`
   position: relative;
   display: flex;
   flex: 1;
`

const ScrollableList = styled.ul`
   display: flex;
   padding-bottom: 1rem;
   min-width: max-content;
   overflow: visible;
`

export function ListScroller({ children, title }) {
   const [, setTouchScrollRef] = useTouchScroller()
   const [renderController, setMouseScrollRef,stateDirection, setHandler] = useMouseScroller()

   const setScrollRef = useCallback((node) => {
      if (!node) return null
      setTouchScrollRef(node)
      setMouseScrollRef(node)
   }, [setTouchScrollRef, setMouseScrollRef])

   return (
      <ScrollableContainer>
         <Header text={title} setHandler={setHandler} renderController={renderController} stateDirection={stateDirection} />
         <ScrollableWrapper>
            <ScrollableList ref={setScrollRef}>
               {children}
            </ScrollableList>
         </ScrollableWrapper>
      </ScrollableContainer>
   )
}

export default ListScroller
