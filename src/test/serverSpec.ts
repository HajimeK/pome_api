import request from 'supertest';
import app from '../server';

const req = request(app);

describe('Test Suite for /', () => {

    it('Server healthcheck', async () => {
        await req
            .get('/')
            .expect(200)
    });
});