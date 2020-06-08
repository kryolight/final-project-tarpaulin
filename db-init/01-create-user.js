//db.auth('root', 'hunter2');
db.createUser({
    user: "tarpaulin",
    pwd: "hunter2",
    roles: [
        {
            role: "readWrite",
            db: "tarpaulin"
        }
    ]
});

print("I Exist");


db.users.insertMany([
    {
        "_id" : 4,
        "name" : "Joshua Strozzi",
        "email" : "strozzij@oregonstate.edu",
        "password" : "hunter2",
        "role" : 2
    },
    {
        "_id" : 5,
        "name" : "Dakota Alton",
        "email" : "dalton@oregonstate.edu",
        "password" : "hunter2",
        "role" : 2
    },
    {
        "_id" : 1,
        "name" : "Martin Nguyen",
        "email" : "mnguyen@oregonstate.edu",
        "password" : "hunter2",
        "role" : 2
    },
    {
        "_id" : 3,
        "name" : "Jennifer Schultz",
        "email" : "jschultze@oregonstate.edu",
        "password" : "hunter2",
        "role" : 1
    },
    {
        "_id" : 6,
        "name" : "Amber Johnson",
        "email" : "jamber@oregonstate.edu",
        "password" : "hunter2",
        "role" : 2
    },
    {
        "_id" : 2,
        "name" : "Timothy Daniels",
        "email" : "tdaniels@oregonstate.edu",
        "password" : "hunter2",
        "role" : 1
    },
    {
        "_id" : 7,
        "name" : "Rachel Valentino",
        "email" : "rvalent@oregonstate.edu",
        "password" : "hunter2",
        "role" : 2
    },
    {
        "_id" : 1,
        "name" : "Hussein Jamal",
        "email" : "husseinj@oregonstate.edu",
        "password" : "hunter2",
        "role" : 0
    },
    {
        "_id" : 8,
        "name" : "Rob Hess",
        "email" : "hessro@oregonstate.edu",
        "password" : "hunter2",
        "role": 1
    }

]);

db.courses.insertMany([
    {
        "_id" : 1,
        "subject" : "CS",
        "number" : "493",
        "title" : "Cloud Application Development",
        "term" : "sp20",
        "instructorID": 8
    },
    {
        "_id": 2,
        "subject" : "MTH",
        "number" : "251",
        "name" : "Derivative Calculus",
        "term" : "f20",
        "instructorId" : 2
    },
    {
        "_id": 3,
        "subject" : "CS",
        "number" : "492",
        "name" : "Mobile Application Development",
        "term" : "w20",
        "instructorId" : 8
    },
    {
        "_id": 4,
        "subject" : "CS",
        "number" : "261",
        "name" : "Data Structures",
        "term" : "f18",
        "instructorId" : 8
    }

]);

db.assignments.insertMany([
    {
        "_id" : 1,
        "courseId": 1,
        "title": "Assignment 1 - API design, implementation, and containerization",
        "points" : 100,
        "due": "2020-4-20T17:00:00-07:00",
    },
    {
        "_id" : 2,
        "courseId": 1,
        "title": "Assignment 2 - API storage",
        "points" : 100,
        "due": "2020-5-4T17:00:00-07:00",
    },
    {
        "_id" : 3,
        "courseId": 1,
        "title": "Assignment 3 - API authentication and authorization",
        "points" : 100,
        "due": "2020-5-18T17:00:00-07:00",
    },
    {
        "_id" : 4,
        "courseId": 1,
        "title": "Assignment 4 - File uploads and offline work",
        "points" : 100,
        "due": "2020-6-1T17:00:00-07:00",
    },
    {
        "_id" : 5,
        "courseId": 1,
        "title": "Final Project",
        "points" : 100,
        "due": "2020-6-12T17:00:00-07:00",
    },
    {
        "_id" : 6,
        "courseId": 2,
        "title": "Practice Problems 1",
        "points" : 10,
        "due": "2020-4-25T17:00:00-07:00",
    },
    {
        "_id" : 7,
        "courseId": 2,
        "title": "Practice Problems 2",
        "points" : 10,
        "due": "2020-4-30T17:00:00-07:00",
    },
    {
        "_id" : 8,
        "courseId": 2,
        "title": "Practice Problems 3",
        "points" : 10,
        "due": "2020-5-5T17:00:00-07:00",
    },
    {
        "_id" : 9,
        "courseId": 2,
        "title": "Practice Problems 4",
        "points" : 10,
        "due": "2020-5-12T17:00:00-07:00",
    }
]);


db.submissions.insertMany([
    {
        "assignmentId": "1",
        "studentId" : "4",
        "timestamp" : "2020-3-20T17:00:00-07:00",
        "file" : "binary file goes here"
    },
    {
        "assignmentId": "1",
        "studentId" : "6",
        "timestamp" : "2020-3-20T17:00:00-07:00",
        "file" : "binary file goes here"
    },
    {
        "assignmentId": "1",
        "studentId" : "1",
        "timestamp" : "2020-3-20T17:00:00-07:00",
        "file" : "binary file goes here"
    },
    {
        "assignmentId": "1",
        "studentId" : "5",
        "timestamp" : "2020-3-20T17:00:00-07:00",
        "file" : "binary file goes here"
    }
    
])

