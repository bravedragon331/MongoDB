'use strict';

const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;

const visitSchema = new Schema({
  account: {
    type: String,
    lowercase: true,
    trim: true,
	required: true
  },
  location: {
    type: String,
    lowercase: true,
    trim: true,
	required: true
  },
  details: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    host: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: false
    },
    telephone: {
      type: String,
      required: false
    },
    company: {
      type: String,
      required: false
    },
    platenumber: {
      type: String,
      required: false
    },
    flexiblefield: {
      type: String,
      required: false
    },
    visitorbadge: {
      type: String,
      required: false
    }, 
    purpose: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: false
    },
    identitydocument: {
      type: String,
      required: false
    },
    birthday: {
      type: Date,
      required: false
    },
    emergencycontact: {
      type: String,
      required: false
    },
    mrz: {
      type: String,
      required: false
    },
    dateTimeIn: {
      type: Date,
      default: Date.now
    },
    dateTimeOut: {
      type: Date,
      default: 0
    }
  }

}, { timestamps: true, strict: false });

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;
