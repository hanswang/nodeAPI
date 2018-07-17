'use strict';

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const articleSchema = mongoose.Schema({
    id: { type: Number, index: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    body: { type: String, required: true },
    tags: [String],
});

articleSchema.index({ tags: 1, date: 1 });

mongoose.connection.on('connected', () => {
    autoIncrement.initialize(mongoose.connection);
    articleSchema.plugin(autoIncrement.plugin, { model: 'Article', field: 'id' });
});

module.exports = mongoose.model('Article', articleSchema);