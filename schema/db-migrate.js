import sql from "mssql";
import { poolPromise } from "../utils/utils.js";

const tables = [
    // {
    //     name: "companies",
    //     columns: [
    //         { name: "id", type: "int identity(1,1) PRIMARY KEY", isNullable: false },
    //         { name: "COMPANY_NAME", type: "nvarchar(MAX)", isNullable: false },
    //         { name: "COMPANY", type: "nvarchar(MAX)", isNullable: false },
    //     ],
    // },
    // {
    //     name: "users",
    //     columns: [
    //       { name: "ID", type: "int identity(1,1) PRIMARY KEY", isNullable: false },
    //       { name: "EMPID", type: "nvarchar(MAX)", isNullable: false },
    //       { name: "FNAME", type: "nvarchar(MAX)", isNullable: false },
    //       { name: "LNAME", type: "nvarchar(MAX)", isNullable: false },
    //       { name: "EMAIL", type: "nvarchar(MAX)", isNullable: false },
    //       { name: "PASSWORD", type: "nvarchar(MAX)", isNullable: false },
    //       { name: "DATE_CREATED", type: "nvarchar(MAX)", isNullable: false },
    //       { name: "STATUS", type: "nvarchar(MAX)", isNullable: false },
    //       { name: "AUTHORITY", type: "int", isNullable: false },
    //       { name: "DEPARTMENT", type: "nvarchar(MAX)", isNullable: false },
    //     ],
    //   },
{
        name: "cart",
        columns: [
            { name: "id", type: "int identity(1,1) PRIMARY KEY", isNullable: false }, // ✅ Auto-increment ID
            { name: "date", type: "datetime", isNullable: false, default: "GETDATE()" }, // ✅ Default timestamp
            { name: "empId", type: "nvarchar(50)", isNullable: false }, // ✅ Match EMPID from token
            { name: "invt_id", type: "nvarchar(50)", isNullable: false }, // ✅ Match inventory ID
            { name: "descr", type: "nvarchar(255)", isNullable: false }, // ✅ Match item description
            { name: "uom", type: "nvarchar(50)", isNullable: false }, // ✅ Match unit of measure
            { name: "quantity", type: "int", isNullable: false, default: 0 }, // ✅ Default quantity
        ]
}
];

const views = [
//     {
//         name: "orders_items_disc",
//         query: `SELECT     oi.id, oi.date, oi.slsper_id, oi.cust_id, oi.cust_name, oi.company, oi.shipto_id, oi.ship_name, oi.price_class, oi.principal, oi.invt_id, oi.item_name, oi.uom, oi.qty, oi.price, oi.total, oi.ref_num, 
//                       xdh.TotDisc AS tot_disc, inv.ProdMgrID AS prodmgr_id
// FROM         dbo.orders_items AS oi LEFT OUTER JOIN
//                       solomon.MLDIAPP.dbo.Inventory AS inv ON oi.invt_id = inv.InvtID LEFT OUTER JOIN
//                       solomon.MLDIAPP.dbo.xDiscMatrixHeader AS xdh ON oi.principal = xdh.Principal AND oi.cust_id = xdh.CustID AND xdh.SubClass = inv.ProdMgrID`,
//     },
];

// Function to check if a table exists
// const doesTableExist = async (tableName) => {
//     try {
//         const pool = await poolPromise;
//         const result = await pool
//             .request()
//             .query(`SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'${tableName}'`);
//         return result.recordset.length > 0;
//     } catch (error) {
//         console.error(`Error checking if the table ${tableName} exists:`, error);
//         return false;
//     }
// };

const createTable = async (tableName, columns) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        // Drop the table if it exists
        await request.query(`IF OBJECT_ID('${tableName}', 'U') IS NOT NULL DROP TABLE ${tableName}`);

        // Create the table
        const columnsDefinition = columns
            .map((col) => `${col.name} ${col.type} ${col.isNullable ? 'NULL' : 'NOT NULL'}`)
            .join(', ');

        const createTableQuery = `CREATE TABLE ${tableName} (${columnsDefinition})`;

        await request.query(createTableQuery);

        console.log(`Table ${tableName} created successfully`);
    } catch (error) {
        console.error(`Error creating table ${tableName}:`, error);
    }
};

// Function to create a table (and drop if it exists)
const createTableIfNotExists = async (tableName, columns) => {
    try {
        // const tableExists = await doesTableExist(tableName);

        // if (!tableExists) {
        await createTable(tableName, columns);
        // } else {
        //   console.log(`Table ${tableName} already exists`);
        // }
    } catch (error) {
        console.error(`Error creating or dropping table ${tableName}:`, error);
    }
};

// Function to create a view (and drop if it exists)
const createView = async (viewName, query) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        // Drop the view if it exists
        await request.query(`IF OBJECT_ID('${viewName}', 'V') IS NOT NULL DROP VIEW ${viewName}`);

        // Create the view
        const createViewQuery = `CREATE VIEW ${viewName} AS ${query}`;

        await request.query(createViewQuery);

        console.log(`View ${viewName} created successfully`);
    } catch (error) {
        console.error(`Error creating or dropping view ${viewName}:`, error);
    }
};

// Function to create a view (and drop if it exists)
const createViewIfNotExists = async (viewName, query) => {
    try {
        const viewExists = await doesViewExist(viewName);

        if (!viewExists) {
            await createView(viewName, query);
        } else {
            console.log(`View ${viewName} already exists`);
        }
    } catch (error) {
        console.error(`Error creating or dropping view ${viewName}:`, error);
    }
};

// Function to check if a view exists
const doesViewExist = async (viewName) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query(`SELECT 1 FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = N'${viewName}'`);

        return result.recordset.length > 0;
    } catch (error) {
        console.error(`Error checking if the view ${viewName} exists:`, error);
        return false;
    }
};

// Create tables
tables.forEach(async (table) => {
    await createTableIfNotExists(table.name, table.columns);
});

// Create views
views.forEach(async (view) => {
    await createViewIfNotExists(view.name, view.query);
});

// Close the connection pool
sql.close();