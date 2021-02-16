import { render } from 'react-dom'

import App from './components/App'
import Providers from './components/Providers'
import createClient, { data, cache } from './graphql/ApolloClient'
import * as serviceWorker from './utils/serviceWorker'

import './index.css'
import './variables.css'

const root = document.getElementById('root')

const client = createClient()

cache.writeData({ data })

client.onResetStore(() => {
   cache.writeData({ data })
})

render(Providers({ App, client }), root)

serviceWorker.register()
