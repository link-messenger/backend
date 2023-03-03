migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ff7q3nuiflki88")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "apzo08fz",
    "name": "user",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ff7q3nuiflki88")

  // remove
  collection.schema.removeField("apzo08fz")

  return dao.saveCollection(collection)
})
