import React, { useContext, useState, Fragment, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_LIVE } from '../graphql/Query'

import Cover from './Cover'

import srcBg from '../assets/img/bg.png'

import AnimatedLiveIcon from './LiveIcon'
import styles from '../assets/css'

import PlayerContext from '../utils/audio'

const { icons, shadow, components } = styles
const { live: styleLive, cover: styleCover } = components

export function LivePlayer() {
   let { data } = useQuery(GET_LIVE)
   const context = useContext(PlayerContext)

   const pauseState = useState(context.paused)

   if (!data) {
      data = {
         live: {
            url: '',
            statusUrl: '',
            cover: '',
            content: {
               cover: null,
               name: 'Rádio UFRJ',
               clock: '-',
               singer: '-',
               music: '-',
               author: '-'
            }
         }
      }
   }

   const { content, cover, url, statusUrl } = data.live

   return (
      <article className={styleLive.container}>
         <div className={`${styleLive.current} ${shadow.up}`}>
            <header className={styleLive.header}>
               <span className={styleLive.name}>
                  <h1 className={styleLive.title}>Ao Vivo</h1>
                  <AnimatedLiveIcon
                     className={styleLive.icon}
                     state={pauseState}
                  />
               </span>
            </header>
            <Content
               statusUrl={statusUrl}
               content={content}
               cover={cover}
               url={url}
               context={context}
               state={pauseState}
            />
         </div>
         <footer></footer>
      </article>
   )
}

function Content({ statusUrl, content, cover, url, context, state }) {
   const [status, setStatus] = useState({})

   useEffect(() => {
      if (!statusUrl) return
      const id = setInterval(() => {
         fetch(statusUrl)
            .then(res => res.json())
            .then(({ currentTrack }) => {
               const [music, singer] = currentTrack.split(' - ')
               setStatus({
                  music,
                  singer
               })
            })
      }, 2000)
      return () => {
         clearInterval(id)
      }
   }, [context, setStatus, statusUrl])

   const realCover = status.cover || content.cover || cover

   return (
      <Fragment>
         <section className={styleLive.info}>
            <Cover
               cover={realCover}
               url={url}
               context={context}
               state={state}
               styleClass={components.live.btnToggle}
               isLive={true}
            />
            <section className={styleLive.text}>
               <footer>
                  <p className={icons.music_note}>
                     {status.music || content.music}
                  </p>
                  <p className={icons.singer}>
                     {status.singer || content.singer}
                  </p>
               </footer>
            </section>
         </section>
         <img className={styleCover.bgClean} src={srcBg} alt="Capa" />
      </Fragment>
   )
}

export default LivePlayer
