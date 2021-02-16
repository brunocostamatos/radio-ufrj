import Parser from 'rss-parser'
import { CronJob } from 'cron'

import { prisma as db } from './generated/prisma-client'
import { logger, Log, normalizeStr } from './utils'

const parser = new Parser()

const currentTags: number[] = []

interface ScheduleChildInput {
   url: string
   id: string
   timer: string
   timeZone: string
   logTag: string
}

process.on(
   'message',
   ({ url, id, timer, timeZone, logTag }: ScheduleChildInput) => {
      logger(['info', [`${logTag}: `, 'Created Cron']])

      const cron = new CronJob(
         '*/1 * * * *',
         () => {
            if (!process.send) return

            send('RUNNING', true, 'Atualizando...', [
               'info',
               [`${logTag}: `, 'Running Cron']
            ])

            return parser
               .parseURL(url)
               .then(async data => {
                  const items = data.items && (await createItems(data.items))

                  const { title, description } = data

                  return {
                     title,
                     slug: title && normalizeStr(title),
                     cover: data.image?.url,
                     description,
                     items
                  }
               })
               .then(data => {
                  return db.updateSource({ data: data as any, where: { id } })
               })
               .then(() => {
                  send('IDLE', true, 'Atualizado com sucesso. Aguardando...', [
                     'info',
                     [`${logTag}: `, 'Seccess Cron']
                  ])
               })
               .catch((err: any) => {
                  send('IDLE', false, JSON.stringify(err), [
                     'error',
                     [`${logTag}: `, err]
                  ])
               })
         },
         null as any,
         false,
         timeZone
      )

      send('IDLE', true, 'Aguardando...')
      cron.start()
   }
)

function send(status: string, health: boolean, message: string, log?: Log) {
   if (!process.send) return
   if (log) logger(log)
   process.send({ status, health, message })
}

async function createItems(items: Parser.Item[]) {
   const connect = await Promise.all(
      items.map(async item => {
         const { title, content, guid: url, enclosure } = item

         if (!url) return

         const match = url.match(/http(s|):\/\/(.*)\/(?<guid>[0-9]+)$/)

         if (!match || !match.groups) return

         const { guid } = match.groups

         const exist = db.$exists.item({
            guid
         })

         const data = {
            title,
            description: content,
            type: undefined,
            length: undefined,
            slug: (title && normalizeStr(title)) || '',
            ...enclosure,
            ...(url && (await fetchDetail(url))),
            url
         }

         if (typeof data.length === 'string') {
            data.length = parseInt(data.length)
         }

         const id = await ((await exist)
            ? db
                 .updateItem({
                    data,
                    where: {
                       guid
                    }
                 })
                 .id()
            : db
                 .createItem({
                    ...data,
                    guid
                 })
                 .id())

         return {
            id
         }
      })
   )

   return {
      connect
   }
}

async function fetchDetail(url: string) {
   const response = await fetch(url)
      .then(data => data.json())
      .then(({ response: { episode } }) => episode)

   const {
      tags: _tags,
      download_enabled,
      download_url: download,
      waveform_url,
      published_at,
      hidden
   } = response

   const waveform = await fetch(waveform_url)
      .then(data => data.json())
      .then(({ response: { points: wave } }) => createWave(waveform_url, wave))

   const { connect } = await createTags(_tags)

   return {
      tags: {
         connect
      },
      download: download_enabled ? (download as string) : undefined,
      publishedAt: hidden ? undefined : new Date(published_at),
      waveform
   }
}

interface TagInput {
   tag_id: number
   name: string
}

async function createTags(tags: TagInput[]) {
   const connect = (
      await Promise.all(
         tags.map(async data => {
            const { tag_id: tag, name } = data

            const exists = db.$exists.tag({
               tag
            })

            const id = await ((await exists) ? updateTag() : createTag())

            return {
               id
            }

            function createTag() {
               const existsInBath =
                  currentTags.findIndex(value => value === tag) !== -1

               const result = existsInBath ? updateTag() : createTagBath()

               return result
            }

            function updateTag() {
               return db
                  .updateTag({
                     data: {
                        name
                     },
                     where: {
                        tag
                     }
                  })
                  .id()
            }

            function createTagBath() {
               currentTags.push(tag)
               return db
                  .createTag({
                     name,
                     tag,
                     text: name
                  })
                  .id()
            }
         })
      )
   ).filter(obj => !!obj)

   return {
      connect
   }
}

async function createWave(url: string, set: number[]) {
   const exists = db.$exists.wave({
      url
   })

   const id = await ((await exists)
      ? db
           .updateWave({
              data: {
                 wave: {
                    set
                 }
              },
              where: {
                 url
              }
           })
           .id()
      : db
           .createWave({
              url,
              wave: {
                 set
              }
           })
           .id())

   return {
      connect: {
         id
      }
   }
}
