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


