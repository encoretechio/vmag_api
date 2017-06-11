/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function isLiked (playlist,userId){
    for (video of playlist.videos){
        var isLiked = false;

        if (video.likes == undefined){
            isLiked = false;
        }

        else{
            for(i = 0; i < video.likes.length; i++) {
                if (video.likes[i]==userId){
                    isLiked = true;
                    video.isLiked = true;
                    break;
                }
            }
        }

        if (isLiked == false){
            video.isLiked = false;
        }
    }
}

function isLikedCover (video){
    //for (video of playlist.videos){
        var isLiked = false;

        if (video.likes == undefined){
            isLiked = false;
        }

        else{
            for(i = 0; i < video.likes.length; i++) {
                if (video.likes[i]==userId){
                    isLiked = true;
                    video.isLiked = true;
                    break;
                }
            }
        }

        if (isLiked == false){
            video.isLiked = false;
        }
   // }
}

function isFavourite (playlist,userId){
    for (video of playlist.videos){
        var isFavourite = false;
        console.log("fav array: "+ video.favourites);
        if (video.favourites == undefined){
            isFavourite = false;
        }
        else{
            for(i = 0; i < video.favourites.length; i++) {
                if (video.favourites[i]==userId){
                    isFavourite = true;
                    video.isFavourite = true;
                    break;
                }
            }
        }
        if (isFavourite == false){
            video.isFavourite = false;
        }

    }
}

module.exports = {
  // createVideo - create a video
  //  can create with associations - add playlists while creating
  createIssue: function (request, response) {
    var issue = request.body;
    Issue.create(issue).exec(function (error, issue) {
      if (error) {
        return response.serverError(error);
      }

      sails.log('Issue\'s id is:', issue.id);
      return response.json(issue);
    });
  },
  getFinalIssue: function (request, response) {
      var userId = request.token;
    Issue.find()
      .populate('playlists')
      .populate('cover_video')
      .then(function (issues) {
        const finalIssue = issues[0];
        //isLiked(issue.cover_video);
        const finalIssueOut = Object.assign({},finalIssue);
        const playlists_new = [];
        const promises = finalIssue.playlists.map((playlist) =>
          Playlist.findOne(playlist.id).populate("videos").then((playlist) => {

            isLiked(playlist,userId);
            isFavourite(playlist,userId);

            playlists_new.push(playlist)
          }));
        return Promise.all(promises).then(() => {
          //console.log(playlists_new);
          finalIssueOut.playlists = playlists_new;
          return finalIssueOut;
        });
      })
      .then(function (f) {
        return response.json(f);
      });
  }
}
