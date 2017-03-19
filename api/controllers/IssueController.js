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
  }
}
