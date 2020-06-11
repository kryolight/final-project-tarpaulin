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
    }).project({students: 0}).toArray();

    return course[0];
}
exports.getCourseById = getCourseById;




async function validateAssignInstructorCombo(assignmentCourseId, userId) {
    const course = await exports.getCourseById(assignmentCourseId);
    return (course.instructorId == userId);
}
exports.validateAssignInstructorCombo = validateAssignInstructorCombo;




exports.getCoursesPage = async function (page, queries) {
    const pageSize = 10;


    const db = getDBReference();
    const collection = db.collection('courses');

    const count = await collection.countDocuments();
    const lastPage = Math.ceil(count / pageSize);
    page = page > lastPage ? lastPage : page;
    page = page < 1 ? 1 : page;
    const offset = (page - 1) * pageSize;

    const results = await collection.find(queries)
        .project({students: 0})
        .sort({ _id: 1 })
        .skip(offset)
        .limit(pageSize)
        .toArray();

    return {
        courses: results,
        pageNumber: page,
        totalPages: lastPage,
        pageSize: pageSize,
        totalCount: results.length
    };
};



async function insertNewCourse(course) {
    newCourse = extractValidFields(course, courseSchema);
    const db = getDBReference();
    const collection = db.collection('courses');
    const result = await collection.insertOne(newCourse);
    return result.insertedId;
}
exports.insertNewCourse = insertNewCourse;