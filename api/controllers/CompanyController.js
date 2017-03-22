/**
 * Company
 *
 */

module.exports = {
  // createVideo - create a video
  //  can create with associations - add playlists while creating
  create: function (request, response) {
    var company = request.body;
    Company.create(company).exec(function (error, company) {
      if (error) {
        return response.serverError(error);
      }

      sails.log('Issue\'s id is:', company.id);
      return response.json(company);
    });
  },
  getUsersCompany: function (request, response) {
    Company.find()
      .populate('video')
      .exec(function (error,company) {
        if (error) {
          return response.serverError(error);
        }
        console.log(error);
        console.log(company)
        return response.json(company[0]);
      });
  }
}
