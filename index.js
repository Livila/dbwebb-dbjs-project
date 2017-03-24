//byt gärna namn på fil


'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('internetbanken.sqlite');

db.serialize(() => {
//db.run("INSERT INTO User VALUES (2, 2234, 'Öskar', 'Årt', '298804131234', 'Öskargatan', 'Öskarstaden');");


    db.all("SELECT * FROM VUserAndAccount;", (err, rows) => {

        console.log(rows);
    });

});

db.close();
