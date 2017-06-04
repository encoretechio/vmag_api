/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcrypt');
var helper = require('../../lib/helper.js');
const ObjectId = require('sails-mongo/node_modules/mongodb').ObjectID;
// const ERRORS = require('../responses/custom_errors')

module.exports = {
  // createUser - create a user
  createUser: function (request, response) {
    var user = request.body;
    User.create(user).exec(function (error, user) {
      if (error) {
        return response.serverError(error);
      }

      sails.log('user\'s id is:', user.id);
      return response.json(user);
    });
  },

  // deleteUser - delete a user
  deleteUser: function (request, response) {
    User.destroy({
      id: request.param('user_id')
    }).exec(function (error) {
      if (error) {
        return response.negotiate(error);
      }
      sails.log('user with the given id was deleted');
      return response.ok();
    });
  },

  //getUsers - Send all users but not all details : Name, ID, Phone, email, designation
  getUsers: function (request, response) {
    User.find().exec(function (error, users) {
      if (error) {
        // handle error here- e.g. `res.serverError(err);`
        return;
      }
      for (user of users) {
        user.name = user.firstName + ' ' + user.lastName;
      }
      response.json(users);
    });
  },


  // getUser - send limited details od a user
  getUser: function (request, response) {

    UserService.getSingleUser({
      user_id: request.param('user_id')
    }, function getSingleUserCallback(error, user) {
      if (!error) {
        response.json(user);
      }
    });
  },

  getCurrentUser: function (request, response) {
    var userId = request.token;
      console.log("tokenID  "+ userId);
    User.findOne(userId).exec(function (error, user) {
      if (error) return error;
        console.log("user found");
      response.json(user);
    });
  },

  // getUserProfile - send playlists, videos details of the requested user_id for admin,
  // send currentuser profile for normal users if requested with currentuser_id
  getuserProfile: function (request, response) {
    var userId = request.token;
    var requested_profile_id = request.params.user_id;
    console.log("Returning User Profile All");
    UserService.getSingleUserDetailed({
      user_id: userId,
      profile_id: requested_profile_id
    }, function getSingleUserDetailedCallback(error, profile) {
      if (!error) {
        console.log("end" + profile);
        response.json(profile);
      } else {
        console.log("end" + error);
        // send the error msg with 401 status
        return response.json(401, {
          err: {
            status: 'danger',
            message: response.i18n(error)
          }
        });
      }
    });
  },


  // changePassword - POST old password and new password with UserID
  changePassword: function (request, response) {

    User.findOne(request.param('user_id')).exec(function (error, user) {
      if (error) {
        response.json(500, {err: error});
      }

      // validate user
      if (!user) {
        return response.json(401, {
          err: {
            status: 'warn',
            message: response.i18n('Invalid user id')
          }
        });
      }

      // validate old password
      user.isPasswordValid(request.body.oldPassword, function (error, bool) {
        if (error) return response.serverError(error);
        if (bool) {
          // old password is correct
          // Encrypt password before saving to database
          bcrypt.genSalt(10, function (error, salt) {
            bcrypt.hash(request.body.newPassword, salt, function (err, hash) {
              if (error) {
                return response.json(500, {err: error});
              }

              // adding hashed newpassword to the data object
              user.password = hash;

              // update user
              user.save(function (error) {
                if (error) {
                  return response.negotiate(error);
                }
                console.log('password changed of user: ' + user.username);
                return response.json(200, {message: 'Password changed successfully!'});
              });

            });
          });
        } else {
          return response.json(401, {
            err: {
              status: 'danger',
              message: response.i18n('Old password incorrect')
            }
          });
        }
      });
    });

  },


  // editUser - POST update details with UserID
  editUser: function (request, response) {
    // TODO: make password unupdateable from this route
    var data = request.body;
    User.update(request.params.user_id, data, function (error, updated) {
      if (error) {
        // handle error here- e.g. `res.serverError(err);`
        return error;
      }

      console.log('Updated user to have name ' + updated[0].name);
      response.json(updated);
    });
  },

  // updateVideo - update watched times of user's videos
  updateVideo: function (request, response) {
    // TODO: validate video id - get a list of video ids using a route and call using a sync method
    // object to keep info sent in request
    var watchedVideos = {};
    User.findOne(request.params.user_id).exec(function (error, user) {
      if (error) {
        // handle error here- e.g. `res.serverError(err);`
        return error;
      }
      watchedVideos = request.body;
      console.log(watchedVideos);
      // create an enpty object if user.watchedVideos is null
      if (user.watchedVideos == null) {
        user.watchedVideos = {};
      }
      for (id in watchedVideos) {
        user.watchedVideos[id] = watchedVideos[id];
      }
      user.save(function (error) {
        if (error) {
          return response.negotiate(error);
        }
        sails.log('videos updated');
        response.json(user.watchedVideos);
      });
    });
  },

  addWatchedVideos: function (request, response) {
    var userId = request.params.user_id;
    if (request.body.constructor !== Array)
      return response.badRequest("Request Body should be an array object");

    User.findOne(userId).exec(function (error, user) {
      if (error) return error;
      const newList = request.body;
      const oldList = user.watchedVideos ? user.watchedVideos : [];
      const totalList = Array.from(new Set(oldList.concat(newList)));
      User.native((err, collection) =>{
        collection.update({_id: new ObjectId(userId)}, {$set:{watchedVideos:totalList}});
        response.json(user.watchedVideos);
      });
    });
  },

  addFavoriteVideos: function (request, response) {
    var userId = request.params.user_id;
    var videoId;

    if (request.body.constructor !== Array)
      return response.badRequest("Request Body should be an array object");

    User.findOne(userId).exec(function (error, user) {
      if (error) return error;
      const newList = request.body;
      videoId =  newList[0];
        console.log("videoID : " + videoId);
        const oldList = user.favoriteVideos ? user.favoriteVideos : [];
      const totalList = Array.from(new Set(oldList.concat(newList)));

      User.native((err, collection) =>{
        collection.update({_id: new ObjectId(userId)}, {$set:{favoriteVideos:totalList}});

      });

      Video.findOne(videoId).exec(function (error, video){
          if (error) return error;


          const oldVidList = video.favorites ? video.favorites : [];
          const totalVidList = Array.from(new Set(oldVidList.concat(userId)));

          Video.native((err, collection) =>{
              collection.update({_id: new ObjectId(videoId)}, {$set:{favorites:totalVidList}});

          });

          Video.findOne(videoId).exec(function (error, video) {
              if (error) return error;
              video.isFavourite = true;
              response.json(video);

          })

          //response.json(video);
      });

    });
  },

  removeFavoriteVideos: function (request, response) {
    var userId = request.params.user_id;
    const newList = request.body;
    const unlikeVideoId = newList[0];

    if (request.body.constructor !== Array)
      return response.badRequest("Request Body should be an array object");

    User.findOne(userId).exec(function (error, user) {
      if (error) return error;

      const oldList = user.favoriteVideos ? user.favoriteVideos : [];
      var index = oldList.indexOf(unlikeVideoId);

      if (index != null) {
        oldList.splice(index, 1);
      }

      User.native((err, collection) =>{
        collection.update({_id: new ObjectId(userId)}, {$set:{favoriteVideos:oldList}});
        //response.json(oldList);
      });

      Video.findOne(newList[0]).exec(function (error, video){
          if (error) return error;
          //video.isFavourite = false;

          const oldVidList = video.favorites ? video.favorites : [];
          var index = oldList.indexOf(userId);

          if (index != null) {
              oldVidList.splice(index, 1);
          }

          Video.native((err, collection) =>{
              collection.update({_id: new ObjectId(unlikeVideoId)}, {$set:{favorites:oldVidList}});
              //response.json(oldList);
          });


          Video.findOne(unlikeVideoId).exec(function (error, video) {
              if (error) return error;
              video.isFavourite = false;
              response.json(video);

          })

      });

    });
  }


};
