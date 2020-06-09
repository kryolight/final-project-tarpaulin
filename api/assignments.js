const router = require('express').Router();
const multer = require('multer');
const fileTypes = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
  };


const {
    assignmentSchema
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
 * 
 */

router.post('/', async (req, res) => {
    if(validateAgainstSchema(req.body, assignmentSchema )){
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
    }
    else{
        res.status(400).send({
            error: "Invalid body for post request. Check assignment fields and try again."
          });
    }
});


module.exports = router;