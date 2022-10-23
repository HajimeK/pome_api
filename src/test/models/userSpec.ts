import { ModelUser, User } from '../../models/user';

describe("User Model", () => {

    const users: User[] = [
        {
            id: -1, // -1 if not assigned in DB
            name: "User",
            email: "email@test.dev",
            passwd: "test_password"
        }
    ]
    let user: User;

    it('create method should add a user', async () => {
        user = await ModelUser.create(users[0]);
        expect(user.name).toEqual(users[0].name);
        expect(user.email).toEqual(users[0].email);
        expect(user.passwd).not.toEqual(users[0].passwd); // passwd should be hashed
    });

    it('list method should return a list of users', async () => {
        const result = await ModelUser.list();
        expect(result.length).toEqual(1);
    });

    it('get method should return the correct user', async () => {
        const result = await ModelUser.get(user.id);
        expect(result.name).toEqual(users[0].name);
        expect(result.email).toEqual(users[0].email);
        expect(result.passwd).not.toEqual(users[0].passwd); // passwd should be hashed
    });

    it('authenticate with correst user/pass to approve login', async () => {
        const result = await ModelUser.authenticate(users[0].email, users[0].passwd);
        expect(result).not.toBeNull();
    });

    it('authenticate with wrong pass to approve login', async () => {
        const result = await ModelUser.authenticate(users[0].email, "wrong");
        expect(result).toBeNull();
    });

    it('authenticate with wrong user to approve login', async () => {
        const result = await ModelUser.authenticate('wrong@something.com', users[0].passwd);
        expect(result).toBeNull();
    });

    it('update method should update a product fields', async () => {
        const update_name = 'name_update';
        const email_update = 'email_update';
        const passwd_update = 'passwd_update';
        const result = await ModelUser.update({
            id: user.id,
            name: update_name,
            email: email_update,
            passwd: passwd_update
        });
        expect(result.email).toEqual('email_update@something.com');
        expect(result.name).toEqual('name_update');
        expect(await ModelUser.authenticate(email_update, passwd_update)).not.toBeNull();
    });

    it('delete method should remove the user', async () => {
        await ModelUser.delete(user.id);
        const result = await ModelUser.list()

        expect(result).toEqual([]);
    });
});