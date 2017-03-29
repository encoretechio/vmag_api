/**
 * Video.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: 'objectid',
      autoIncrement: true,
      primaryKey: true,
      // required: true
    },


    title: {
      type: 'string',
      size: 128,
      required: true
    },

    src: {
      type: 'string',
      size: 256,
    },

    thumbnail: {
      type: 'string'
    },

    description: {
      type: 'string',
      // size: 256,
    },

    length: {
      type: 'string',
      size: 128
    },

    // many to many relationship with playlist
    playlist: {
      model: 'playlist'
    },

    // one to many relationship with comment
    comments: {
      collection: 'comment',
      via: 'video'
    },

    watchedUsers: {
      collection: 'user',
    },

    favoriteUsers: {
      collection: 'user',
    }
  }
};

