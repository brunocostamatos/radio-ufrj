import { prismaObjectType } from 'nexus-prisma'

export const Wave = prismaObjectType<'Wave'>({
   name: 'Wave',
   definition(t) {
      t.prismaFields(['id', 'wave'])
   }
})
