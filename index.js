
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const {parse} = require("nodemon/lib/cli");
const app = express();


app.use(bodyParser.urlencoded( {extended: true} ));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../grade/build')));
app.use(cors());

db.connect((err) => {
    if(err) {
        console.log("error connection " + err.stack);
        return;
    }
    console.log('success');
});

app.post('/api/createAccount', (req, res) => {
    const name = req.body.userName;
    const email = req.body.userEmail;
    console.log(name + "why not");

    const sqlUserInsert = "INSERT IGNORE INTO Users (userName, userEmail) VALUES (?, ?)";
    db.query(sqlUserInsert, [name, email], (err, result) => {
        console.log(result);
        res.send(result);
    });
})

app.post("/api/createYear", (req, res) => {
    const name = req.body.userName;
    const year = req.body.year;
    const session = req.body.session;
    const semester = req.body.semester;
    const semID = year + session + semester;

    const sqlHaveSemInsert = "INSERT IGNORE INTO userHaveSem (userName, semID) VALUES (?, ?)";

    db.query(sqlHaveSemInsert, [name, semID], (err, result) => {
        console.log(result);
        res.send(result);
    });
})

app.delete("/api/deleteYear/:userName/:year/:session/:semester", (req, res) => {
    const name = req.params.userName;
    const year = req.params.year;
    const session = req.params.session;
    const semester = req.params.semester;
    const semID = year + session + semester;
    const semIDInt = parseInt(semID);

    const sqlHaveSemDelete = "DELETE FROM userHaveSem WHERE userName = (?) AND semID = (?)";

    db.query(sqlHaveSemDelete, [name, semIDInt], (err, result) => {
        console.log(result);
        res.send(result);
    });
})

app.post("/api/createCourse", (req, res) => {
    const name = req.body.userName;
    const semID = req.body.semID;
    const courseName = req.body.courseName;
    const section = req.body.courseSection;

    const sqlHaveCourseInsert = "INSERT IGNORE INTO haveCourse (userName, semID, courseName, courseSection) VALUES (?, ?, ?, ?)";

    db.query(sqlHaveCourseInsert, [name, semID, courseName, section], (err, result) => {
        console.log(result);
        res.send(result);
    });
})

app.delete("/api/deleteCourse/:userName/:semID/:courseName", (req, res) => {
    const name = req.params.userName;
    const semID = req.params.semID;
    const semIDInt = parseInt(semID);
    const courseName = req.params.courseName;

    const sqlHaveCourseDelete = "DELETE FROM haveCourse WHERE userName = (?) AND semID = (?) AND courseName = (?)";

    db.query(sqlHaveCourseDelete, [name, semIDInt, courseName], (err, result) => {
        console.log(result);
        res.send(result);
    });
})

app.post("/api/createTask", (req, res) => {
    const name = req.body.userName;
    const semID = req.body.semID;
    const courseName = req.body.courseName;
    console.log(courseName);
    const taskName = req.body.taskName;
    const per = req.body.perToCourse;
    const perFloat = parseFloat(per);
    const num = req.body.numSubTasks;
    const numNum = parseInt(num);
    console.log(name, semID, courseName, taskName, perFloat, numNum);


    const sqlHaveTasksInsert = "INSERT IGNORE INTO haveTasks (userName, semID, courseName, taskName, perToCourse, numSubTasks) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sqlHaveTasksInsert, [name, semID, courseName, taskName, perFloat, numNum], (err, result) => {
        console.log(result);
        res.send(result);
    });
})

app.delete("/api/deleteTask/:userName/:semID/:courseName/:taskName", (req, res) => {
    const name = req.params.userName;
    const semID = req.params.semID;
    const semIDInt = parseInt(semID);
    const courseName = req.params.courseName;
    const taskName = req.params.taskName;

    const sqlHaveCourseDelete = "DELETE FROM haveTasks WHERE userName = (?) AND semID = (?) AND courseName = (?) AND taskName=(?)";

    db.query(sqlHaveCourseDelete, [name, semIDInt, courseName, taskName], (err, result) => {
        console.log(result);
        res.send(result);
    });
})

app.post("/api/createSubTask", (req, res) => {
    const name = req.body.userName;
    const semID = req.body.semID;
    const courseName = req.body.courseName;
    const taskName = req.body.taskName;
    const subTask = req.body.subTask;
    const subGrade = req.body.subGrade;
    const subOutOf = req.body.subOutOf;

    const sqlHaveTasksInsert = "REPLACE INTO haveSubTasks (subTask, userName, semID, courseName, taskName, subGrade, subOutOf) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.query(sqlHaveTasksInsert, [subTask, name, semID, courseName, taskName, subGrade, subOutOf], (err, result) => {
        console.log(result);
        res.send(result);
    });
})



app.get("/api/getYearList/:userName", (req, res) => {
    const name = req.params.userName;

    const sqlHaveSemGet = "SELECT * FROM userHaveSem WHERE userName = (?) ORDER BY semID DESC";

    db.query(sqlHaveSemGet, [name], (err, result) => {
        res.send(result);
    })
})

