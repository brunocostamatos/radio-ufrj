import React, {useMemo} from 'react'

import styles from '../assets/css'

const { components, icons, shadow } = styles
const { arrows, card } = components
const { arrow_left, arrow_right } = icons
export function Arrows({ stateDirection, setHandler, renderController }) {
   const display = useMemo(() => {
      if (!stateDirection) return ''
      if (!stateDirection.right && !stateDirection.left) return 'none'
      return ''
   }, [stateDirection])
   if(!renderController || !stateDirection) return null
   const { left, right } = stateDirection
   return (
      <ul style={{ display }} className={`${arrows.container} ${card.container} ${shadow.down}`}>
         <li>
            <a
               href="#left"
               ref={setHandler}
               className={`${arrows.link} ${arrow_left}${
                  left ? '' : ` ${arrows.disable}`
               }`}
            >
               voltar
            </a>
         </li>
         <li>
            <a
               href="#right"
               ref={setHandler}
               className={`${arrows.link} ${arrow_right}${
                  right ? '' : ` ${arrows.disable}`
               }`}
            >
               proximo
            </a>
         </li>
      </ul>
   )
}

export default Arrows
