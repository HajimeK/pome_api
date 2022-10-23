import { ModelExperience, Experience } from '../../models/Experience';
import { ModelTag, Tag } from '../../models/tag';
import { ModelUser, User } from '../../models/user';


describe("Experience Model", () => {

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
            title: "Experience1",
            note: "This is my experience about test so that we can do something",
            url: "https://superbc.dev"
        },
        {
            id: -1, // -1 if not assigned in DB
            title: "Experience2",
            note: "This is my experience about test so that we can do something",
            url: "https://superbc.dev"
        },
        {
            id: -1, // -1 if not assigned in DB
            title: "Experience3",
            note: "This is my experience about test so that we can do something",
            url: "https://superbc.dev"
        },
        {
            id: -1, // -1 if not assigned in DB
            title: "Experience4",
            note: "This is my experience about test so that we can do something",
            url: "https://superbc.dev"
        }
    ];

    beforeAll(async () => {
        user = await ModelUser.create({id: -1,
            name: "admintest",
            email: "admin@test.test",
            passwd: "password"});
        tag1 = await ModelTag.create("tag1");
        tag2 = await ModelTag.create("tag2");
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

    it('create method should add an experience, and assign id larger than or equal to 0', async () => {
        experience1 = await ModelExperience.create(
            experiences[0],
            tag1.tag
        );
        expect(experience1.id).toBeGreaterThan(-1);
    });

    it('list method should return a list of experience', async () => {
        experience2 = await ModelExperience.create(
            experiences[1],
            tag1.tag
        );
        experience3 = await ModelExperience.create(
            experiences[2],
            tag2.tag
        );
        experience3 = await ModelExperience.create(
            experiences[3]
        );
        const result = await ModelExperience.list();
        expect(result.length).toEqual(4);
    });

    it('list method with a tag name should return a list of experiences with the tag', async () => {
        const result = await ModelExperience.list('tag1');
        expect(result.length).toEqual(2);
    });

    it('Specify ID to return the correct experience', async () => {
        expect(await ModelExperience.get(experience1.id)).toEqual(experience1);
        expect(await ModelExperience.get(experience2.id)).toEqual(experience1);
        expect(await ModelExperience.get(experience3.id)).toEqual(experience3);
        expect(await ModelExperience.get(experience4.id)).toEqual(experience4);
        expect(await ModelExperience.get(experience4.id+1)).toThrowError();
    });

    it('update method should update an experience status', async () => {
        const updatedTitle = "Experience1update";
        experience1.title = updatedTitle;
        expect((await ModelExperience.update(experience1)).title).toEqual(updatedTitle);
    });

    it('delete method should remove the experience', async () => {
        await ModelExperience.delete(experience1.id);
        const result = await ModelExperience.get(experience1.id)
        expect(result).toBeNull();
    });

});