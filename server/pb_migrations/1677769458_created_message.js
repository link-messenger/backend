migrate((db) => {
  const collection = new Collection({
    "id": "1ff7q3nuiflki88",
    "created": "2023-03-02 15:04:18.243Z",
    "updated": "2023-03-02 15:04:18.243Z",
    "name": "message",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "iajalhbt",
        "name": "content",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": 1,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "listRule": "@request.auth.id!=''",
    "viewRule": "@request.auth.id!=''",
    "createRule": "@request.auth.id!=''",
    "updateRule": "@request.auth.id!=''",
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("1ff7q3nuiflki88");

  return dao.deleteCollection(collection);
})
