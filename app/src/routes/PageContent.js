import React, { Fragment, useContext, useEffect, useState } from 'react'
import { stringToHtml } from '../utils/misc'
import { useQuery } from '@apollo/react-hooks'
import { useParams, Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import { GET_ITEM, GET_ITEMS } from '../graphql/Query'

import { getTitle } from '../utils/misc'
import PlayerContext from '../utils/audio'

import Cover from '../components/Cover'

import cssStyle from '../assets/css'

const container = {
   player: {
      margin: '1.5rem 0 1rem',
      height: '80px'
   },
   content: {
      text: {
         maxWidth: '75ch',
         display: 'flex',
         flexDirection: 'column',
         alignSelf: 'center'
      }
   }
}

const one = {
   fontSize: 'var(--font-size-big)',
   lineHeight: 1,
   fontWeight: 900
}

const two = {
   fontSize: '1.75rem',
   lineHeight: 1,
   fontWeight: 700
}

const black = 'var(--color-black)'
const white = 'var(--color-white)'
const blue = 'var(--color-blue)'

const title = {
   one: {
      black: {
         ...one,
         color: black
      },
      white: {
         ...one,
         color: white
      },
      color: {
         ...one,
         color: blue
      }
   },
   two: {
      black: {
         ...two,
         color: black
      },
      white: {
         ...two,
         color: white
      },
      color: {
         ...two,
         color: blue
      }
   }
}

const body = {
   fontSize: '1rem',
   lineHeight: 1.2
}

const text = {
   title,
   body: {
      black: {
         ...body,
         color: black
      },
      white: {
         ...body,
         color: white
      }
   }
}

const style = {
   text,
   container
}

const LINK_REG_EXP = /(?<line_start>([ ]+|)<br[<>br/\s]+\/>|)(?<content>[^:]+):[^<]+(?<start><a(?<href>[ ]+href="[^"]+")[^</>]+>)[^<]+(?<end><\/a>)(?<line>[\n]+|)/g
const BR_REG_EXP = /<br[<>br/\s]+\/>/gm
const STRONG_TITLE_REG_EXP = /(?<start><br[<>br/\s]+\/>)(?<title>[^:<>/]+):(?<end>([ ]+|)<br[<>br/\s]+\/>)/g
const STRONG_TEXT_REG_EXP = /(?<start><br[<>br/\s]+\/>)(?<sub_title>[^:<>/]+):(?<name>[^<.]+)(\.|)/g

export const regExps = [
   [BR_REG_EXP, '<br />'],
   [
      LINK_REG_EXP,
      '$<line_start><a $<href> class="text-link-external" target="_blank" rel="noopener noreferrer">$<content>$<end>$<line>'
   ],
   [
      STRONG_TITLE_REG_EXP,
      '$<start><strong class="text-title">$<title>:</strong><br />'
   ],
   [
      STRONG_TEXT_REG_EXP,
      '$<start><strong class="text-sub-title">$<sub_title>:</strong>$<name>'
   ]
]

const formater = stringToHtml(regExps)

export function Content({ config }) {
   let { slug, prog } = useParams()

   if (!config) return null

   return (
      <Fragment>
         {slug && (
            <Player
               slug={slug}
               config={config}
               header={true}
               autoplay={false}
            />
         )}
         <List config={config} slug={slug} prog={prog} />
      </Fragment>
   )
}

function Player({ slug, header, autoplay, config }) {
   const audio = useContext(PlayerContext)
   const [paused, setPaused] = useState(audio.paused)

   const { loading, error, data } = useQuery(GET_ITEM, {
      variables: {
         slug
      }
   })

   useEffect(() => {
      if (!data || !audio.paused) return
      setPaused(!autoplay)
   }, [data, audio, autoplay])

   if (loading || error) return null

   const { title, description } = data.item

   return (
      <div
         className="header-content"
         style={{
            padding: 'var(--padding)',
            display: 'flex',
            overflow: 'hidden',
            position: 'relative',
            alignItems: 'flex-start'
         }}
      >
         {header && (
            <Helmet>
               <title>{getTitle(`${config.text} | ${title}`)}</title>
               <meta name="description" content={description} />
            </Helmet>
         )}
         <div className="content-player">
            <Cover
               cover={data.item.source.cover}
               context={audio}
               url={data.item.download}
               state={[paused, setPaused]}
               styleClass="content-player-btn"
            />
            <h1
               style={{
                  ...style.text.title.one.white,
                  zIndex: 99,
                  fontSize: '1.5rem'
               }}
            >
               {formater(title)}
            </h1>
            <span
               style={{
                  display: 'flex',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  overflow: 'hidden'
               }}
            >
               <img
                  className={cssStyle.components.cover.bg}
                  src={data.item.source.cover}
                  alt="Capa"
               />
            </span>
         </div>
         <Cover
            cover={data.item.source.cover}
            style={{ height: 'auto' }}
            context={audio}
            url={data.item.download}
            state={[paused, setPaused]}
         />
         <span
            style={{ zIndex: 2, width: '70ch', marginLeft: 'var(--padding)' }}
         >
            <h1
               style={{
                  ...style.text.title.one.white,
                  marginBottom: 'var(--padding)'
               }}
            >
               {formater(title)}
            </h1>
            <p style={{ ...style.text.body.white }}>{formater(description)}</p>
         </span>
         <img
            className={cssStyle.components.cover.bg}
            src={data.item.source.cover}
            alt="Capa"
         />
      </div>
   )
}

function List({ slug, config, prog }) {
   const { loading, error, data } = useQuery(GET_ITEMS, {
      variables: {
         perPage: 100,
         type: config.type,
         prog: prog !== 'todos' ? prog : undefined,
         orderBy: config.orderBy || 'createdAt_ASC'
      }
   })

   if (loading || error) return null

   const { edges } = data.itemsConnection

   if (!slug) {
      const items = [...edges]
      const [first] = items
      return (
         <Fragment>
            <Helmet>
               <title>{getTitle(`${config.text}`)}</title>
               <meta name="description" content={`Notícias`} />
            </Helmet>
            {[
               first && <Player slug={first.node.slug} config={config} />,
               items.shift() && (
                  <Items
                     edges={items}
                     refLast={null}
                     config={config}
                     prog={prog || 'todos'}
                  />
               )
            ]}
         </Fragment>
      )
   }

   return (
      <Items
         edges={edges}
         refLast={null}
         config={config}
         prog={prog || 'todos'}
      />
   )
}

function Items({ edges, refLast, config, prog }) {
   return (
      <ul
         style={{
            ...style.container.content.text,
            marginTop: 'calc(var(--padding))',
            padding: '0 1rem'
         }}
      >
         {edges.map(({ node: { title, description, slug } }, i, arr) => {
            const ref = i === arr.length - 1 ? refLast : null

            let link

            if (config.href.includes('/:prog/:slug'))
               link = `${config.href.replace('/:prog/:slug', '')}${`/${prog ||
                  'todos'}`}/${slug}`
            else if (
               config.href.includes('/:prog') ||
               config.href === '/programas'
            )
               link = `/programas/${prog}/${slug}`
            else link = `${config.href.replace(config.param, '')}/${slug}`

            return (
               <li
                  key={i}
                  className={`${cssStyle.shadow.down}`}
                  style={{
                     marginBottom: 'var(--padding)',
                     backgroundColor: '#fff',
                     padding: 'var(--padding)',
                     borderRadius: '.5rem',
                     flex: 1,
                     maxWidth: '100%'
                  }}
                  ref={ref}
               >
                  <Link to={link}>
                     <h2
                        style={{
                           marginBottom: '1rem',
                           fontWeight: 700,
                           fontSize: '1.5rem'
                        }}
                     >
                        {formater(title)}
                     </h2>
                     <p>{formater(description)}</p>
                  </Link>
               </li>
            )
         })}
      </ul>
   )
}

export default Content
