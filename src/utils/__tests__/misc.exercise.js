import {formatDate} from 'utils/misc'

test('formatDate formats the date to look nice', () => {
  expect(formatDate(new Date('March 28, 2023'))).toBe('Mar 23')
})
