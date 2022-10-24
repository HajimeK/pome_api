import express from 'express';
import { ModelExperience, Experience, ExperienceBody } from '../../models/Experience';
import { verifyAuthToken } from '../util/auth';

const experience =  express.Router();
experience.use(
    express.urlencoded({
        extended: true
    })
)
experience.use(express.json());

experience.get('/list', (request: express.Request, response: express.Response) => {
    if (typeof request.query.tag !== 'undefined') {
        ModelExperience.list(request.query.tag as string)
        .then(experiences => {
            return response.status(200).send(experiences);
        })
        .catch(error => {
            return response.status(400).send(`Could not get an experiences. Error: ${(error as Error).message}`);
        })
    } else {
        ModelExperience.list()
        .then(experiences => {
            return response.status(200).send(experiences);
        })
        .catch(error => {
            return response.status(400).send(`Could not get an experiences. Error: ${(error as Error).message}`);
        })
    }
});

experience.get('/:id', (request: express.Request, response: express.Response) => {
    const id = parseInt(request.params.id);
    ModelExperience.get(id)
    .then(returned => {
        return response.status(200).send(returned);
    })
    .catch(error => {
        return response.status(404).send(`Could not get an experience ${id}. Error: ${(error as Error).message}`);
    });
});

experience.post('/', verifyAuthToken, (request: express.Request, response: express.Response) => {
    const newExperience = (request.body as unknown) as ExperienceBody;
    ModelExperience.create(newExperience.experience, newExperience.tags)
    .then(experience => {
        return response.status(200).send(experience);
    })
    .catch(error => {
        return response.status(400).send(`Could not create an experience ${newExperience.experience.title}. Error: ${(error as Error).message}`);
    });
});

experience.put('/', verifyAuthToken, (request: express.Request, response: express.Response) => {
    const updatedExperience = (request.body as unknown) as Experience;
    ModelExperience.update(updatedExperience)
    .then(experience => {
        return response.status(200).send(experience);
    })
    .catch(error => {
        return response.status(400).send(`Could not create an experience ${updatedExperience.title}. Error: ${(error as Error).message}`);
    });
});

experience.delete('/:id', verifyAuthToken, (request: express.Request, response: express.Response) => {
    const id = parseInt(request.params.id);
    ModelExperience.delete(id)
    .then(experience => {
        return response.status(200).send(experience);
    })
    .catch(error => {
        return response.status(400).send(`Could not delete order ${id}. Error: ${(error as Error).message}`);
    });
});

export default experience;