
const { ObjectId } = require('mongodb');
const { getDBReference } = require('../lib/mongo');
const { asyncForEach } = require('../lib/util');

async function getCourseById(courseid) {
    const db = getDBReference();
    const collection = db.collection('courses');
    const result = collection.findOne({
        _id: new ObjectId(courseid)
    });
    return result;
}

async function removeStudents(courseId, remove) {
    const db = getDBReference();
    const collection = db.collection('courses');
    
    console.log(remove);

    await collection.updateOne(
        { _id: new ObjectId(courseId) },
        { $pullAll: { students: remove } }
    );
}

async function addStudents(courseId, add) {
    const db = getDBReference();
    const collection = db.collection('courses');

    await collection.updateOne(
        { _id: new ObjectId(courseId) },
        { $push: { students: { $each: add.map(elem => new ObjectId(elem)) } } }
    );
}

async function getAssignmentsByCourseId(courseId) {
    const db = getDBReference();
    const collection = db.collection('assignments');

    const results = await collection.find({
        courseId: new ObjectId(courseId)
    });

    return results.map(elem => elem._id.valueOf()) || [];
}

exports.getStudents = async (courseId, userId, userRole) => {
    const course = await getCourseById(courseId);

    if (course) {
        if (userRole == "admin" || course.instructorId.valueOf() == userId) {
            return {
                status: 200,
                students: course.students.map(elem => elem.valueOf())
            };
        } else {
            return {
                status: 403,
                error: "You are not authorized to access this resource"
            };
        }
    } 

    return {
        status: 404,
        error: `course ${courseId} not found`
    };
};

exports.updateEnrollment = async (courseId, userId, userRole, delta) => {
    const course = await getCourseById(courseId);

    if (course) {
        if (userRole == "admin" || course.instructorId.valueOf() == userId) {
            console.log(delta);
            await removeStudents(courseId, delta.remove);
            await addStudents(courseId, delta.add);
            
            return {
                status: 200
            };
        } else {
            return {
                status: 403,
                error: "You are not authorized to access this resource"
            };
        }
    } 

    return {
        status: 404,
        error: `course ${courseId} not found`
    };
};

exports.getRoster = async (courseId, userId, userRole) => {
    const course = await getCourseById(courseId);

    if (course) {

        if (userRole == 'admin' || userId == course.instructorId) {
            const db = getDBReference();
            const collection = db.collection('users');

            let roster = [];

            await (async () => {
                await asyncForEach(course.students, async studentId => {
                    const student = await collection.findOne({
                        _id: studentId
                    });
                    roster.push({
                        id: studentId,
                        name: student.name,
                        email: student.email
                    });
                })
            })();

            return {
                roster: roster
            };
        } else {
            return {
                status: 403,
                error: 'you are not authorized to access this resource'
            };
        }
    } else {
        return {
            status: 404,
            error: `course ${courseId} not found`
        };
    }
};

exports.getAssignments = async (courseId) => {
    const results = await getAssignmentsByCourseId(courseId);
    
    if (results) {
        return {
            status: 200,
            assignments: results
        };
    } else {
        return {
           status: 404,
           error: 'resource not found' 
        };
    }
};