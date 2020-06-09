const router = require('express').Router();
const { requireAuthentication } = require('../lib/auth');
const { validateAgainstSchema } = require('../lib/validation');
const { checkValidId } = require('../lib/mongo');
const stringify = require('csv-stringify');
const {
    getStudents,
    updateEnrollment,
    getAssignments,
    getRoster
} = require('../models/course');


router.get('/:id/students', [requireAuthentication, checkValidId("params", "id")], async (req, res) => {
    const result = await getStudents(req.params.id, req.userId, res.role);
    
    if (result.error) {
        res.status(result.status).send({
            error: result.error
        });
    } else {
        res.status(result.status).send({
            students: result.students
        });
    }
});

router.post('/:id/students', [requireAuthentication, checkValidId("params", "id")], async (req, res) => {
    const delta = {
        add: req.body.add || [],
        remove: req.body.remove || []
    };

    if (delta.add || delta.remove) {
        const result = await updateEnrollment(req.params.id, req.userId, res.role, delta);
        
        if (result.error) {
            res.status(result.status).send({
                error: result.error
            });
        } else {
            res.status(200).send({});
        }

    } else {
        res.status(400).send({
            error: "Body requires lists of students to add and/or remove"
        });
    }
});

router.get('/:id/roster', [requireAuthentication, checkValidId("params", "id")], async (req, res) => {
    const result = await getRoster(req.params.id, req.userId, req.role);

    if (result.error) {
        res.status(result.status).send({
            error: result.error
        });
    } else {
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Pragma', 'no-cache');

        stringify(
            result.roster, 
            { header: false }
        )
        .pipe(res);
    }
});

router.get('/:id/assignments', checkValidId("params", "id"), async (req, res) => {
    const result = await getAssignments(req.params.id);
    
    if (result.error) {
        res.status(result.status).send({
            error: result.error
        });
    } else {
        res.status(200).send({
            assignments: result.assignments
        });
    }
});

module.exports = router;