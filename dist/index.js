"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const jsonBodyMiddleware = express_1.default.json();
app.use(jsonBodyMiddleware);
const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};
const db = {
    courses: [
        { id: 1, title: 'front-end' },
        { id: 2, title: 'back-end' },
        { id: 3, title: 'devops' },
        { id: 4, title: 'QA' }
    ]
};
app.get('/', (req, res) => {
    res.json({ message: 'Hello world' });
});
app.get('/courses', (req, res) => {
    let foundCourses = db.courses;
    if (req.query.title) {
        foundCourses = foundCourses
            .filter(c => c.title.indexOf(req.query.title) > -1);
    }
    res.json(foundCourses);
});
app.get('/courses/:id', (req, res) => {
    const foundCourse = db.courses.find(e => e.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(foundCourse);
});
app.post('/courses', (req, res) => {
    if (!req.body.title || req.body.title.replaceAll(' ', '').length < 1) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(createdCourse);
    console.log(createdCourse);
    res.status(HTTP_STATUSES.CREATED_201).json(createdCourse);
});
app.delete('/courses/:id', (req, res) => {
    const courseIndex = db.courses.findIndex(course => course.id === +req.params.id);
    if (!db.courses || courseIndex === -1) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    db.courses = db.courses.filter(c => c.id !== +req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
app.put('/courses/:id', (req, res) => {
    const title = req.body.title;
    if (!title) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    foundCourse.title = req.body.title;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
