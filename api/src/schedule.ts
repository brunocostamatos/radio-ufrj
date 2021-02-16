import { prisma as db } from './generated/prisma-client'
import { headerLog, arrowLog } from './utils'

import { resolve } from 'path'

import { fork } from 'child_process'

const childPath = resolve(__dirname, './ScheduleChild')

export async function schedule() {
   headerLog(`SCHEDULE STARTING`)
   try {
      const sources = await db.sources()
      const configs = db.configs()

      arrowLog('Sources', [sources.length])

      await db
         .deleteManyCrons({
            id_not: null
         })
         .count()
         .then(count => arrowLog('Old Jobs killed', [count]))

      const [{ timeZone }] = await configs

      if (sources.length > 0) headerLog('CRONS FROM DB')

      await Promise.all(
         sources.map(data => {
            return initCron(data, timeZone, 'DB')
         })
      )

      await subscribeSources(timeZone)
   } catch (e) {
      console.error(e)
   }
}

async function subscribeSources(timeZone: string) {
   headerLog('CRONS FROM SUB')

   const sourceIterator = await db.$subscribe
      .source({
         mutation_in: ['CREATED']
      })
      .node()

   arrowLog('Listening for new sources...', ['\n'], false)

   while (true) {
      const { value } = await sourceIterator.next()
      if (value) await initCron(value, timeZone, 'SUB')
   }
}

async function initCron(data: any, timeZone: string, _logTag: string) {
   const logTag = `CRON ${_logTag}`
   console.info(`${logTag} INIT: `, data, timeZone, '\n')
   const { url } = data
   const cron = fork(childPath)

   cron.send({
      ...data,
      timeZone,
      logTag
   })

   const id = await db.createCron({ pid: cron.pid, status: 'STARTING' }).id()

   cron.on('exit', async () => {
      await db.updateCron({
         data: {
            status: 'STOPED',
            health: false
         },
         where: { id }
      })
   })

   cron.on('message', async ({ status, message, health }: any) => {
      await db.updateCron({
         data: {
            status,
            health,
            lastMessage: message
         },
         where: { id }
      })
   })

   return db.updateSource({
      data: {
         cron: {
            connect: {
               id
            }
         }
      },
      where: {
         url
      }
   })
}

export default schedule
