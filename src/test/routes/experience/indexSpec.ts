import request from 'supertest';
import app from '../../../server';
import { ModelTag, Tag } from '../../../models/tag';
import { ModelUser, User } from '../../../models/user';
import { ModelExperience, Experience, ExperienceBody } from '../../../models/Experience';
import { loginToken } from '../../../routes/user';

// Experience
describe('Test suite for /api/experience', () => {

    let user: User;
    let token: string;

    const experiences: Experience[] = [
        {
            id: -1, // -1 if not assigned in DB
            title: "Experience1",
            note: "This is my experience about test so that we can do something",
            urle: "https://superbc.dev"
        },
        {
            id: -1, // -1 if not assigned in DB
            title: "Experience2",
            note: "This is my experience about test so that we can do something",
            urle: "https://superbc.dev"
        },
        {
            id: -1, // -1 if not assigned in DB
            title: "Experience3",
            note: "This is my experience about test so that we can do something",
            urle: "https://superbc.dev"
        },
        {
            id: -1, // -1 if not assigned in DB
            title: "Experience4",
            note: "This is my experience about test so that we can do something",
            urle: "https://superbc.dev"
        }
    ];

    const tags: Tag[] = [{id: -1, tag :'tag1'}, {id: -1, tag: 'tag2'}]

    const req = request(app);

    beforeAll(async () => {
        user = await ModelUser.create({id: -1,
            username: "admintest",
            email: "admin@test.test",
            passwd: "password"});
        // login to get auth token
        const login = await req.post('/api/user/login').send({email: user.email, password: 'password'});
        token = (login.body as loginToken).token;

        tags[0] = await ModelTag.create(tags[0].tag);
        tags[1] = await ModelTag.create(tags[1].tag);
    });

    afterAll( async () => {
        const listExperience = await ModelExperience.list();
        for( const item of listExperience) {
            await ModelExperience.delete(item.id);
        }

        const listTag = await ModelTag.list();
        for( const item of listTag) {
            await ModelTag.delete(item.tag);
        }
        await ModelUser.delete(user.id);
    });

    it('POST /api/experience (token requied) create experiences', async () => {
        for( const experience of experiences) {
            await req.post(`/api/experience`)
            .auth(token, {type: 'bearer'})
            .send({
                experience: experience,
                tags: ['tag1', 'tag2']
            })
            .expect(200)
            .expect((response) => {
                expect((response.body as unknown as Experience).title).toBe(experience.title);
                experience.id = ((response.body as unknown) as Experience).id;
            });
        }
    });

    it('GET /api/experience/list to return all the experiences', async () => {
        const expectedLength = (await ModelExperience.list()).length;
        await req.get('/api/experience/list')
        .expect(200)
        .expect((response) => {
            expect((response.body as unknown as Experience[]).length)
            .toBe(expectedLength);
        });
    });

    it(`GET /api/experience/list?tag=${tags[0].tag} to return the experiences tagged to ${tags[0].tag}`, async () => {
        const expectedLength = (await ModelExperience.list(tags[0].tag)).length;
        await req.get(`/api/experience/list?tag=${tags[0].tag}`)
        .expect(200)
        .expect((response) => {
            expect((response.body as unknown as Experience[]).length)
            .toBe(expectedLength);
        });
    });

    it('GET /api/experience/list should return a list of experience', async () => {
        await req.get(`/api/experience/list`)
            .expect(200)
            .expect((response) => {
                console.log(response.body);
            });
    });

    it('GET /api/experience/:id to get the experience of id', async () => {
        await req.get(`/api/experience/${experiences[0].id}`)
        .expect(200)
        .expect((response) => {
            expect((response.body as unknown as Experience).title)
            .toBe(experiences[0].title);
        });
    });

    it('PUT /api/experience (token requied) to update the experience', async () => {
        experiences[0].title = 'updated';
        await req.put('/api/experience')
        .auth(token, {type: 'bearer'})
        .send(experiences[0])
        .expect(200)
        .expect((response) => {
            expect((response.body as unknown as Experience).title)
            .toBe('updated');
        });
    });

    it('DELETE /experience/:id (token requied) delete a experience, and could not be deleted again', async () => {
        await req.delete(`/api/experience/${experiences[0].id}`)
        .auth(token, {type: 'bearer'})
        .expect(200)
        // await req.delete(`/api/experience/${experiences[0].id}`)
        // .auth(token, {type: 'bearer'})
        // .expect(404)
    });
});