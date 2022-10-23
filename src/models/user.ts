import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import client from '../database';

export type User = {
    id: number, // -1 if not assigned in DB
    name: string,
    email: string,
    passwd: string,
};

dotenv.config();
const {
    BCRYPT_PASSWORD,
    SALT_ROUNDS,
} = process.env;

export class ModelUser {

    static async list(): Promise<User[]> {
        try {
            // Generate SQL query
            const sql = 'SELECT id, name, passwd FROM appuser';
            // request to DB
            const conn = await client.connect();
            const result = (await conn.query(sql)).rows as User[];
            conn.release();

            return result;
        } catch (error) {
            throw new Error(`Could not get users. Error: ${(error as Error).message}`);
        }
    }

    static async get(id: number): Promise<User> {
        try {
            const sql = `SELECT appuser.id, appuser.name, appuser.email \
                            FROM appuser \
                            WHERE id=${id}`;
            // request to DB
            const conn = await client.connect();
            const result = (await conn.query(sql)).rows[0] as User;
            conn.release();

            return result;
        } catch (error) {
            throw new Error(`Could not find a user ${id}. Error: ${(error as Error).message}`);
        }
    }

    static async create(u: User): Promise<User> {
        try {
            const conn = await client.connect();
            const hash = bcrypt.hashSync(u.passwd + (BCRYPT_PASSWORD as string),
                                        Number(SALT_ROUNDS));
            const sql = `INSERT INTO appuser (name, email, passwd ) \
                        VALUES('${u.name}', '${u.email}', '${hash}') RETURNING *`;
            // request to DB
            const result = (await conn.query(sql)).rows[0] as User;
            conn.release()

            return result;
        } catch(error) {
            throw new Error(`unable to create a uer ${u.name}, ${u.email}: ${(error as Error).message}`);
        }
    }

    static async update(u: User): Promise<User> {
        try {
            const conn = await client.connect();
            const hash = bcrypt.hashSync(u.name + (process.env.BCRYPT_PASSWORD as string),
                                        Number(process.env.SALT_ROUND));
            const sql = `UPDATE appuser \
                            SET name = '${u.name}', \
                                email   = '${u.email}', \
                                userpassword = '${hash}' \
                            WHERE  appuser.id = ${u.id} \
                            RETURNING *`;
            // request to DB
            const result = (await conn.query(sql)).rows[0] as User;
            conn.release()

            return result;
        } catch(error) {
            throw new Error(`unable to create a uer ${u.name}, ${u.email}: ${(error as Error).message}`);
        }
    }

    static async delete(id: number): Promise<User> {
        try {
            const sql = `DELETE FROM appuser WHERE id=${id} RETURNING *`;
            // request to DB
            const conn = await client.connect();
            const result = (await conn.query(sql)).rows[0] as User;
            conn.release();

            return result;
        } catch (error) {
            throw new Error(`Could not delete user ${id}. Error: ${(error as Error).message}`)
        }
    }

    static async authenticate(email: string, password: string): Promise<User | null> {

        const sql = `SELECT * FROM appuser WHERE email='${email}'`;

        const conn = await client.connect();
        const result = await conn.query(sql);
        conn.release();

        if(result.rows.length) {
            const user = result.rows[0] as User;
            if(bcrypt.compareSync(password+ (process.env.BCRYPT_PASSWORD as string), user.passwd)) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}