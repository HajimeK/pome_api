import { ModelExperience, Experience } from '../../models/Experience';
import { ModelTag, Tag } from '../../models/tag';
import { ModelUser, User } from '../../models/user';


describe('Experience Model', () => {

    let experience1 : Experience;
    let experience2 : Experience;
    let experience3 : Experience;
    let experience4 : Experience;
    let tag1: Tag;
    let tag2: Tag;
    let user: User;
    const experiences: Experience[] = [
        {
            id: -1, // -1 if not assigned in DB
            title: 'Experience1',
            note: 'This is my experience about test so that we can do something',
            urle: 'https://superbc.dev'
        },
        {
            id: -1, // -1 if not assigned in DB
            title: 'Experience2',
            note: 'This is my experience about test so that we can do something',
            urle: 'https://superbc.dev'
        },
        {
            id: -1, // -1 if not assigned in DB
            title: 'Experience3',
            note: 'This is my experience about test so that we can do something',
            urle: 'https://superbc.dev'
        },
        {
            id: -1, // -1 if not assigned in DB
            title: 'Experience4',
            note: 'This is my experience about test so that we can do something',
            urle: 'https://superbc.dev'
        }
    ];

    beforeAll(async () => {
        user = await ModelUser.create({id: -1,
            username: 'admintest',
            email: 'admin@test.test',
            passwd: 'password'});
        tag1 = await ModelTag.create('tag1');
        tag2 = await ModelTag.create('tag2');

    });

    afterAll( async () => {
        await ModelTag.delete('tag1');
        await ModelTag.delete('tag2');

        await ModelUser.delete(user.id);
    });

    it('create method should add an experience, and assign id larger than or equal to 0', async () => {
        experience1 = await ModelExperience.create(
            experiences[0],
            ['tag1']
        );
        experiences[0].id = experience1.id;
        expect(experience1.id).toBeGreaterThan(-1);
    });

    it('list method should return a list of experience', async () => {
        const beforeResult = await ModelExperience.list();
        experience2 = await ModelExperience.create(
            experiences[1],
            ['tag1']
        );
        experiences[1].id = experience2.id;
        experience3 = await ModelExperience.create(
            experiences[2],
            ['tag2']
        );
        experiences[2].id = experience3.id;
        experience4 = await ModelExperience.create(
            experiences[3]
        );
        experiences[3].id = experience4.id;
        const result = await ModelExperience.list();
        expect(result.length - beforeResult.length).toEqual(3);
    });

    it('list method with a tag name should return a list of experiences with the tag', async () => {
        const result = await ModelExperience.list('tag1');
        expect(result.length).toEqual(2);
    });

    it('Specify ID to return the correct experience', async () => {
        expect((await ModelExperience.get(experience1.id)).title).toEqual(experience1.title);
        expect((await ModelExperience.get(experience2.id)).title).toEqual(experience2.title);
        expect((await ModelExperience.get(experience3.id)).title).toEqual(experience3.title);
        expect((await ModelExperience.get(experience4.id)).title).toEqual(experience4.title);
    });

    it('update method should update an experience status', async () => {
        const updatedTitle = 'Experience1update';
        experience1.title = updatedTitle;
        expect((await ModelExperience.update(experience1)).title).toEqual(updatedTitle);
    });

    it('delete method should remove the experience', async () => {
        for( const item of experiences) {
            await ModelExperience.delete(item.id);
            const result = await ModelExperience.get(experience1.id);
            expect(result).toBeUndefined();
        }
    });

});