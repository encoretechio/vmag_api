/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
    Issue.find()
      .populate('playlists')
      .populate('cover_video')
      .then(function (issues) {
        const finalIssue = issues[0];
        const finalIssueOut = Object.assign({},finalIssue);
        const playlists_new = [];
        const promises = finalIssue.playlists.map((playlist) =>
          Playlist.findOne(playlist.id).populate("videos").then((playlist) => {
            playlists_new.push(playlist)
          }));
        return Promise.all(promises).then(() => {
          console.log(playlists_new);
          finalIssueOut.playlists = playlists_new;
          return finalIssueOut;
        });
      })
      .then(function (f) {
        return response.json(f);
      });
  }
}
