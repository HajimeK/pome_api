import express from 'express';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import { User, ModelUser } from '../../models/user';
import { verifyAuthToken } from '../util/auth';

dotenv.config();

const user =  express.Router();
user.use(
    express.urlencoded({
        extended: true
    })
)
user.use(express.json());

export interface loginCredential {
    email: string;
    password: string;
}

export interface loginToken {
    email: string;
    token: string;
}

user.get('/list', verifyAuthToken, async (request, response) => {
    try {
        const users = await ModelUser.list();

        return response.status(200).send(users);
    } catch(error) {
        return response.status(400).send(`Could not get users. Error: ${(error as Error).message}`);
    }
});

user.get('/:id', verifyAuthToken, async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const p = await ModelUser.get(id);

        return response.status(200).send(p);
    } catch(error) {
        return response.status(400).send(`Could not get a user. Error: ${(error as Error).message}`);
    }
});

user.post('/', verifyAuthToken, async (request, response) => {
    const u = request.body as User;
    try {
        const u_created = await ModelUser.create(u);

        return response.status(200).send(u_created);
    } catch(error) {
        return response.status(400).send(`Could not create a user ${u.username} ${u.email}. Error: ${(error as Error).message}`);
    }
});

user.put('/', verifyAuthToken, async (request, response) => {
    const u = request.body as User;
    try {
        const u_created = await ModelUser.update(u);

        return response.status(200).send(u_created);
    } catch(error) {
        return response.status(400).send(`Could not create a user ${u.username} ${u.email}. Error: ${(error as Error).message}`);
    }
});

user.delete('/:id', verifyAuthToken, async (request, response) => {
    const id = parseInt(request.params.id);
    try {
        const user = await ModelUser.delete(id);

        return response.status(200).send(user);
    } catch(error) {
        return response.status(400).send(`Could not delete a user ${id}. Error: ${(error as Error).message}`);
    }
});

user.post('/login', (request, response) => {
    const credential = request.body as loginCredential;
    if (!credential || !credential.email || !credential.password) {
        return response.status(400).send('Missing email/password in request body');
    }

    ModelUser.authenticate(credential.email, credential.password)
    .then(user => {
        if (user && user.id) {
            const { TOKEN_SECRET } = process.env;
            response.status(200).send({
                email: user.email,
                token: Jwt.sign(user.email, TOKEN_SECRET as string)
            });
        } else {
            response.status(401).send('Invalid user credentials');
        }
    })
    .catch( error => {
        return response.status(400).send(`Login Failure. Error: ${(error as Error).message}`);
    })
});

export default user;