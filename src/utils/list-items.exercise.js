import {client} from 'utils/api-client'
import {useQuery, useMutation, queryCache} from 'react-query'
import {setQueryDataForBook} from 'utils/books'

function useListItems(user) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data.listItems),
    config: {
      onSuccess: listItems => {
        setQueryDataForBook(listItems)
      },
    },
  })

  return listItems ?? []
}

function useListItem(user, bookId) {
  const listItems = useListItems(user)
  return listItems.find(item => item.bookId === bookId) ?? null
}

const defaultMutationOptions = {
  onError: (error, updates, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

function useUpdateListItem(user, options) {
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token: user.token,
      }),
    {
      onMutate: async updates => {
        await queryCache.cancelQueries('list-items')

        const previousCache = queryCache.getQueryData('list-items')

        queryCache.setQueryData('list-items', old => {
          return old.map(book =>
            book.id === updates.id ? {...book, ...updates} : book,
          )
        })

        return () => queryCache.setQueryData('list-items', previousCache)
      },
      ...defaultMutationOptions,
      ...options,
    },
  )
}
function useRemoveListItem(user, options) {
  return useMutation(
    ({id}) =>
      client(`list-items/${id}`, {
        method: 'DELETE',
        token: user.token,
      }),
    {
      onMutate: async removedItem => {
        await queryCache.cancelQueries('list-items')

        const previousCache = queryCache.getQueryData('list-items')

        queryCache.setQueryData('list-items', old => {
          return old.filter(book => book.id !== removedItem.id)
        })

        return () => queryCache.setQueryData('list-items', previousCache)
      },
      ...defaultMutationOptions,
      ...options,
    },
  )
}
function useCreateListItem(user, options) {
  return useMutation(
    ({bookId}) =>
      client('list-items', {
        data: {bookId},
        token: user.token,
      }),
    {...defaultMutationOptions, ...options},
  )
}

export {
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
