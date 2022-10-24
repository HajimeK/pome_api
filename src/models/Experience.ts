import client from '../database';
import { ModelTag } from './tag';

export type Experience = {
    id: number, // -1 if not assigned in DB
    title: string,
    note: string,
    urle: string
};

export type ExperienceBody = {
    experience: Experience,
    tags: string[]
};

export class ModelExperience {

    static async list(tagName?: string): Promise<Experience[]> {
        try {
            // Generate SQL query
            let sql = '';
            if(tagName!== undefined) {
                sql = `SELECT experience.id, experience.title, experience.note, experience.urle \
                        FROM experience \
                        JOIN relexptag ON experience.id=relexptag.experience \
                        JOIN tag  ON relexptag.tag=tag.id \
                        WHERE tag.tag='${tagName}';`;
            } else {
                sql = `SELECT * FROM experience`;
            }
            const conn = await client.connect();
            const experiences = (await conn.query(sql)).rows as Experience[];
            conn.release();

            return experiences;
        } catch (error) {
            throw new Error(`Could not get experiences. Error: ${(error as Error).message}`);
        }
    }

    static async get(id: number): Promise<Experience> {
        try {
            const sql = `SELECT * FROM experience where id=${id}`;
            // request to DB
            const conn = await client.connect();
            const experience = (await conn.query(sql)).rows[0] as Experience;
            conn.release();

            return experience;
        } catch (error) {
            throw new Error(`Could not get the experiencs. Error: ${(error as Error).message}`);
        }
    }

    static async create(experience: Experience, tags?: string[]): Promise<Experience> {
        try {
            const url: string = '$$' + experience.urle + '$$';
            // DB query
            const conn = await client.connect();
            // Create an experience
            const sql = `INSERT INTO experience (title, note, urle) \
                                VALUES('${experience.title}', '${experience.note}', ${url} ) RETURNING *`;
            const result = (await conn.query(sql)).rows[0] as Experience;
            if (tags !== undefined) {
                for(const tag of tags) {
                    const tagid = (await ModelTag.get(tag)).id;
                    await conn.query(`INSERT INTO relexptag (experience, tag) \
                                    VALUES(${result.id}, ${tagid})`);
                }
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
            const url: string = '$$' + experience.urle + '$$';
            // DB query
            const conn = await client.connect();
            // start transaction
            const sql = `UPDATE experience \
                            SET title = '${experience.title}', \
                                note = '${experience.note}', \
                                urle = ${url} \
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
            const conn = await client.connect();
            const sqlreleexp = `DELETE FROM relexptag WHERE experience=${id}`;
            await conn.query(sqlreleexp);
            const sqlexp = `DELETE FROM experience WHERE id=${id}`;
            const result = await conn.query(sqlexp);
            conn.release();

            return result.rows[0] as Experience;
        } catch (error) {
            throw new Error(`Could not delete an experience ${id}. Error: ${(error as Error).message}`)
        }
    }
}

