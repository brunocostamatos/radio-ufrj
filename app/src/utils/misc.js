import ReactHtmlParser from 'react-html-parser'

export function normalizeStr(str) {
   return str
      .normalize('NFKD')
      .replace(/[\u0300-\u036F]/g, '')
      .replace(/[^A-Za-z0-9\/\-]/g, '')
      .replace(/(\s|_)/g, '-')
      .toLowerCase()
}

export function fetchApi(edges, fetchMore, key) {
   fetchMore({
      variables: {
         skip: edges.length
      },
      updateQuery: (prev, { fetchMoreResult }) => {
         if (!fetchMoreResult) return prev
         return {
            [key]: {
               ...fetchMoreResult[key],
               edges: [
                  ...((prev && prev[key].edges) || []),
                  ...fetchMoreResult[key].edges
               ]
            }
         }
      }
   })
}

export function shortString(str) {
   const array = str.substring(0, 100).split(' ')
   array.pop()
   return `${array.join(' ')}...`
}

export function getTitle(str) {
   const name = `Rádio UFRJ`
   return str ? `${name} | ${str}` : name
}

export const stringToHtml = (regExpList = []) => origString => {
   let string = origString
   regExpList.forEach(([reg, str]) => {
      string = string.replace(reg, str)
   })

   return ReactHtmlParser(string)
}

export function runInAnimationFrames(fn, ...fns) {
   if (!fn) return
   requestAnimationFrame(() => {
      fn()
      runInAnimationFrames(...fns)
   })
}

export function spreadArgsInFn(fn) {
   return args => fn(...args)
}
