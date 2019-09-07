import express from 'express'
import ValueService from '../services/ValueService';
import { Authorize } from '../middleware/authorize.js'
import CommentService from '../services/CommentService';

let _commentService = new CommentService().repository

export default class CommentController {
  constructor() {

  }
}