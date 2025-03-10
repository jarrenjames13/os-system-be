import sql from "mssql";
import { poolPromise } from "../utils/utils.js";

const companies = [
    { value: 'CMDI', label: 'Centro Maryland' },
    { value: 'MLDI', label: 'Maryland' },
    { value: 'MDI', label: 'Monheim' },
    { value: 'RDI', label: 'Rheinland' },
];

const insertCompanies = async () => {
    try {
        const pool = await poolPromise;

        for (const company of companies) {
            const request = pool.request();
            const query = `INSERT INTO companies (COMPANY_NAME, COMPANY) VALUES (@label, @value)`;
            request.input('label', sql.NVarChar, company.label);
            request.input('value', sql.NVarChar, company.value);
            await request.query(query);
        }

        console.log('Companies inserted successfully');
    } catch (error) {
        console.error('Error inserting companies:', error);
    }
};

insertCompanies();