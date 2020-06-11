const router = require('express').Router();
const multer = require('multer');

const { generateAuthToken, requireAuthentication, checkAuthentication } = require('../lib/auth');

const fileTypes = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'file/zip': 'zip'         //probably how we will require assignments to be turned in
  };

const {
  UserSchema,
  insertNewUser,
  getUserById,
  getUserPriveleges,
  validateUser,
  getCoursesByInstructorId,
  getEnrolledCoursesByStudentId
} = require('../models/users');

const {
    assignmentSchema,
    getAssignmentById,
    insertNewAssignment,
    deleteAssignmentById
} = require('../models/assignment');

const {
  getCourseById,
  validateAssignInstructorCombo
} = require('../models/course');




const { validateAgainstSchema } = require('../lib/validation');

const upload = multer({
    // dest: `${__dirname}/uploads`
    storage: multer.diskStorage({
      destination: `${__dirname}/uploads`,
      filename: (req, file, callback) => {
        
        const filename = crypto.pseudoRandomBytes(16).toString('hex');
        const extension = fileTypes[file.mimetype];
        callback(null, `${filename}.${extension}`);
      }
    }),
    fileFilter: (req, file, callback) => {
      callback(null, !!fileTypes[file.mimetype]);
    }
  });

/****************
 * CREATE NEW ASSIGNMENT
 * Allow instructor to create a new assignment
 */

router.post('/', requireAuthentication, async (req, res) => {
  console.log("==req.body: ",req.body);
    if(validateAgainstSchema(req.body, assignmentSchema ) && 
    (req.role == 'admin' || req.role == 'instructor')){
    try{
      const id = insertNewAssignment(req.body);

      res.status(201).send({
          id: id,
          links:{
              assignment: `/assignments/${id}`
          }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
          error: "Error inserting assignment into DB.  Please try again later."
      });
    }

  } else {
    res.status(400).send({
      error: "Invalid body for post request. Check assignment fields and try again."
    });
  }
});


/****************
 * GET ASSIGNMENT INFO
*********/
router.get('/:id', async (req, res, next) => {
  try {
    let assignment = await getAssignmentById(req.params.id, false);
    console.log("== Assignment searched: ", assignment);
    if (assignment) {
      res.status(200).send(assignment);
    } else {
      console.log("-- No assignment found");
      next();
    }
  } catch (err) {
    console.error("  -- Error:", err);
    res.status(500).send({
      error: "Error fetching assignment. Try again later."
    });
  }
});


router.delete('/:id', requireAuthentication, async(req, res, next) =>{
  try{
    let assignment = await getAssignmentById(req.params.id, false);
    console.log("== Assignment to be deleted: ", assignment);
    console.log("== User: ", req.userId);
    if(assignment){
      try {
        const authorizedToDelete = await validateAssignInstructorCombo(assignment.courseId, req.userId);
        if(!authorizedToDelete && !req.role == 'admin'){
          res.status(403).send({
            error: "The delete course request was not made by an authenticated User satisfying the authorization criteria."
          });
        } else {
          try {
            const deleteSuccessful = await deleteAssignmentById(req.params.id);
            if (deleteSuccessful) {
              res.status(204).end();
            } else {
              next();
            }
          } catch (err) {
            console.error(err);
            res.status(500).send({
              error: "Unable to delete assignment.  Please try again later."
            });
          }          
        }
      } catch (err){
        res.status(500).send({
          error: "Failure to validate userid of assignments courseId to logged in user, try again later."
        });
      }

    } else {
      res.status(404).send({
        error: "Assignment specified by courseId not found."
      });
    }
    
    
  } catch (err) {
    res.status(500).send({
      error: "Unable to fetch assignment.  Please try again later."
    });
  }

});


module.exports = router;