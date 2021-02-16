import React from 'react'

import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-hooks'

import PlayerContext, { playerData } from '../utils/audio'

export function Providers({ App, client }) {
   return (
      <PlayerContext.Provider value={playerData}>
         <BrowserRouter>
            <ApolloProvider client={client}>
               <App />
            </ApolloProvider>
         </BrowserRouter>
      </PlayerContext.Provider>
   )
}

export default Providers
