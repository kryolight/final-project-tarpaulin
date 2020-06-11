const router = require('express').Router();
const multer = require('multer');

const { generateAuthToken, requireAuthentication, checkAuthentication } = require('../lib/auth');

const { validateAgainstSchema } = require('../lib/validation');

const {
    getCourseById,
    validateAssignInstructorCombo,
    getCoursesPage
} = require('../models/course');


router.get('/', async (req, res) => {

    const {subject, number, term} = req.query;
    let query = {};
    if(subject) {query.subject = subject;}
    if(number) {query.number = number;}
    if(term) {query.term = term;}
    console.log("==query: ", query);
    
    try {
      /*
       * Fetch page info, generate HATEOAS links for surrounding pages and then
       * send response.
       */
      const coursesPage = await getCoursesPage(parseInt(req.query.page) || 1, query);
      coursesPage.links = {};
      if (coursesPage.page < coursesPage.totalPages) {
        coursesPage.links.nextPage = `/courses?page=${coursesPage.page + 1}`;
        coursesPage.links.lastPage = `/courses?page=${coursesPage.totalPages}`;
      }
      if (coursesPage.page > 1) {
        coursesPage.links.prevPage = `/courses?page=${coursesPage.page - 1}`;
        coursesPage.links.firstPage = '/courses?page=1';
      }
      res.status(200).send(coursesPage);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error fetching courses list.  Please try again later."
      });
    }
  });

  module.exports = router;