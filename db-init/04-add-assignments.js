
db.assignments.insertMany([
    {
        "_id" : ObjectId("1"),
        "courseId": ObjectId("1"),
        "title": "Assignment 1 - API design, implementation, and containerization",
        "points" : 100,
        "due": "2020-4-20T17:00:00-07:00",
    },
    {
        "_id" : ObjectId("2"),
        "courseId": ObjectId("1"),
        "title": "Assignment 2 - API storage",
        "points" : 100,
        "due": "2020-5-4T17:00:00-07:00",
    },
    {
        "_id" : ObjectId("3"),
        "courseId": ObjectId("1"),
        "title": "Assignment 3 - API authentication and authorization",
        "points" : 100,
        "due": "2020-5-18T17:00:00-07:00",
    },
    {
        "_id" : ObjectId("4"),
        "courseId": ObjectId("1"),
        "title": "Assignment 4 - File uploads and offline work",
        "points" : 100,
        "due": "2020-6-1T17:00:00-07:00",
    },
    {
        "_id" : ObjectId("5"),
        "courseId": ObjectId("1"),
        "title": "Final Project",
        "points" : 100,
        "due": "2020-6-12T17:00:00-07:00",
    },
    {
        "_id" : ObjectId("6"),
        "courseId": ObjectId("2"),
        "title": "Practice Problems 1",
        "points" : 10,
        "due": "2020-4-25T17:00:00-07:00",
    },
    {
        "_id" : ObjectId("7"),
        "courseId": ObjectId("2"),
        "title": "Practice Problems 2",
        "points" : 10,
        "due": "2020-4-30T17:00:00-07:00",
    },
    {
        "_id" : ObjectId("8"),
        "courseId": ObjectId("2"),
        "title": "Practice Problems 3",
        "points" : 10,
        "due": "2020-5-5T17:00:00-07:00",
    },
    {
        "_id" : ObjectId("9"),
        "courseId": ObjectId("2"),
        "title": "Practice Problems 4",
        "points" : 10,
        "due": "2020-5-12T17:00:00-07:00",
    }
]);
