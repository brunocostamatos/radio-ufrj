import { makePrismaSchema } from 'nexus-prisma'
import { prisma as client } from '../generated/prisma-client'
import datamodelInfo from '../generated/nexus-prisma'

import { join } from 'path'

import * as types from './all'

export default makePrismaSchema({
   types,

   prisma: {
      client,
      datamodelInfo
   },

   typegenAutoConfig: {
      contextType: 'Context',
      sources: [
         {
            alias: 'Context',
            source: join(__dirname, '../context.ts')
         }
      ]
   },

   outputs: {
      schema: join(__dirname, '../../../app/src/graphql/generated/schema.gql'),
      typegen: join(__dirname, '../generated/nexus.ts')
   }
})
