import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import { GET_VIEWS } from '../graphql/Query'

import { Components } from './menus'

export function CustomSwitch() {
   const {
      data: { menus }
   } = useQuery(GET_VIEWS)

   const routes = []

   menus.forEach((config, i) => {
      const { href, sub, component, param, path } = config
      routes.push({
         ...config,
         href: `${href}${path || ''}`
      })
      if (sub) {
         if (param.includes('/:prog'))
            routes.push({
               ...config,
               index: i,
               href: `${href}/:prog`,
               sub: false,
               component: `${component}`
            })
         routes.push({
            ...config,
            index: i,
            href: `${href}${param || '/:slug'}`,
            sub: false,
            component: `${component}`
         })
      }
   })

   return (
      <Switch>
         {routes
            .slice()
            .map((config, i) => {
               const { href } = config
               const Component = Components[config.component]
               return (
                  <Route key={i} path={`${href}`}>
                     <Component config={config} />
                  </Route>
               )
            })
            .reverse()}
      </Switch>
   )
}

export default CustomSwitch
