import { useMutation, useQuery, useSubscription } from '@apollo/client'
import { addMessageMutation, messageAddedSubscription, messagesQuery } from './queries'

export function useAddMessage() {
  const [mutate] = useMutation(addMessageMutation)

  const addMessage = async text => {
    const {
      data: { message },
    } = await mutate({
      variables: { text },
      // update: (cache, { data }) => {
      //   console.log('[useAddMessage] data:', data)
      //   const newMessage = data.message
      //   // updating cache and adding data to the cached messages
      //   cache.updateQuery({ query: messagesQuery }, oldData => {
      //     return {
      //       messages: [...oldData.messages, newMessage],
      //     }
      //   })
      // },
    })
    return message
  }

  return { addMessage }
}

export function useMessages() {
  const { data } = useQuery(messagesQuery)
  useSubscription(messageAddedSubscription, {
    onData: ({ client, data }) => {
      const newMessage = data.data.message
      client.cache.updateQuery({ query: messagesQuery }, ({ messages }) => {
        return { messages: [...messages, newMessage] }
      })
    },
  })
  return {
    messages: data?.messages ?? [],
  }
}
