const router = require('express').Router();
const multer = require('multer');

const { generateAuthToken, requireAuthentication, checkAuthentication } = require('../lib/auth');

const { validateAgainstSchema } = require('../lib/validation');

const {
    courseSchema,
    getCourseById,
    validateAssignInstructorCombo,
    insertNewCourse,
    getCoursesPage
} = require('../models/course');


/**
 * FETCH COURSE LIST        DONE
 * Fetch list of courses using different url params
 * 
 */


router.get('/', async (req, res) => {
    //console.log("==req.query:", req.query)
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



/**
 * INSERT NEW COURSE        need to test
 */
router.post('/', requireAuthentication, async (req, res) => {
    console.log("==req.body: ",req.body);
    if(validateAgainstSchema(req.body, courseSchema ) && (req.role == 'admin')){
        try{
            const id = insertNewCourse(req.body);
            res.status(201).send({
                id: id,
                links:{
                    course: `/courses/${id}`
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).send({
                error: "Error inserting course into DB.  Please try again later."
            });
        }
    } else {
        res.status(400).send({
            error: "Invalid body for post request. Check course fields and try again."
        });
    }
});




/****************
 * GET COURSE INFO  
*********/
router.get('/:id', async (req, res, next) => {
    try {
      let course = await getCourseById(req.params.id, false);
      console.log("== Course searched: ", course);
      if (course) {
        res.status(200).send(course);
      } else {
        res.status(404).send({
            error: "Course not found, check course id and try again."
        });
      }
    } catch (err) {
      console.error("  -- Error:", err);
      res.status(500).send({
        error: "Error fetching course. Try again later."
      });
    }
  });

  module.exports = router;