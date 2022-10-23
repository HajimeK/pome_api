import client from '../database';
import { ModelTag, Tag } from './tag';

export type Experience = {
    id: number, // -1 if not assigned in DB
    title: string,
    note: string,
    url: string
};

export class ModelExperience {

    static async list(tagName?: string): Promise<Experience[]> {
        try {
            // Generate SQL query
            let sql = '';
            if(tagName!== undefined) {
                const tag = await ModelTag.get(tagName);
                sql = `SELECT * FROM experience INNER JOIN relexptag WHERE tag=${tag.id}`;
            } else {
                sql = `SELECT * FROM experience`;
            }
            const conn = await client.connect();
            const experiences = (await conn.query(sql)).rows as Experience[];
            conn.release();

            return experiences;
        } catch (error) {
            throw new Error(`Could not get orders. Error: ${(error as Error).message}`);
        }
    }

    static async get(id: number): Promise<Experience> {
        try {
            const sql = `SELECT * FROM experience where id="${id}"`;
            // request to DB
            const conn = await client.connect();
            const experience = (await conn.query(sql)).rows[0] as Experience;
            conn.release();

            return experience;
        } catch (error) {
            throw new Error(`Could not get the experiencs. Error: ${(error as Error).message}`);
        }
    }

    static async create(experience: Experience, tag?: string): Promise<Experience> {
        try {
            // DB query
            const conn = await client.connect();
            // Create an experience
            const sql = `INSERT INTO experience (title, note, url) \
                                VALUES(${experience.title}, ${experience.note}, ${experience.url}) RETURNING *`;
            const result = (await conn.query(sql)).rows[0] as Experience;
            if (tag !== undefined) {
                tag = ((await conn.query(sql)).rows[0] as Tag).tag
                await conn.query(`INSERT INTO relexptag (experience, tag) \
                                VALUES(${result.id}, ${tag})`);
            }
            conn.release();

            return result;
        } catch (error) {
            await client.query("ROLLBACK");
            throw new Error(`Could not add new experience for the user ${experience.title}. Error: ${(error as Error).message}`)
        }
    }

    static async update(experience: Experience): Promise<Experience> {
        try {
            // DB query
            const conn = await client.connect();
            // start transaction
            const sql = `UPDATE experience \
                            SET title = ${experience.title} \
                                note = ${experience.note}
                                url = ${experience.url} \
                            WHERE  experience.id = ${experience.id} \
                            RETURNING *;`
            const update = (await conn.query(sql)).rows[0] as Experience;

            // end transaction
            await client.query("COMMIT")
            conn.release();

            return update;
        } catch(error) {
            throw new Error(`unable to update an experience ${experience.id}: ${(error as Error).message}`);
        }
    }

    static async delete(id: number): Promise<Experience> {
        try {
            const sql = `DELETE FROM apporder WHERE id=${id}`;
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();

            return result.rows[0] as Experience;
        } catch (error) {
            throw new Error(`Could not delete an experience ${id}. Error: ${(error as Error).message}`)
        }
    }
}

