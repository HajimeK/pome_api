import express from 'express';
import { ModelTag } from '../../models/tag';
import { verifyAuthToken } from '../util/auth';

const tag = express.Router();

tag.use(
    express.urlencoded({
        extended: true
    })
)
tag.use(express.json());

tag.get('/list', (request: express.Request, response: express.Response) => {
    ModelTag.list()
    .then(tags => {
        return response.status(200).send(tags);
    })
    .catch(error => {
        return response.status(400).send(`Could not get tags. Error: ${(error as Error).message}`);
    })
});

tag.get('/:tag', (request: express.Request, response: express.Response) => {
    ModelTag.get(request.params.tag)
    .then(tag => {
        return response.status(200).send(tag);
    })
    .catch(error => {
        return response.status(404).send(`Could not get a tag. Error: ${(error as Error).message}`);
    })
});

tag.post('/:tag', verifyAuthToken, (request: express.Request, response: express.Response) => {
    ModelTag.create(request.params.tag)
    .then(tag => {
        return response.status(200).send(tag);
    })
    .catch(error => {
        return response.status(409).send(`Could not create a tag. Error: ${(error as Error).message}`);
    })
});

tag.delete('/:tag', verifyAuthToken, (request: express.Request, response: express.Response) => {
    ModelTag.delete(request.params.tag)
    .then(tag => {
        return response.status(200).send(tag);
    })
    .catch(error => {
        return response.status(404).send(`Could not delete a tag. Error: ${(error as Error).message}`);
    })
});

export default tag;