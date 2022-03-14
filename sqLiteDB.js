const fs = require("fs");
const dbFile = "./questions.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;


function createTables(db){
    db.run(
        "CREATE TABLE Questions (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, date DATETIME)"
    );   
    db.run(
        "CREATE TABLE Answers (id INTEGER PRIMARY KEY AUTOINCREMENT, answer TEXT, question_id INTEGER, date DATETIME)"
    )   
}


dbWrapper
.open({
    filename: dbFile,
    driver: sqlite3.Database
})
.then(async dBase => {
    db = dBase;

    try {
        if (!exists) {
            createTables(db);                      
        }
    } catch (dbError) {
        console.log("hubo un error lol")
        console.error(dbError);
    }
});

// Server script calls these methods to connect to the db
module.exports = {

// Get the messages in the database
getQuestions: async () => {
    try {
        let data = await db.all("SELECT * from Questions");
        return data
    } catch (dbError) {
        console.log("hubo un error lol")
        console.error(dbError);
    }
},

// Add new message
addQuestion: async question => {
    let success = false;
    try {
        success = await db.run("INSERT INTO Questions (title, description, date) VALUES (?, ?, ?)", 
            question.title,
            question.description,
            question.date
        );
    } catch (dbError) {
        console.log("hubo un error lol")
        console.error(dbError);
    }
    return success.changes > 0 ? true : false;
},

// Remove message
addAnswer: async answer => {
    let success = false;
    try {
        success = await db.run("INSERT INTO Answers (answer, question_id, date) VALUES (?, ?, ?)",[
            answer.description,
            answer.id,
            answer.date
        ]);
    } catch (dbError) {
        console.error(dbError);
    }
    return success.changes > 0 ? true : false;
},

getAnswers: async question_id => {
    try {
        let data = await db.all("SELECT * from Answers WHERE question_id= ?", question_id);
        return data
    } catch (dbError) {
        console.log("hubo un error lol")
        console.error(dbError);
    }
}
};
 