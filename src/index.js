const express = require('express');
const { v4: uuid, isUuid } = require('uuid');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const projects = [];

function logRequest(request, response, next) {

    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next();

    console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {

    const { id } = request.params;

    if(!isUuid(id)) {
        return response.status(400).json({ error: 'Invalid project ID.' });
    }

    return next();
}

// app.use(logRequest);

// Valida id por meio 
// app.use('/projects/:id', validateProjectId);

app.get('/projects', logRequest, (request, response) => {

    const { title } = request.query;

    const results = title ? projects.filter(project => project.title.includes(title)) : projects;

    return response.json(projects);
});

app.post('/projects', (request, response) => {

    const { title, student } = request.body;
    const project = { id: uuid(), title, student };

    projects.push(project);

    return response.json(project);
});

app.put('/projects/:id', (request, response) => {

    const { id } = request.params;
    const { title, student } = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0) { 
        return response.status(404).json({ error: 'Project not found.' });
    }

    const project = {
        id,
        title,
        student
    }

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {

    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0) { 
        return response.status(404).json({ error: 'Project not found.' });
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});

app.listen(3333, () => console.log('🚀 Back-end started!'));