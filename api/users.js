const router = require('express').Router();

const { generateAuthToken, requireAuthentication, checkAuthentication } = require('../lib/auth');
const { validateAgainstSchema } = require('../lib/validation');
const {
  UserSchema,
  insertNewUser,
  getUserById,
  getUserPrvileges,
  validateUser,
  getCoursesByInstructorId,
  getEnrolledCoursesByStudentId
} = require('../models/users');

/*
 * Route to create new user
 */
router.post('/', checkAuthentication, async (req,res) => {
  if (validateAgainstSchema(req.body, UserSchema)) {
    // check if a user is an admin, and saitize the input for role
    if (req.role === 'admin') {
      // if user is an admin, they can create any type of user
      if (req.body.role === 'admin') {
        req.body.role = 'admin';
      } else if (req.body.role === 'instructor') {
        req.body.role = 'instructor';
      } else {
        req.body.role = 'student';
      }
    } else {
      // if user is not an admin, they can only create students
      if (req.body.role === 'admin' || req.body.role === 'instructor') {
        res.status(403).send({
          error: "User lacks authorization to create instructor or admin accounts."
        });
      } else {
        req.body.role = 'student';
      }
    }

    try {
      const id = await insertNewUser(req.body);
      res.status(201).send({
        id: id
      });
    } catch (err) {
      console.error(" -- Error:", err);
      res.status(500).send({
        error: "Error inserting new user. Try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body does not contain a valid user."
    });
  }
});

/*
 * Route to log in as user
 */
router.post('/login', async (req, res) => {
  if (req.body && req.body.email && req.body.password) {
    try {
      const authenticated = await validateUser(
        req.body.email,
        req.body.password
      );
      if (authenticated) {
        const user = await getUserPriveleges(req.body.email);
        const token = generateAuthToken(user._id, user.role);
        res.status(200).send({
          token: token
        });
      } else {
        res.status(401).send({
          error: "Invalid authentication credentials."
        });
      }
    } catch (err) {
      console.error("  -- error:", err);
      res.status(500).send({
        error: "Error logging in. Try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body needs a user email and password."
    });
  }
});

/*
 * Route to get user details
 */
router.get('/:id', requireAuthentication, async (req, res, next) => {
  if (req.userId === req.params.id) {
    try {
      const user = await getUserById(req.params.id, false);
      if (user) {
        if (user.role === 'instructor') {
          user.courses = await getCoursesByInstructorId(user._id);
        } else if (user.role === 'student') {
          user.courses = await getEnrolledCoursesByStudentId(user._id);
        }
        res.status(200).send(user);
      } else {
        next();
      }
    } catch (err) {
      console.error("  -- Error:", err);
      res.status(500).send({
        error: "Error fetching user. Try again later."
      });
    }
  } else {
    // userid is not the same as id
    res.status(403).send({
      error: "Unauthorized to access the specified resource."
    });
  }
});
