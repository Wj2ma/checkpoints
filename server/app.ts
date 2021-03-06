/// <reference path="./typings/global.d.ts" />

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';

import { setRoutes } from './routes/router';
import { initializeAuth } from './auth/auth';
import { job } from './jobs/scheduler';
import ErrorFactory from './handlers/error';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('web/dist'));
app.use('/static', express.static('public'));

// Cors
app.use(require('cors')());

// Authentication
initializeAuth(app);

// Routes
setRoutes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(ErrorFactory.notFound());
});

job.start();
// job();

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err: any, req, res: express.Response, next) {
//     res.status(err.status || 500);
//     res.json({
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err: any, req, res: express.Response, next) {
//   res.status(err.status || 500);
//   res.json({
//     message: err.message,
//     error: {}
//   });
// });

export default app;
