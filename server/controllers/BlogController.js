import express from 'express'
import ValueService from '../services/ValueService';
import { Authorize } from '../middleware/authorize.js'
import BlogService from '../services/BlogService';
import CommentService from '../services/CommentService';
import UserService from '../services/UserService';

let _blogService = new BlogService().repository
let _commentService = new CommentService().repository
let _UserService = new UserService().repository

export default class BlogController {
  constructor() {
    this.router = express.Router()
      .get('', this.getAll)
      .get('/:id', this.getById)
      .get('/:id/comments', this.getBlogComments)
      .use(Authorize.authenticated)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.delete)
  }

  async getAll(req, res, next) {
    try {
      let data = await _blogService.find({ authorId: req.session.uid })
        .populate('authorId', 'name')
      return res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      let data = await _blogService.findOne({ _id: req.params.id, authorId: req.session.uid })
      if (!data) {
        throw new Error("Invalid Id")
      }
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async getBlogComments(req, res, next) {
    try {
      let data = await _commentService.find({ blogId: req.params.id })
        .populate('authorId', 'name')
        .populate('blogId', 'name')
      return res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      req.body.authorId = req.session.uid
      let user = await _UserService.findById(req.session.uid)
      req.body.author = {
        _id: req.session.uid,
        name: user.get('name')
      }

      let data = await _blogService.create(req.body)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      let data = await _blogService.findOneAndUpdate({ _id: req.params.id, authorId: req.session.uid }, req.body, { new: true })
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
      let data = await _blogService.findOneAndRemove({ _id: req.params.id, authorId: req.session.uid })
      if (!data) {
        throw new Error("invalid id")
      }
      res.send("Deleted Blog")
    } catch (error) {
      next(error)
    }
  }

}