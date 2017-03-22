/**
 * Created by janaka on 3/22/17.
 */

module.exports = {

  attributes: {
    id: {
      type: 'objectid',
      autoIncrement: true,
      primaryKey: true
    },
    name: {
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
    website : {
      type: 'string'
    },
    contact: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    video: {
      model: 'video'
    }
  }
};
