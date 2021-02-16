import { prismaObjectType } from 'nexus-prisma'

export const Subscription = prismaObjectType<'Subscription'>({
   name: 'Subscription',
   definition(t) {
      t.prismaFields(['source', 'item'])
   }
})
