import { prismaObjectType } from 'nexus-prisma'

export const Tag = prismaObjectType<'Tag'>({
   name: 'Tag',
   definition(t) {
      t.prismaFields(['id', 'tag', 'text'])
   }
})
