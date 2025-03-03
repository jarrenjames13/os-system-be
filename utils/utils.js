import sql from "mssql";
import { password, server, user, database } from "./dbcreds.js";

const dbConfig = {
    user,
    password,
    requestTimeout: 30000,
    cryptoCredentialsDetails: {
        minVersion: 'TLSv1'
    },
    options: {
        trustedConnection: true,
        encrypt: false
    },
    server,
    database,
};

export const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log(`Connected to MDISERVER-L os-monheim database at: ${server}`);
        return pool;
    })
    .catch(err => {
        console.error("Database connection error", err);
        throw err;
    });