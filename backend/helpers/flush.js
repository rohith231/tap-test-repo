
let flush = null;
exports.needFlush = async (userId, model, key, relatedId,app = null) => {
  flush = await app.get("models").Flush.findOne({
    where: {
      user_id: userId,
      model: model,
      key: key,
    },
  });
  return flush;
};

exports.deleteFlush = async (key,app = null) => {
  if (this.flush) {
    app.get("cache").deleteItem(key);
    this.flush.destroy();
  }
};

exports.createFlush = async (userId, model, key, relatedId,app = null) => {
  return app.get("models").Flush.findOrCreate({
    where: {
      user_id: userId,
      model: model,
      key: key,
      related_id: relatedId,
    },
  })
};

exports.createBulkFlush = async (flushObj,app = null) => {
  return app.get("models").Flush.bulkCreate(flushObj, {ignoreDuplicates: true})
};
