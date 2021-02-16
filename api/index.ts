import { schedule } from './src/schedule'
import { isProduction } from './src/utils'
import { ApolloServer } from 'apollo-server'
import { prisma as db } from './src/generated/prisma-client'
import { promisify } from 'util'
import { exec as execCallback } from 'child_process'
import { seed } from './seed'

import schema from './src/schema'

const exec = promisify(execCallback)

const { IS_TEST_MODE } = process.env

const server = new ApolloServer({
   tracing: !isProduction,
   introspection: !isProduction,
   playground: !isProduction,
   schema,
   context: {
      db
   }
})

initProduction()
async function initProduction() {
   try {
      if (!IS_TEST_MODE) {
         await exec(
            'npx prisma deploy --skip-hooks --no-generate --no-seed'
         ).then(({ stdout }) => console.log(stdout))
         await seed().then(() => console.log(`Seed complete!`))
      }

      await server.listen().then(({ url }) => {
         logStart(url)
         schedule()
      })

      if (IS_TEST_MODE) process.exit(0)
   } catch (e) {
      console.error(e)
   }
}

function logStart(url: string) {
   console.log(`
🚀 Server ready at ${url}
`)
}
