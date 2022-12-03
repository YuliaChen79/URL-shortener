const mongoose = require('mongoose')
const Schema = mongoose.Schema
const urlSchema = new Schema({
  originURL: { type: String, required: true },
  shortURL: { type: String, required: true }
})
module.exports = mongoose.model('URL', urlSchema)