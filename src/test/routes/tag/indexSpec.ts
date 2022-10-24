import request from 'supertest';
import app from '../../../server';
import { Tag } from '../../../models/tag';
import { ModelUser, User } from '../../../models/user';
import { loginToken } from '../../../routes/user';

describe('Test Suite for /api/tag', () => {

    const req = request(app);
    let user: User;
    let token: string;
    const tags: Tag[] = [
        {
            id: -1, // -1 if not assigned in DB
            tag: "tag0"
        }
    ];

    beforeAll(async () => {
        user = await ModelUser.create({id: -1,
            username: "admintest",
            email: "admin@test.test",
            passwd: "password"});
        // login to get auth token
        const login = await req.post('/api/user/login').send({email: user.email, password: 'password'});
        token = (login.body as loginToken).token;
    });

    afterAll(async () => {
        await ModelUser.delete(user.id);
    });

    // - Create [token required]
    it(`POST /api/tag/${tags[0].tag} should add a tag`, async () => {
        await req
            .post(`/api/tag/${tags[0].tag}`)
            .auth(token, {type: 'bearer'})
            .expect(200)
            .expect((response) => {
                const tag = response.body as Tag;
                expect(tag.tag).toBe(tags[0].tag);
                tags[0].id = tag.id;
            });
    });

    it(`POST /api/tag/${tags[0].tag} for duplicate should return 409`, async () => {
        await req
            .post(`/api/tag/${tags[0].tag}`)
            .auth(token, {type: 'bearer'})
            .expect(409);
    });

    // - Inex
    // - [OPTIONAL] Top 5 most popular products
    // - [OPTIONAL] Products by category (args: product category)
    it('GET /api/tag/list', async () => {
        await req
            .get('/api/tag/list')
            .expect(200)
            .expect((response) => {
                const products = response.body as Tag[];
                expect(products.length).toBe(1);
            });
    });

    // Get
    it(`GET /api/tag/${tags[0].tag}`, async () => {
        await req
            .get(`/api/tag/${tags[0].tag}`)
            .expect(200)
            .expect ( (response) => {
                expect(response.body)
                .toEqual(tags[0]);
            });
    });

    // - Delete
    it('/api/tag/delete', async () => {
        await req
            .delete(`/api/tag/${tags[0].tag}`)
            .auth(token, {type: 'bearer'})
            .expect(200);
    });
});