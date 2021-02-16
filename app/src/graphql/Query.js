import gql from 'graphql-tag'

export const GET_PLAYER = gql`
   query getPlayer {
      player @client
   }
`

export const GET_CONFIGS = gql`
   query getConfigs {
      configs {
         liveUrl
         liveStatusUrl
         placeholderCover
      }
   }
`

export const GET_LIVE = gql`
   query getLive {
      live @client {
         url
         statusUrl
         cover
         content {
            cover
            name
            clock
            singer
            music
            author
         }
      }
   }
`

export const GET_LIVE_CONTENT = gql`
   query getLiveContent {
      live @client {
         content {
            cover
            name
            clock
            singer
            music
            author
         }
      }
   }
`

export const GET_MENU = gql`
   query getMenu {
      menus @client {
         text
         icon
         href
      }
   }
`

export const GET_VIEWS = gql`
   query getViews {
      menus @client {
         index
         component
         href
         sub
         type
         text
         path
         param
         orderBy
      }
   }
`

export const GET_PAGE = gql`
   query getPage {
      page @client
   }
`

export const GET_PAGINATION = gql`
   query getPagination {
      pagination @client
   }
`

export const GET_ITEMS = gql`
   query getNews(
      $type: SourceEnum = NEWS
      $prog: String
      $slugNot: String
      $perPage: Int = 4
      $skip: Int = 0
      $orderBy: ItemOrderByInput = publishedAt_ASC
   ) {
      itemsConnection(
         where: { source: { slug: $prog, type: $type }, slug_not: $slugNot }
         first: $perPage
         skip: $skip
         orderBy: $orderBy
      ) {
         edges {
            node {
               id
               title
               description
               createdAt
               slug
               source {
                  cover
                  slug
                  type
               }
            }
         }
         aggregate {
            count
         }
      }
   }
`

export const GET_ITEM = gql`
   query getNew($slug: String!) {
      item(where: { slug: $slug }) {
         id
         guid
         title
         description
         download
         source {
            cover
         }
      }
   }
`

export const GET_SOURCES = gql`
   query getProgramas(
      $type: SourceEnum = PODCAST
      $perPage: Int = 4
      $skip: Int = 0
      $orderBy: SourceOrderByInput = createdAt_ASC
   ) {
      sourcesConnection(
         where: { type: $type }
         first: $perPage
         skip: $skip
         orderBy: $orderBy
      ) {
         edges {
            node {
               title
               cover
               slug
            }
         }
         aggregate {
            count
         }
      }
   }
`
