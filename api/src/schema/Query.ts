import { prismaObjectType } from 'nexus-prisma'

export const Query = prismaObjectType<'Query'>({
   name: 'Query',
   definition(t) {
      t.prismaFields([
         'source',
         'sources',
         'sourcesConnection',
         'itemsConnection',
         'item',
         'configs'
      ])
   }
})
