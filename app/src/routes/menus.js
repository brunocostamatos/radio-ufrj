import { normalizeStr } from '../utils/misc'

import Home from './Home'
import AoVivo from './AoVivo'
import Eventos from './Eventos'
import PageContent from './PageContent'
import Sobre from './Sobre'

export const Components = {
   Home,
   AoVivo,
   Eventos,
   PageContent,
   Sobre
}

const data = [
   {
      icon: 'home',
      href: '/',
      text: 'Home',
      component: 'Home',
      sub: false
   },
   // {
   //   icon: 'live_mono',
   //   text: 'Ao Vivo',
   //   component: 'AoVivo',
   //   sub: false
   // },
   {
      icon: 'music_note',
      text: 'Programas',
      component: 'PageContent',
      sub: true,
      param: '/:prog/:slug',
      type: 'PODCAST'
   },
   // {
   //   icon: 'calendar',
   //   text: 'Eventos',
   //   component: 'Eventos'
   // },
   {
      icon: 'coffee',
      text: 'Notícias',
      component: 'PageContent',
      sub: true,
      type: 'NEWS',
      orderBy: 'publishedAt_DESC'
   },
   {
      icon: 'group',
      text: 'Sobre',
      component: 'Sobre',
      sub: true
   }
]

export const menus = normalizeMenus(data)
function normalizeMenus(menus) {
   return menus.map((args, i) => {
      const { href, text, index, sub, type, param, path, orderBy } = args
      return {
         ...args,
         index: index || i,
         href: normalizeStr(href || `/${text}`),
         sub,
         type: type || null,
         param: param || '/:slug',
         path: path || null,
         orderBy: orderBy || null,
         __typename: 'MenuItem'
      }
   })
}

export default menus
