import { ModelTag, Tag } from '../../models/tag';

describe("Tag Model", () => {

    let tag: Tag;
    const tags: Tag[] = [
        {
            id: -1, // -1 if not assigned in DB
            tag: "tag0"
        }
    ];

    beforeAll(() => {
        console.log("Before all in Tag Unit tests")
    });

    afterAll(() => {
        console.log("After all in Tag Unit tests")
    });

    it('create method should add a tag', async () => {
        tag = await ModelTag.create(tags[0].tag);
        // tag id is assigned y DB
        expect(tag.id).toBeGreaterThan(-1);
        // Can achivale in DB
        expect(tag.tag).toEqual(tags[0].tag);
    });

    it('list method should return a list of tags', async () => {
        const result = await ModelTag.list();
        expect(result.length).toEqual(1);
    });

    it('get method should return the correct tag', async () => {
        const result = await ModelTag.get(tag.tag);
        expect(result.tag).toEqual(tag.tag);
    });

    it('delete method should remove the tag', async () => {
        await ModelTag.delete(tag.tag);
        expect(await ModelTag.get(tag.tag)).toBeUndefined();
    });

});