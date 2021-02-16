import { prismaObjectType } from 'nexus-prisma'

export const Item = prismaObjectType<'Item'>({
   name: 'Item',
   definition(t) {
      t.prismaFields([
         'id',
         'type',
         'title',
         'description',
         'publishedAt',
         'createdAt',
         'slug',
         'guid',
         'tags',
         'download',
         'url',
         'length',
         'waveform',
         'source'
      ])
   }
})

export const AggregateItem = prismaObjectType<'AggregateItem'>({
   name: 'AggregateItem',
   definition(t) {
      t.prismaFields(['*'])
   }
})

export const ItemConnection = prismaObjectType<'ItemConnection'>({
   name: 'ItemConnection',
   definition(t) {
      t.prismaFields(['edges', 'pageInfo'])
      t.field('aggregate', {
         type: AggregateItem,
         resolve: ({ edges }, _var, ctx, { variableValues: { type, url } }) => {
            return {
               count:
                  type || url
                     ? ctx.db
                          .itemsConnection({ where: { source: { type, url } } })
                          .aggregate()
                          .count()
                     : edges.length
            }
         }
      })
   }
})
