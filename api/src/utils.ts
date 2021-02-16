const { NODE_ENV } = process.env

export const isProduction = NODE_ENV === 'production'

export type Log = ['info' | 'log' | 'error', any[] | undefined]

export function logger(log: Log) {
   const [type, content] = log
   if (!isProduction || type === 'error') console[type](...(content || []))
}

export function arrowLog(title: string, values?: any[], dot = true) {
   logger([
      'info',
      [`==> ${title.toLowerCase()}${dot ? ':' : ''}`, ...(values || [''])]
   ])
}

export function headerLog(title: string) {
   logger([
      'info',
      [
         `
======================
${title.toUpperCase()}
======================
`
      ]
   ])
}

export function normalizeStr(str: string) {
   return str
      .normalize('NFKD')
      .replace(/[\u0300-\u036F]/g, '')
      .replace(/[^A-Za-z0-9\/\-]/g, '')
      .replace(/(\s|_)/g, '-')
      .toLowerCase()
}

export default {
   logger
}
