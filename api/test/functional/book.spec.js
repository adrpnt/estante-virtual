'use strict'

const { test, trait, before } = use('Test/Suite')('Book')

const Factory = use('Factory')

const Book = use('App/Models/Book')

trait('Auth/Client')
trait('DatabaseTransactions')
trait('Test/ApiClient')

trait(suite => {
  suite.Context.getter('user', () => ({
    id: 1,
    name: 'Test User',
    email: 'testuser@gmail.com'
  }))
})

before(async () => {
  await Factory.model('App/Models/User').create({
    name: 'Test User',
    email: 'testuser@gmail.com',
    password: '123456'
  })

  await Book.create({
    title: 'O Hobbit',
    author: 'J. R. R. Tolkien',
    user_id: 1
  })
})

test('it should get a list with all books', async ({ client, user }) => {
  const response = await client
    .get('/books')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    {
      title: 'O Hobbit',
      author: 'J. R. R. Tolkien'
    }
  ])
})

test('it should create a book', async ({ assert, client, user }) => {
  const data = { title: 'O Silmarillion', author: 'J. R. R. Tolkien' }
  const response = await client
    .post('/books')
    .send(data)
    .loginVia(user, 'jwt')
    .end()

  const books = await Book.all()
  const booksCount = books.toJSON().length

  response.assertStatus(200)
  response.assertJSONSubset(data)

  assert.equal(booksCount, 2)
})

test('it should get a specific book', async ({ client, user }) => {
  const book = await Book.find(1)
  const response = await client
    .get(`/books/${book.id}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset(book.toJSON())
})

test('it should update a book', async ({ client, user }) => {
  const book = await Book.find(1)
  const data = { number_pages: '297' }
  const response = await client
    .put(`/books/${book.id}`)
    .send(data)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset(data)
})

test('it should delete a book', async ({ assert, client, user }) => {
  const book = await Book.find(1)
  const response = await client
    .delete(`/books/${book.id}`)
    .loginVia(user, 'jwt')
    .end()

  const books = await Book.all()
  const booksCount = books.toJSON().length

  response.assertStatus(200)
  response.assertJSON({
    message: 'Book deleted.'
  })

  assert.equal(booksCount, 0)
})
