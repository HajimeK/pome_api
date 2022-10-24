import client from '../database';


export type Tag = {
    id: number, // -1 if not assigned in DB
    tag: string
};


export class ModelTag {

    static async list(): Promise<Tag[]> {
        try {
            // Generate SQL query
            const sql = 'SELECT * FROM tag';
            const conn = await client.connect();
            const tags = (await conn.query(sql)).rows as Tag[];
            conn.release();

            return tags;
        } catch (error) {
            throw new Error(`Could not get products. Error: ${(error as Error).message}`);
        }
    }

    static async get(tag: string): Promise<Tag> {
        try {
            const sql = `SELECT * FROM Tag WHERE tag='${tag}';`;
            const conn = await client.connect();
            const Tag = (await conn.query(sql)).rows[0] as Tag;
            conn.release();

            return Tag;
        } catch (error) {
            throw new Error(`Could not find Tag ${tag}. Error: ${(error as Error).message}`);
        }
    }


    static async create(tag: string): Promise<Tag> {
        try {
            const sql = `INSERT INTO Tag (tag) VALUES('${tag}') RETURNING *;`;
            const conn = await client.connect();
            const result = (await conn.query(sql)).rows[0] as Tag;
            conn.release();

            return result;
        } catch (error) {
            throw new Error(`Could not add new Tag ${tag}. Error: ${(error as Error).message}`)
        }
    }

    static async delete(tag: string): Promise<Tag> {
        try {
            const sql = `DELETE FROM tag WHERE tag='${tag}' RETURNING *`;
            const tagid = (await ModelTag.get(tag)).id;
            const sqlrelexptag = `DELETE FROM relexptag WHERE tag=${tagid}`;

            const conn = await client.connect();
            await conn.query(sqlrelexptag);
            const result = await conn.query(sql);
            conn.release();

            return result.rows[0] as Tag;
        } catch (error) {
            throw new Error(`Could not delete Tag ${tag}. Error: ${(error as Error).message}`);
        }
    }
}