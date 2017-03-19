/**
 * Playlist.js
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
      required: true
    },

    description: {
      type: 'string'
    },

    issue:{
      model:'issue'
    },

    thumbnail:{
      type:'string'
    },

    // one to many relationship with video
    videos: {
      collection: 'video',
      via: 'playlist'
    }
  }
};

