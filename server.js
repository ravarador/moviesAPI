/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: Jexequiel Ravni Arador Student ID: 127168219 Date: September 12, 2022
* Cyclic Link: _______________________________________________________________
*
********************************************************************************/

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const MoviesDB = require("./modules/moviesDB");
const db = new MoviesDB();

const app = express();

app.use(express.json());

app.use(cors());

const HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.json({ message: "API Listening" });
})

// POST /api/movies
app.post("/api/movies", (req, res) => {
    db.addNewMovie(req.body).then(() => {
        res.status(201).json({ message: "Movie created." });
    }).catch((err) => {
        res.status(500).json({ message: err });
    })
})

// GET /api/movies
app.get("/api/movies/", (req, res) => {
    var page = req.query.page;
    var perPage = req.query.perPage;
    var title = req.query.title;

    db.getAllMovies(page, perPage, title).then(data => {
        res.json(data);
    }).catch((err) => {
        res.status(404).json({ message: err });
    })
})

// GET /api/movies/:id
app.get("/api/movies/:id", (req, res) => {
    var id = req.params.id;

    db.getMovieById(id).then(data => {
        res.json(data);
    }).catch((err) => {
        res.status(404).json({ message: err });
    })
})

// PUT /api/movies/:id
app.put("/api/movies/:id", (req, res) => {
    var id = req.params.id;
    var body = req.body;

    db.updateMovieById(body, id).then(() => {
        res.status(204).json({ message: "Movie updated." });
    }).catch(err => {
        res.status(404).json({ message: err });
    })
})

// DELETE /api/movies
app.delete("/api/movies/:id", (req, res) => {
    var id = req.params.id;

    db.deleteMovieById(id).then(() => {
        res.status(204).json({ message: "Movie deleted." });
    }).catch(err => {
        res.status(404).json({ message: err });
    })
})

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});