app.get("/api/getCourseList/:userName/:semID", (req, res) => {
    const name = req.params.userName;
    const semID = req.params.semID;
    const semIdInt = parseInt(semID);

    const sqlHaveCourseGet = "SELECT courseName, courseSection, totalCourseGrade, fail FROM haveCourse WHERE userName = (?) AND semID = (?)";

    db.query(sqlHaveCourseGet, [name, semIdInt], (err, result) => {
        res.send(result);
    })
})

app.get("/api/getTaskList/:userName/:semID/:courseName", (req, res) => {
    const name = req.params.userName;
    const semID = req.params.semID;
    const semIdInt = parseInt(semID);
    const courseName = req.params.courseName;

    const sqlHaveTaskGet = "SELECT taskName, numSubTasks, totalTaskGrade, perToCourse  FROM haveTasks WHERE userName = (?) AND semID = (?) AND courseName=(?)";

    db.query(sqlHaveTaskGet, [name, semIdInt, courseName], (err, result) => {
        res.send(result);
    })
})

app.get("/api/getSubTask/:userName/:semID/:courseName/:taskName/:subTask", (req, res) => {
    const name = req.params.userName;
    const semID = req.params.semID;
    const semIdInt = parseInt(semID);
    const courseName = req.params.courseName;
    const taskName = req.params.taskName;
    const subTask = req.params.subTask;
    const subTaskInt = parseInt(subTask);
    console.log(name, semIdInt, courseName, taskName, subTaskInt);

    const sqlHaveSubGet = "SELECT subGrade, subOutOf  FROM haveSubTasks WHERE userName = (?) AND semID = (?) AND courseName=(?) AND taskName = (?) AND subTask = (?)";

    db.query(sqlHaveSubGet, [name, semIdInt, courseName, taskName, subTaskInt], (err, result) => {
        res.send(result);
    })
})

app.put("/api/changeGrade/:userName/:semID/:courseName/:taskName/:numSubTasks", (req, res) => {
    const name = req.params.userName;
    const semID = req.params.semID;
    const semIdInt = parseInt(semID);
    const courseName = req.params.courseName;
    const taskName = req.params.taskName;
    const numSubTasks = req.params.numSubTasks;
    const numSubTasksInt = parseInt(numSubTasks);

    const sqlAllSubTasks = "SELECT subGrade, subOutOf  FROM haveSubTasks WHERE userName = (?) AND semID = (?) AND courseName=(?) AND taskName = (?)";

    db.query(sqlAllSubTasks, [name, semIdInt, courseName, taskName], (err, r1) => {
        console.log(r1);
        let taskSubSum = calSubSum(r1, numSubTasksInt);
        let taskGrade = taskSubSum * 100;

        const sqlUpdateTaskGrade = "UPDATE haveTasks SET totalTaskGrade = (?) WHERE userName = (?) AND semID = (?) AND courseName=(?) AND taskName = (?);";

        db.query(sqlUpdateTaskGrade, [taskGrade, name, semIdInt, courseName, taskName], (err, r2) => {

            const sqlAllTasks = "SELECT totalTaskGrade, perToCourse  FROM haveTasks WHERE userName = (?) AND semID = (?) AND courseName=(?)"

            db.query(sqlAllTasks, [name, semIdInt, courseName], (err, r3) => {

                let courseGrade = calCourseGrade(r3);

                const sqlUpdateCourseGrade = "UPDATE haveCourse SET totalCourseGrade = (?) WHERE userName = (?) AND semID = (?) AND courseName=(?);";

                db.query(sqlUpdateCourseGrade, [courseGrade, name, semIdInt, courseName], (err, r4) => {
                    const sqlAllCourse = "SELECT totalCourseGrade  FROM haveCourse WHERE userName = (?) AND semID = (?)"

                    db.query(sqlAllCourse, [name, semIdInt], (err, r5) => {
                        let semGrade = calSemGrade(r5);
                        console.log(semGrade + "r5");

                        const sqlUpdateSemGrade = "UPDATE userHaveSem SET totalSemGrade = (?) WHERE userName = (?) AND semID = (?);";

                        db.query(sqlUpdateSemGrade, [semGrade, name, semIdInt], (err, r6) => {
                            res.send(r6);
                        })

                    })
                })
            })
        })
    })
})


function calSubSum(tasks, num) {
    let len = tasks.length;
    let sumPer = 0;
    for (let t of tasks) {
        let grade = t.subGrade;
        let out = t.subOutOf;
        sumPer += grade / out;
    }

    for (let i = 0; i < num-len; i++) {
        sumPer += 1;
    }

    return sumPer / num;

}

function calCourseGrade(tasks) {
    let sum = 0;
    let sumPer = 0;

    for (let t of tasks) {
        let totalTaskGrade = t.totalTaskGrade;
        let perToCourse = t.perToCourse;

        sum += totalTaskGrade * perToCourse / 100;
        sumPer += t.perToCourse;
    }

    if (sumPer < 100) {
        sum += (100 - sumPer);
    }

    return sum;
}

function calSemGrade(courses) {
    let count = 0;

    let grade = 0;

    for (let c of courses) {
        count += 1;
        let g = c.totalCourseGrade;
        grade += g;
    }

    return (grade / count).toFixed(3);
}

app.listen(3001, () => {
    console.log("running server");
})




