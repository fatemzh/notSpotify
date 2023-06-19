//Search bar
window.onload = function() {

    const searchInput = document.querySelector('#search-input');
    searchInput.addEventListener('keyup', function(e) {

        const term = e.target.value.toLowerCase();

        const rows = document.querySelectorAll('.table tbody tr');
        for (const row of rows) {

            const title = row.children[1].textContent.toLowerCase();

            const artist = row.children[2].textContent.toLowerCase();

            const album = row.children[3].textContent.toLowerCase();

            if (title.indexOf(term) === -1 && artist.indexOf(term) === -1 && album.indexOf(term) === -1) {
                row.style.display = 'none';
            } else {
                row.style.display = '';
            }
        }
    });

    //Like function
    if (window.jQuery) {  
        $(".like-btn").on("click", function() {
            $(this).toggleClass("clicked");
        });
    } else {
       console.log("jQuery is not loaded");
    }
};

// SERVEUR
// Ne pas oublier d'installer les packages : npm install express express-fileupload, npm install express, npm install express-fileupload, node app.js

const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

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
    (req, res) => {
        const files = req.files
        console.log(files)

        const filenames = [];

        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, 'files', files[key].name)
            filenames.push(files[key].name);
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err })
            })
        })

        return res.json({ status: 'success', message: filenames })
    }
)
app.use('/files', express.static(path.join(__dirname, 'files')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));