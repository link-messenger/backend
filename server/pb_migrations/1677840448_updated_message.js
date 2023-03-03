migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ff7q3nuiflki88")

  collection.name = "messages"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ff7q3nuiflki88")

  collection.name = "message"

  return dao.saveCollection(collection)
})
