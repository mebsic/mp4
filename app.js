const express = require("express");
const ytdl = require("ytdl-core");
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.get('/favicon.ico', (response) => {
    response.sendFile(path.resolve(__dirname + '../favicon.ico'));
});

app.get("/", function(response) {
    response.sendFile(__dirname);
});

app.get('/download', (req, res) => {
    var url = req.query.url;

    res.header("Content-Disposition", 'attachment; filename="video.mp4');
    ytdl(url, {format: 'mp4', quality: 'highestvideo'}).pipe(res);
});

app.listen(5000);
