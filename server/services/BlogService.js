import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
  title: { type: String, maxlength: 60, required: true },
  summary: { type: String, maxlength: 120, required: true },
  author: {
    id: { type: ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }
  },
  authorId: { type: ObjectId, ref: 'User', required: true },
  img: { type: String, required: true },
  body: { type: String, required: true }
}, { timestamps: true })

export default class BlogService {
  get repository() {
    return mongoose.model('blog', _model)
  }
}