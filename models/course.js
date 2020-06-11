const { ObjectId, GridFSBucket } = require('mongodb');
const fs = require('fs');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');



const courseSchema = {
    subject: {required:true},
    number: {required: true},
    title: {required: true},
    term: {required: true},
    instructorId: {required: true}
  };
exports.courseSchema = courseSchema;



async function getCourseById(id){
    const db = getDBReference();
    const collection = db.collection('courses');
    const course =  await collection.find({
        _id: new ObjectId(id)
    }).toArray();

    return course[0];
}
exports.getCourseById = getCourseById;




async function validateAssignInstructorCombo(assignmentCourseId, userId) {
    const course = await exports.getCourseById(assignmentCourseId);
    return (course.instructorId == userId);
}
exports.validateAssignInstructorCombo = validateAssignInstructorCombo;