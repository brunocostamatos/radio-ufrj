import { prismaObjectType } from 'nexus-prisma'

export const Source = prismaObjectType<'Source'>({
   name: 'Source',
   definition(t) {
      t.prismaFields([
         'id',
         'type',
         'title',
         'description',
         'cover',
         'items',
         'slug',
         'url'
      ])
   }
})

export const AggregateSource = prismaObjectType<'AggregateSource'>({
   name: 'AggregateSource',
   definition(t) {
      t.prismaFields(['*'])
   }
})

export const sourcesConnection = prismaObjectType<'SourceConnection'>({
   name: 'SourceConnection',
   definition(t) {
      t.prismaFields(['edges', 'pageInfo'])
      t.field('aggregate', {
         type: AggregateSource,
         resolve: ({ edges }, _var, ctx, { variableValues: { type, url } }) => {
            return {
               count:
                  type || url
                     ? ctx.db
                          .sourcesConnection({ where: { type, url } })
                          .aggregate()
                          .count()
                     : edges.length
            }
         }
      })
   }
})
