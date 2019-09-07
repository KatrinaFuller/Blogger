import express from 'express'
import ValueService from '../services/ValueService';
import { Authorize } from '../middleware/authorize.js'
import CommentService from '../services/CommentService';

let _commentService = new CommentService().repository

export default class CommentController {
  constructor() {
    this.router = express.Router()
      .get('', this.getAll)
      .get('/:id', this.getById)
      .use(Authorize.authenticated)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.delete)
  }

  async getAll(req, res, next) {
    try {
      let data = await _commentService.find({})
      return res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      let data = await _commentService.findOne({ _id: req.params.id, authorId: req.params.uid })
        .populate('authorId', 'name')
        .populate('blogId', 'name')
      if (!data) {
        throw new Error("Invalid Id")
      }
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      req.body.authorId = req.session.uid
      let data = await _commentService.create(req.body)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      let data = await _commentService.findOneAndUpdate({ _id: req.params.id, authorId: req.session.uid }, req.body, { new: true })
      if (data) {
        return res.send(data)
      }
      throw new Error("invalid id")
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      let data = await _commentService.findOneAndRemove({ _id: req.params.id, authorId: req.session.uid })
      if (!data) {
        throw new Error("invalid id")
      }
      res.send("Deleted Comment")
    } catch (error) {
      next(error)
    }
  }

}