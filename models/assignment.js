const { ObjectId, GridFSBucket } = require('mongodb');
const fs = require('fs');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');



const assignmentSchema = {
    courseId: {required:true},
    title: { required: true },
    points: { required: true },
    due: {required: true}
  };
exports.assignmentSchema = assignmentSchema;

const submissionSchema = {
    assignmentId: {required: true},
    studentId: {required: true},
    file: { required: true},
    timestamp: {required: true}     //set timestamp in endpoint before validation

}
exports.submissionSchema = submissionSchema;



async function insertNewAssignment(assignment) {
    assignment = extractValidFields(assignment, assignmentSchema);
    const db = getDBReference();
    const collection = db.collection('assignments');
    const result = await collection.insertOne(assignment);
    return result.insertedId;
}
exports.insertNewAssignment = insertNewAssignment;



exports.getAssignmentById = async function (id) {
    const db = getDBReference();
    const collection = db.collection('assignments');
    
    const results = await collection.find({ _id: new ObjectId(id) }).toArray();
    return results[0];

};


async function deleteAssignmentById(id) {
    const db = getDBReference();
    const collection = db.collection('assignments');
    const result = await collection.deleteOne({
        _id: new ObjectId(id)
    });

    return result.deletedCount >0;
}
exports.deleteAssignmentById = deleteAssignmentById;


async function patchAssignment(assingmentId, newDetails) {
    const validatedAssignment = extractValidFields(newDetails, exports.assignmentSchema);
    const db = getDBReference();
    const collection = db.collection('assignments');
    const result = await collection.replaceOne(
        {_id: new ObjectId(assignmentId)},
        validatedAssignment
    );
    return result.matchedCount > 0;
}
exports.patchAssignment = patchAssignment;


