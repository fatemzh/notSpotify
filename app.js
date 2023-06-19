
// SERVEUR
// Ne pas oublier d'installer les packages : npm install express express-fileupload, npm install express, npm install express-fileupload, node app.js

const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const musicMetadata = require('music-metadata');

const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');

const PORT = process.env.PORT || 3500;

const app = express();

app.get("/", (req, res) => {
    //Modif chemin 
    res.sendFile(path.join(__dirname, "./src/html/biblio.html"));
});

app.post('/upload',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.mp3', '.wav', '.flac', '.m4a', '.aac', '.ogg']),
    fileSizeLimiter,
    async (req, res) => { // Make this callback async
        const files = req.files

        const filenames = [];
        const metadataList = [];

        for (const key of Object.keys(files)) {
            const file = files[key];
            const filepath = path.join(__dirname, 'files', file.name);
            filenames.push(file.name);

            file.mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err });
            });

            // Parse the audio file's metadata
            const metadata = await musicMetadata.parseFile(filepath);
            metadataList.push({
                filename: file.name,
                title: metadata.common.title,
                artist: metadata.common.artist,
                album: metadata.common.album,
            });
        }

        return res.json({ status: 'success', message: filenames, metadata: metadataList });
    }
);