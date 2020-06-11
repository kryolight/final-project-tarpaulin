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
    insertNewAssignment
} = require('../models/assignment');




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
  const assignId =  req.params.id;

  try{
    const assignment = getAssignmentById(assignId);
    if(assignment){
      try {
              //try delete, using id as a check
      } catch (err){
              //unauthorized
      }

    } else {
      //invalid assignment id
    }
    
    
  } catch (err) {
      //error searching for assignment
  }

});


module.exports = router;