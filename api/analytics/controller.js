'use strict';


const Visit = require('../visit/model');
const moment = require('moment');

/**
 * GET /api/analytics/dashboard/visits/:location/:timeFrame
 * Query 1
 * Today I am doing this one by one. I want to combine into one query with result format similar to
 * {
 * today:0
 * yesterday:1
 * thismonth:28
 * thisyear:128
 * last1d:1
 * last7d:18
 * last30d:28
 * last365d:128
 * }
 * For example
 * http://localhost:3000/api/analytics/dashboard/visits/5a0c6b3d182a1e37bcc3114a/today
 * http://localhost:3000/api/analytics/dashboard/visits/5a0c6b3d182a1e37bcc3114a/yesterday
 * http://localhost:3000/api/analytics/dashboard/visits/5a0c6b3d182a1e37bcc3114a/thismonth
 * http://localhost:3000/api/analytics/dashboard/visits/5a0c6b3d182a1e37bcc3114a/thisyear
 * http://localhost:3000/api/analytics/dashboard/visits/5a0c6b3d182a1e37bcc3114a/last1d
 * http://localhost:3000/api/analytics/dashboard/visits/5a0c6b3d182a1e37bcc3114a/last7d
 * http://localhost:3000/api/analytics/dashboard/visits/5a0c6b3d182a1e37bcc3114a/last30d
 * http://localhost:3000/api/analytics/dashboard/visits/5a0c6b3d182a1e37bcc3114a/last365d
 */

exports.getVisitSummaries = (req, res, next) => {

  req.checkParams('timeFrame', 'Invalid urlparam').notEmpty().enum(['today', 'yesterday', 'thismonth', 'thisyear', 'last1d', 'last7d', 'last30d', 'last365d']);
  req.checkParams('location', 'Invalid urlparam').notEmpty();
  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      res.status(400).send('Invalid URL');
      return;
    }

    console.log("Getting Visit Summaries for :" + '5a0c6b3c182a1e37bcc31148' + " for location: " + req.params.location + " for timeframe: " + req.params.timeFrame);

    let dateFrom, dateTo = 0;

    switch (req.params.timeFrame) {
      case 'today':
        dateFrom = moment().startOf('day').format();
        dateTo = moment().endOf('day').format();
        break;
      case 'yesterday':
        dateFrom = moment().subtract(1, 'days').startOf('day').format();
        dateTo = moment().subtract(1, 'days').endOf('day').format();
        break;
      case 'thismonth':
        dateFrom = moment().startOf('month').format();
        dateTo = moment().endOf('month').format();
        break;
      case 'thisyear':
        dateFrom = moment().startOf('year').format();
        dateTo = moment().endOf('year').format();
        break;
      case 'last1d':
        dateFrom = moment().subtract(24, 'hours').format();
        dateTo = moment().format();
        break;
      case 'last7d':
        dateFrom = moment().subtract(7, 'days').format();
        dateTo = moment().format();
        break;
      case 'last30d':
        dateFrom = moment().subtract(30, 'days').format();
        dateTo = moment().format();
        break;
      case 'last365d':
        dateFrom = moment().subtract(365, 'days').format();
        dateTo = moment().format();
    }

    console.log("For location: " + req.params.location + " For Request Parameter: " + req.params.timeFrame + " COUNT visits from: " + dateFrom + " to: " + dateTo + "is: ");

    let query = null;

    //If location selector set to All
    if (req.params.location === "*") {
      query = Visit.where({ account: '5a0c6b3c182a1e37bcc31148', 'details.dateTimeIn': { $gte: dateFrom, $lte: dateTo } });
    }
    else {
      query = Visit.where({ account: '5a0c6b3c182a1e37bcc31148', location: req.params.location, "details.dateTimeIn": { $gte: dateFrom, $lte: dateTo } });
    }

    query.count(function (error, visit) {
      if (error) {
        res.status(500).json(error);
      }
      else {
        res.status(200).json(visit);
      }
    });
  });
};




/**
 * Query 2
* GET /api/analytics/top/hosts/:location/:dateFrom/:dateTo
* COUNT by host DESCENDING
* Filter by accountId (5a0c6b3c182a1e37bcc31148), location (5a0c6b3d182a1e37bcc3114a), :dateFrom and :dateTo
*/


exports.getTopHosts = (req, res, next) => {

  Visit.aggregate([




  ], function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).json(result);
  });
};

/**
 * Query 3
* GET /api/analytics/top/hosts/:location/:dateFrom/:dateTo
* COUNT by firstName and LastName DESCENDING
* Filter by accountId (5a0c6b3c182a1e37bcc31148), location (5a0c6b3d182a1e37bcc3114a), :dateFrom and :dateTo
*/


exports.getTopVisitors = (req, res, next) => {
  
    Visit.aggregate([
  
  
  
  
    ], function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.status(200).json(result);
    });
  };

/**
* Query 4. This is partially implemented the problem here is I must get all the days in the range even if count is 0 so I can show it on chartjs
* GET /api/analytics/charts/visits/:location/:dateFrom/:dateTo/:interval
* Get Visit Chart Data
* isoDayOfWeek https://docs.mongodb.com/manual/reference/operator/aggregation/isoDayOfWeek/
* Example http://localhost:3000/api/analytics/chart/visits/5a0c6b3d182a1e37bcc3114a/1503471440775/1511247440777/daily
* Example http://localhost:3000/api/analytics/chart/visits/5a0c6b3d182a1e37bcc3114a/1503471440775/1511247440777/isoDayOfWeek
* Example http://localhost:3000/api/analytics/chart/visits/5a0c6b3d182a1e37bcc3114a/1503471440775/1511247440777/dayOfYear
* Example http://localhost:3000/api/analytics/chart/visits/5a0c6b3d182a1e37bcc3114a/1503471440775/1511247440777/week
*
*/

exports.getVisitsHistorgram = (req, res, next) => {

  req.checkParams('dateFrom', 'Invalid urlparam').notEmpty().isInt();
  req.checkParams('dateTo', 'Invalid urlparam').notEmpty().isInt();
  req.checkParams('interval', 'Invalid urlparam').notEmpty().enum(['daily', 'isoDayOfWeek', 'dayOfYear', 'week']);

  console.log("Getting Visit Histogram for :" + '5a0c6b3c182a1e37bcc31148' + " for interval: " + req.params.interval);

  let interval = 0;
  let sort = 0;

  switch (req.params.interval) {
    case 'daily':
      interval = {
        year: { $year: "$details.dateTimeIn" },
        month: { $month: "$details.dateTimeIn" },
        day: { $dayOfMonth: "$details.dateTimeIn" },
      };
      sort = { "_id.year": 1, "_id.month": 1, "_id.day": 1 };
      break;
    case 'isoDayOfWeek':
      interval = {
        isoDayOfWeek: { $isoDayOfWeek: "$details.dateTimeIn" },
      };
      sort = { "_id.isoDayOfWeek": 1 };
      break;
    case 'dayOfYear':
      break;
    case 'week':
      break;
  }


  Visit.aggregate([
    {
      $match:
      { account: '5a0c6b3c182a1e37bcc31148',location: req.params.location}
    },
    {
      "$group": {
        _id: interval,
        count: { $sum: 1 }
      }
    },

    { $sort: sort }


  ], function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).json(result);
  });
};



