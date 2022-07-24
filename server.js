var express = require('express');
var app = express();
var fs = require("fs");
var cors = require('cors');

app.use(cors());

app.get('/getDefinition/:acronym', (req, res) => {
    const getWord = (data, letter) => {
        const words = JSON.parse(data).filter(word => word.startsWith(letter));
        const resultWord = words[Math.floor(Math.random() * words.length)];
        return resultWord;
    }
    const acronym = req.params.acronym;
    const finalDefinition = [];
    if (/^[a-zA-Z]+$/.test(acronym)) {
        fs.readFile( __dirname + "/" + "nouns.json", 'utf8', function (err, data) {
            const nouns = data;
            fs.readFile( __dirname + "/" + "adjectives.json", 'utf8', function (err, data) {
                const adjectives = data;
                for (let i = 0; i < acronym.length; i++) {
                    let word = undefined;
                    if (i < acronym.length - 1) {
                        word = getWord(adjectives, acronym[i]);
                    } else {
                        word = getWord(nouns, acronym[i]);
                    }
                    word && finalDefinition.push(word.charAt(0).toUpperCase() + word.slice(1));
                }
                res.send({ word: finalDefinition.join(' ') });
            });
        });
    } else {
        res.status(400).send('Invalid acronym.');
    }
});

var server = app.listen(process.env.PORT, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Dumb Acronym app listening at http://%s:%s", host, port)
});
