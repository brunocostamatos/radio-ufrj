import { prisma as db } from './src/generated/prisma-client'

export async function seed() {
   const sources = [
      'https://www.spreaker.com/show/4119263/episodes/feed',
      'https://www.spreaker.com/show/4119228/episodes/feed',
      'https://www.spreaker.com/show/4122065/episodes/feed',
      'https://www.spreaker.com/show/4121723/episodes/feed',
      'https://www.spreaker.com/show/4121728/episodes/feed',
      'https://www.spreaker.com/show/4595477/episodes/feed',
      'https://www.spreaker.com/show/4595496/episodes/feed',
      'https://www.spreaker.com/show/4595503/episodes/feed'
   ].map(async (url, i) => {
      const exist = await db.$exists.source({
         url
      })
      return (
         !exist &&
         db.createSource({
            url,
            type: i == 0 ? 'NEWS' : 'PODCAST'
         })
      )
   })

   const existConfig = (await db.configs()).length > 0

   return [
      !existConfig &&
         (await db.createConfig({
            timeZone: 'America/Sao_Paulo',
            liveUrl: 'http://servidor21.brlogic.com:7712/live',
            liveStatusUrl:
               'https://d36nr0u3xmc4mm.cloudfront.net/index.php/api/streaming/status/7712/b4adb51456e79883ecadce1a7ffefbf4/servidor21.brlogic.com',
            placeholderCover:
               'https://s13.maxcast.com.br/cover/49747/6fbc4263/498fda10/7e7b2c10-59c3-3669-b8e5-7dae1ccade21.jpg'
         })),
      ...(await Promise.all(sources))
   ]
}

export default seed
