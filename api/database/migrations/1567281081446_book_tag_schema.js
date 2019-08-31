'use strict'

const Schema = use('Schema')

class BookTagSchema extends Schema {
  up () {
    this.create('book_tag', table => {
      table.increments()
      table
        .integer('book_id')
        .unsigned()
        .references('id')
        .inTable('books')
      table
        .integer('tag_id')
        .unsigned()
        .references('id')
        .inTable('tags')
      table.timestamps()
    })
  }

  down () {
    this.drop('book_tag')
  }
}

module.exports = BookTagSchema