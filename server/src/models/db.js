const mariadb = require('mariadb');

const pool = mariadb.createPool({
     /* host: process.env.IP_LOCAL,
     port: process.env.PORT_BDD,
     user: process.env.UTILISATEUR_BDD,
     password: process.env.MOT_DE_PASSE_BDD,
     database : process.env.NOM_BDD, */
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'coucou123',
    database: 'pluma',
     connectionLimit: 5
});

module.exports = {
    pool,
    async query(sql, values) {
        let conn;
        try {
            conn = await pool.getConnection();
            return await conn.query(sql, values);
        } catch (err) {
	    console.log('IP_LOCAL:', process.env.IP_LOCAL);
            throw err;
        } finally {
            if (conn) await conn.end();
        }
    }
}
