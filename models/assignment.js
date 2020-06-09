const { ObjectId, GridFSBucket } = require('mongodb');
const fs = require('fs');

const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');


const assignmentSchema = {
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