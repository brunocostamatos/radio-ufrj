import React from 'react'

import { GET_SOURCES } from '../graphql/Query'

import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'

import { ListScroller } from './ListScroller'

const pathFunction = str => `/programas/${str}`

const CardProgramas = styled.li`
   margin-right: var(--padding);
   flex: 1 0 100%;
   min-width: 200px;
   max-width: 250px;
   display: flex;
   border-radius: 0.5rem;
   overflow: hidden;
   background-color: var(--color-white);
   box-shadow: 0 3px 10px 0 var(--color-black-30);
   transition: box-shadow 300ms;
   &:hover,
   &:focus {
      box-shadow: 0 0.5rem 1.25rem 0 var(--color-black-30);
   }

   article {
      display: flex;
   }

   img {
      width: 100%;
   }

   &:last-of-type {
      margin-right: 0;
   }
`

export function Programas() {
   const { data, fetchMore } = useQuery(GET_SOURCES, {
      variables: {
         perPage: 10,
         skip: 0,
         orderBy: 'updatedAt_ASC'
      },
      fetchPolicy: 'cache-first'
   })

   if(!data) return null

   return (
      <ListScroller title="Programas" >
         {data.sourcesConnection.edges.map(({ node }, i) => <Card data={node} key={i}/>)}
      </ListScroller>
   )
}

function Card({data, size}) {
   return <CardProgramas size={size}>
      <Link to={pathFunction(data.slug)}>
         <article>
               <img src={data.cover} alt={data.title} />
         </article>
      </Link>
   </CardProgramas>
}

export default Programas
