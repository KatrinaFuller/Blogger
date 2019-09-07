import express from 'express'
import ValueService from '../services/ValueService';
import { Authorize } from '../middleware/authorize.js'
import BlogService from '../services/BlogService';

let _blogService = new BlogService().repository

export default class BlogController {
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
      let data = await _blogService.find({})
      return res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      req.body.author._id = req.session.uid
      let data = await _blogService.create(req.body)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

}