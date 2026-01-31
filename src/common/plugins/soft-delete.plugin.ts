// src/common/plugins/soft-delete.plugin.ts
import mongoose from 'mongoose';

export type TWithSoftDeleted = {
  isDeleted: boolean;
  deletedAt: Date | null;
}

type TDocument = TWithSoftDeleted & mongoose.Document;

const softDeletePlugin = (schema: mongoose.Schema) => {
  schema.add({
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
  });

  const typesFindQueryMiddleware = [
    'count',
    'countDocuments',
    'find',
    'findOne',
    'findOneAndUpdate',
    'update',
    'updateOne',
    'updateMany',
  ];

  // BỎ 'async' VÀ 'next'. Mongoose sẽ tự hiểu đây là middleware đồng bộ.
  const excludeInFindQueriesIsDeleted = function (
    this: mongoose.Query<TDocument, TDocument>
  ) {
    this.where({ isDeleted: false });
  };

  const excludeInDeletedInAggregateMiddleware = function (
    this: mongoose.Aggregate<any>
  ) {
    this.pipeline().unshift({ $match: { isDeleted: false } });
  };

  // Đăng ký middleware
  typesFindQueryMiddleware.forEach((type) => {
    schema.pre(type as any, excludeInFindQueriesIsDeleted);
  });

  schema.pre('aggregate', excludeInDeletedInAggregateMiddleware);
};

export { softDeletePlugin };