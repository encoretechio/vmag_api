/**
 * Issue.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: 'objectid',
      autoIncrement: true,
      primaryKey: true
    },


    title: {
      type: 'string',
      size: 128,
      required: true
    },

    description: {
      type: 'string'
    },

    thumbnail: {
      type: 'string'
    },

    cover_video: {
      model: 'video'
    },

    // many to many relationship with video
    playlists: {
      collection: 'playlist',
      via: 'issue'
    }
  }
};

