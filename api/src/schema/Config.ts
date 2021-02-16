import { prismaObjectType } from 'nexus-prisma'

export const Config = prismaObjectType<'Config'>({
   name: 'Config',
   definition(t) {
      t.prismaFields(['*'])
   }
})
