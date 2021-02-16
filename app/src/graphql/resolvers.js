import { GET_PAGE, GET_LIVE_CONTENT, GET_CONFIGS, GET_LIVE } from './Query'


export default {
   Mutation: {
      updatePage: (_parent, { page }, { cache }) => {
         cache.writeQuery({
            query: GET_PAGE,
            data: {
               page
            }
         })
      }
   },
   Query: {
      live: async (_parent, _var, { cache, client }) => {
         const { live } = await cache.readQuery({
            query: GET_LIVE_CONTENT
         })

         const {
            data: {
               configs: [
                  {
                     liveUrl: url,
                     liveStatusUrl: statusUrl,
                     placeholderCover: cover
                  }
               ]
            }
         } = await client.query({
            query: GET_CONFIGS
         })

         const data = {
            ...live,
            url,
            statusUrl,
            cover
         }

         await cache.writeQuery({
            query: GET_LIVE,
            data
         })

         return data
      }
   }
}
