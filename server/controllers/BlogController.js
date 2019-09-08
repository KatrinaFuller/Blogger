import express from 'express'
import ValueService from '../services/ValueService';
import { Authorize } from '../middleware/authorize.js'
import BlogService from '../services/BlogService';
import UserService from '../services/UserService';
import CommentService from '../services/CommentService';

let _blogService = new BlogService().repository
let _userService = new UserService().repository
let _commentService = new CommentService().repository

export default class BlogController {
  constructor() {
    this.router = express.Router()
      .get('', this.getAll)
      .get('/:id', this.getById)
      .get('/:id/comments', this.getComments)
      .use(Authorize.authenticated)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.delete)
  }

  async getAll(req, res, next) {
    try {
      let data = await _blogService.find({})
        .populate('author._id', 'author.name')
      return res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      let data = await _blogService.findById(req.params.id)
      if (!data) {
        throw new Error("Invalid Id")
      }
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async getComments(req, res, next) {
    try {
      let data = await _commentService.find({ blogId: req.params.id })
        .populate('blogId', 'name')
      return res.send(data)
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

      let data = await _blogService.create(req.body)
      return res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      // Only let the user edit ones the user created
      // check that their id matches the id of the created one

      // get the userId
      let data = await _blogService.findOneAndUpdate({
        _id: req.params.id,
        'author._id': req.session.uid
      }, req.body, { new: true });
      if (data) {
        return res.send(data)
      }
      throw new Error("invalid id")
      //   let userId = req.session.uid;
      //   let blog = await _blogService.findById(req.params.id)
      //     .populate('author._id', 'id');
      //   let blogUserId = blog.get('author')._id.get('id');

      //   if (userId === blogUserId) {
      //     // the user is matched
      //     let data = await _blogService.findOneAndUpdate({ _id: req.params.id, }, req.body, { new: true })
      //     if (data) {
      //       return res.send(data)
      //     }
      //     throw new Error("Failed to save id")
      //   } else {
      //     // They do no own this blog post
      //     throw new Error("invalid id")
      //   }
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      // Only let the user delete ones the user created
      // check that their id matches the id of the created one
      let data = await _blogService.findOneAndRemove({
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