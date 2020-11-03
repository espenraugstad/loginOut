const pg = require('pg');

class Storage {

    constructor(credentials){
        this.credentials = {
            connectionString: credentials,
            ssl: {
                rejectUnauthorized: false
            }
        };
    }

    async createUser(username, password){
        const client = new pg.Client(this.credentials);

        try {
            await client.connect();
            
            const query = {
                text: 'INSERT INTO public.users (id, username, password) VALUES (DEFAULT, $1, $2);',
                values: [username, password]
            }

            try {

                let res = await client.query(query);
                console.log(res);

            } catch (err){
                console.log(`Create user error: ${err}`);
            }

        } catch (err){
            console.log(`Connection error: ${err}`);
        }
    }

}

module.exports = Storage;