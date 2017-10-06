const express = require('express');
const fs = require('fs');
const app = express();
const date = new Date();


app.use((req, res, next) => {

    const logInfo = [
        req.headers['user-agent'].replace(/\,/g, ""),
        date.toISOString(),
        req.method,
        req.originalUrl,
        "HTTP/" + req.httpVersion,
        res.statusCode
    ];


    fs.appendFile(__dirname + '/log.csv', logInfo.toString() + "\n", (err) => {
        if (err) throw err;
        next();
    });
});

app.get('/', (req, res) => {

    fs.readFile('./log.csv', 'utf-8', (err, data) => {
        if (err) throw err;
        console.log(data)
        res.send(data);
    });

});

app.get('/logs', (req, res) => {
    fs.readFile(__dirname + '/log.csv', 'utf-8', (err, data) => {
        if (err) throw err;
        // Converting CSV to Json
        function csvJSON(csv) {
            var lines = csv.split("\n");
            var result = [];
            var headers = lines[0].split(",");

            for (var i = 1; i < lines.length; i++) {

                var obj = {};
                var currentline = lines[i].split(",");

                for (var j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentline[j];
                }

                result.push(obj);

            }
            return result; //JavaScript object


        }
        var jsonData = csvJSON(data)
        console.log(jsonData);
        res.json(jsonData);
    });
});

module.exports = app;







// app.get('/logs', (req, res) => {
//     fs.readFile('./log.csv', 'utf-8', (err, data) => {
//         if (err) throw err;
//         res.send(data);
//         // console.log("Json data sent to browser");
//         }); 
//     });