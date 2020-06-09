db.courses.insertMany([
    {
        "_id" : ObjectId("1"),
        "subject" : "CS",
        "number" : "493",
        "title" : "Cloud Application Development",
        "term" : "sp20",
        "instructorID": ObjectId("8")
    },
    {
        "_id": ObjectId("2"),
        "subject" : "MTH",
        "number" : "251",
        "name" : "Differential Calculus",
        "term" : "f20",
        "instructorId" : ObjectId("2")
    },
    {
        "_id": ObjectId("3"),
        "subject" : "CS",
        "number" : "492",
        "name" : "Mobile Application Development",
        "term" : "w20",
        "instructorId" : ObjectId("8")
    },
    {
        "_id": ObjectId("4"),
        "subject" : "CS",
        "number" : "261",
        "name" : "Data Structures",
        "term" : "f18",
        "instructorId" : ObjectId("8")
    }
]);