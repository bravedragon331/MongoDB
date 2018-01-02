'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.my' });

const analyticsAPIController = require('./api/analytics/controller');



/**
 * Create Express server.
 */
const app = express();
app.set('trust proxy', true);

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI, { useMongoClient: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator({
  customValidators: {
    enum: (input, options) => options.includes(input)
  }
}));


/**
 * Analytics routes
 */
app.get('/api/analytics/chart/visits/:location/:dateFrom/:dateTo/:interval', analyticsAPIController.getVisitsHistorgram);
app.get('/api/analytics/dashboard/visits/:location/:timeFrame', analyticsAPIController.getVisitSummaries);
app.get('/api/analytics/top/visitors/:location/:dateFrom/:dateTo', analyticsAPIController.getTopVisitors);
app.get('/api/analytics/top/hosts/:location/:dateFrom/:dateTo', analyticsAPIController.getTopHosts);


/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Handle 404 responses
 */
app.use(function (req, res, next) {
  res.render('notfound');
  //res.status(404).send("Sorry can't find that!");
})

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;