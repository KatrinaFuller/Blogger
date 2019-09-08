import express from 'express'
import ValueService from '../services/ValueService';
import { Authorize } from '../middleware/authorize.js'
import CommentService from '../services/CommentService';
import BlogService from '../services/BlogService';
import UserService from '../services/UserService';

let _commentService = new CommentService().repository
let _blogService = new BlogService().repository
let _userService = new UserService().repository

export default class CommentController {
  constructor() {
    this.router = express.Router()
      .get('/:id', this.getById)
      .use(Authorize.authenticated)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.delete)
  }

  async getById(req, res, next) {
    try {
      let data = await _commentService.findById(req.params.id)
      if (!data) {
        throw new Error("InvalidId")
      }
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      let user = await _userService.findById(req.session.uid);
      req.body.author = {
        _id: req.session.uid,
        name: user.get('name')
      }
      let data = await _commentService.create(req.body)
      if (data) {
        return res.send(data)
      }
      throw new Error("Failed to create comment")
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      let data = await _commentService.findOneAndUpdate({
        _id: req.params.id,
        'author._id': req.session.uid
      }, req.body, { new: true })
      if (data) {
        return res.send(data)
      }
      throw new Error("invalid Id")
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      let data = await _commentService.findByIdAndRemove({
        _id: req.params.id,
        'author._id': req.session.uid
      })
      if (!data) {
        throw new Error("invalid id")
      }
      res.send("Deleted Blog")
    } catch (error) {
      next(error)
    }
  }
}