'use strict';

const debug = require('debug')('brewBuddy:entry-controller');
const Entry = require('../model/entry-model');
const httpErrors = require('http-errors');

exports.createEntry = function(entryData){
  debug('createEntry');
  return new Promise((resolve, reject) => {
    console.log(entryData);
    new Entry(entryData).save()
    .then( entry => resolve(entry))
    .catch( err => reject(httpErrors(400, err.message)));
  });
};

exports.fetchEntry = function(entryId){
  debug('fetchEntry');
  return new Promise((resolve, reject) => {
    Entry.findOne({_id: entryId})
    .then(user => resolve(user))
    .catch(err => reject(httpErrors(404,err.message)));
  });
};

exports.fetchAllEntries = function() {
  debug('fetching all enties');
  return new Promise((resolve, reject) => {
    Entry.find({})
    .then(resolve)
    .catch(reject);
  });
};

exports.updateEntry = function(entryId, entryData){
  debug('updating entry', entryId);
  return new Promise((resolve, reject) => {
    if (Object.keys(entryData).length === 0) return reject(httpErrors(400, 'need to provide a body'));

    const entryKeys = ['date', 'aromas', 'acidity', 'body', 'finish', 'experience' ,'rating', 'username', 'methodId', 'originId', 'flavorId'];
    Object.keys(entryData).forEach((key) => {
      if (entryKeys.indexOf(key) === -1) return reject(httpErrors(400, 'key does not exist'));
    });

    Entry.findByIdAndUpdate(entryId, entryData)
    .then(() => Entry.findOne({_id: entryId}).then(resolve))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeOneEntry = function(entryId){
  debug('delete one entry');
  return new Promise((resolve, reject) => {
    Entry.remove({_id: entryId})
    .then(resolve)
    .catch(() => reject(httpErrors(404, 'origin not found')));
  });
};

exports.removeAllEntries = function(){
  return Entry.remove({});
};
//
// exports.fetchEntrySearch = function(entryId){
//   debug('fetching entry by request');
//   return new Promise((resolve, reject) => {
//     Entry.find({_id: entryId}).limit(10)
//    .then( entry => resolve(entry))
//    .catch(() => reject(httpErrors(404, 'Search not Found')));
//   });
// };
