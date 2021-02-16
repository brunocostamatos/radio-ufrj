import gql from 'graphql-tag'

export const UPDATE_PAGE = gql`
   mutation updatePage($page: Int!) {
      updatePage(page: $page) @client
   }
`
