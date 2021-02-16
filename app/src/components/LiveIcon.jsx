import React, { useRef, useContext } from 'react'

import { ReactComponent as Icon } from '../assets/img/live_color.svg'

import PlayerContext from '../utils/audio'

export function LiveIcon({ className, state: [paused] }) {
   const ctx = useContext(PlayerContext)

   const liveIconRef = useRef(null)

   return <Icon ref={liveIconRef} className={className} />
}

export default LiveIcon
