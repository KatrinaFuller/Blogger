import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
  blogId: { type: ObjectId, ref: 'blog', required: true },
  body: { type: String, required: true },
  author: {
    _id: { type: ObjectId, ref: 'User', required: true },
    // _id: { type: String, required: true },
    name: { type: String, required: true }
  },
  // img: { type: String, required: true },
  // summary: { type: String, required: true },
  // title: { type: String, required: true }
}, { timestamps: true })

export default class CommentService {
  get repository() {
    return mongoose.model('comment', _model)
  }
}