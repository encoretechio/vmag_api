/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    //eg: BIB001
    // TODO: check how to autogenerate - can we auto increment with 'BIB'
    id: {
      type: 'objectid',
      primaryKey: true,
    },

    username: {
      type: 'string',
      size: 128,
      required: false,
      unique: true
    },

    nickname: {
      type: 'string',
      size: 128
    },

    firstName: {
      type: 'string',
      size: 128,
      required: false
    },

    lastName: {
      type: 'string',
      size: 128,
      required: false
    },

    //address - can we have complex attributes?
    streetName: {
      type: 'string'
    },

    town: {
      type: 'string'
    },

    birthDate: {
      type: 'date'
    },

    email: {
      type: 'email',
      required: true,
      unique: true
    },

    contactNumber: {
      type: 'string'
    },

    //create a seperate table to designations - and add ability to add new designations
    designation: {
      type: 'string'
    },

    // json object to keep watched videos of a user
    // format - { video_id : time, v2 : t2, ..}
    watchedVideos: {
      collection: 'video',
    },

    favoriteVideos:{
      collection:'video',
    },

    company:{
      model:'company'
    },

    // this can be used to associate a one to many relation with a contacts table
    // contacts: {
    //   collection: 'Contact',
    //   via: 'person'
    // }

    password: {
      type: 'string',
      required: true,
    },

    active: {
      type: 'boolean',
      defaultsTo: true
    },

    isPasswordValid: function (password, cb) {
      bcrypt.compare(password, this.password, cb);
    }
  }
};
