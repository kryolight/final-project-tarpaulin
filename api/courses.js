const router = require('express').Router();
const multer = require('multer');

const { generateAuthToken, requireAuthentication, checkAuthentication } = require('../lib/auth');

const { validateAgainstSchema } = require('../lib/validation');

const {
    courseSchema,
    getCourseById,
    validateAssignInstructorCombo,
    deleteCourseById,
    patchCourse,
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
 * GET COURSE INFO   DONE
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



/****************
 * PATCH COURSE INFO   need to test
*********/
router.patch('/:id', requireAuthentication, async (req, res) => {
    console.log("==req.body: ",req.body);
    if(validateAgainstSchema(req.body, courseSchema )){
        try{
            const course = await getCourseById(req.params.id)//check if instructor id matches course instructorId
            console.log("== Course being patched: ", course);
            if (course){
                if(req.userId == course.instructorId){
                    try{
                        const patchSuccess = patchCourse(req.params.id, req.body);
                        if (patchSuccess){
                            res.status(200).send({
                              updatedInfo: req.body,
                              links:{
                                  course: `/courses/${id}`
                              }
                            });
                          } else {
                            next();
                          }
                    } catch (err){
                        res.status(500).send({
                            error: "Error patching course. Try again later."
                        });
                    }
                } else {
                    res.status(403).send({
                        error: "The request was not made by an authenticated User satisfying the authorization criteria."
                    });
                }
            }else{
                res.status(404).send({
                    error: "Course of specified id not found"
                });
            }
        
        }catch (err){
            console.error("  -- Error:", err);
            res.status(500).send({
                error: "Error fetching course. Try again later."
            });
        }
    } else {
        res.status(400).send({
            error: "The request body was either not present or did not contain any fields related to Course objects."
        });
    }
});


/**
 * DELETE COURSE BY ID   need to test
 */

router.delete('/:id', requireAuthentication, async(req, res, next) =>{
    if(req.role == 'admin'){
        try{
            const course = await getCourseById(req.params.id);
            if(course){
                try{    
                    const deleteSuccess = await deleteCourseById(req.params.id);
                    if(deleteSuccess){
                        res.status(204).end();
                    } else { 
                        next(); 
                    }
                }catch(err){
                    res.status(500).send({
                        error: "Error deleting course. Try again later."
                    });
                }
            } else {
                res.status(404).send({
                    error: "Course with specified id not found"
                });
            }
        } catch(err){
            res.status(500).send({
                error: "Error finding course. Try again later."
            });
        }
    } else {
        res.status(403).send({
            error: "Delete course request was made by an unauthorized user."
        });
    }
});


module.exports = router;