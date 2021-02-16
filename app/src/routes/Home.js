import React from 'react'
import MediaQuery from 'react-responsive'
import { Helmet } from 'react-helmet'

import Row from '../components/Row'
import Live from '../components/Live'
import News from '../components/News'
import Programas from '../components/Programas'

import style from '../assets/css'

import { getTitle } from '../utils/misc'

import logoSrc from '../assets/img/logo.png'
import styled from 'styled-components'


const WrapperScrollerAside = styled.div`
   min-width: 0;
`
export function Home() {
   const { app } = style.components
   return (
      <div
         className="overflow-x"
         style={{ padding: 'var(--padding) var(--padding) 0' }}
      >
         <Helmet>
            <title>{getTitle()}</title>
            <meta
               name="description"
               content="Rádio institucional da Universidade Federal do Rio de Janeiro"
            />
         </Helmet>
         <MediaQuery maxWidth={800}>
            <img className={app.logo} src={logoSrc} alt="" />
         </MediaQuery>
         <Row>
            <Live />
            <MediaQuery minWidth={701}>
               <WrapperScrollerAside>
                  <News breakPoint={701} />
               </WrapperScrollerAside>
            </MediaQuery>
         </Row>
         <MediaQuery maxWidth={700}>
            <Row>
               <News />
            </Row>
         </MediaQuery>
         <Row>
            <Programas />
         </Row>
      </div>
   )
}

export default Home
