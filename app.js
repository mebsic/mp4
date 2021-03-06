const port = process.env.PORT || 8080;
const cp = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const express = require("express");
const ytdl = require("ytdl-core");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.get('/favicon.ico', (response) => {
    response.sendFile(path.resolve(__dirname + '/favicon.ico'));
});

app.get("/", (req, res) => {
    res.sendFile(__dirname);
});

app.get('/download', (req, res) => {
    var url = req.query.url;

    ytdl.getInfo(url).then(url => {
        audioStream = ytdl.downloadFromInfo(url, { format: 'mp3', quality: 'highestaudio' });
        videoStream = ytdl.downloadFromInfo(url, { format: 'mp4', quality: 'highestvideo' });

        ffmpegProcess = cp.spawn(ffmpegPath, [
            '-loglevel', '8', '-hide_banner',
            '-i', 'pipe:3', '-i', 'pipe:4',
            '-map', '0:a', '-map', '1:v',
            '-c', 'copy',
            '-f', 'matroska', 'pipe:5'
        ], {
            windowsHide: true,
            stdio: [
                'inherit', 'inherit', 'inherit',
                'pipe', 'pipe', 'pipe'
            ]
        });

        audioStream.pipe(ffmpegProcess.stdio[3]);
        videoStream.pipe(ffmpegProcess.stdio[4]);
        res.header("Content-Disposition", 'attachment; filename="video.mp4');
        ffmpegProcess.stdio[5].pipe(res);
    });
});

app.use((req, res) => {
    res.status(404).sendFile((path.join(__dirname + "/404.html")));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
