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
        {_id: new ObjectId(assingmentId)},
        validatedAssignment
    );
    return result.matchedCount > 0;
}
exports.patchAssignment = patchAssignment;



exports.saveSubmissionFile = async function (submission) {
    return new Promise((resolve, reject) => {
      const db = getDBReference();
      const bucket = new GridFSBucket(db, {
        bucketName: 'submissions'
      });
      const metadata = {
        contentType: submission.contentType,
        userId: submission.userId
      };
  
      const uploadStream = bucket.openUploadStream(
        submission.filename,
        { metadata: metadata }
      );
      fs.createReadStream(submission.path).pipe(uploadStream)
        .on('error', (err) => {
          reject(err);
        })
        .on('finish', (result) => {
          resolve(result._id);
        });
    });
  };


  exports.getSubmissionInfoById = async function (id) {
    const db = getDBReference();
    const bucket = new GridFSBucket(db, {
      bucketName: 'submissions'
    });
    // const collection = db.collection('images');
    if (!ObjectId.isValid(id)) {
      return null;
    } else {
      const results = await bucket.find({ _id: new ObjectId(id) })
        .toArray();
      return results[0];
    }
  };




exports.getSubmissionsPage = async function (page, assignmentId) {
    const pageSize = 10;

    const db = getDBReference();
    const bucket = new GridFSBucket(db, {
        bucketName: 'submissions'
      });

    const count = await bucket.countDocuments();
    const lastPage = Math.ceil(count / pageSize);
    page = page > lastPage ? lastPage : page;
    page = page < 1 ? 1 : page;
    const offset = (page - 1) * pageSize;

    const results = await bucket.find({
        assignmentId: assignmentId
    })
        .sort({ _id: 1 })
        .skip(offset)
        .limit(pageSize)
        .toArray();

    return {
        submissions: results,
        pageNumber: page,
        totalPages: lastPage,
        pageSize: pageSize,
        totalCount: results.length
    };
};


