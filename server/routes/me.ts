const debug = require('debug')('checkpoints:meRoute');

import { Router, Request, Response } from 'express';

import common from './common';
import friends from './friends';
import search from './search';

const api = Router();

api.all('*', (req: Request & CheckpointsServer.Request, res: Response, next) => {
  req.customParams.user = req.user;
  debug(req.user);
  next();
});

api.get('/info', (req: CheckpointsServer.Request, res: Response) => {
  const user = _.pick(req.customParams.user, '_id', 'name', 'picture');
  res.json(user);
});

api.use('/', common);
api.use('/friends', friends);
api.use('/search', search);

export default api;
