// import { poolPromise } from "../../utils/mdi/utils";

// const executeQuery = async (query, inputParameters = []) => {
//   const pool = await poolPromise;
//   const request = pool.request();

//   inputParameters.forEach((param) => {
//     request.input(param.name, param.value);
//   });

//   try {
//     const result = await request.query(query);
//     return result;
//   } catch (err) {
//     console.log("executeQuery Error:", err);
//     throw err;
//   }
// };

// export const getInventory = async (company) => {
//   try {
//     let query;

//     if (company === "MDI") {
//       query = `
//         SELECT DISTINCT LTRIM(RTRIM(CatalogNbr)) AS catalog_nbr, LTRIM(RTRIM(InvtID)) AS invt_id, LTRIM(RTRIM(Descr)) AS descr, 
//         LTRIM(RTRIM(ClassID)) AS class_id FROM a_inventory_salesprice WHERE CatalogNbr IS NOT NULL AND ClassID 
//         IN (SELECT LTRIM(RTRIM(ClassID)) FROM ProductClass WHERE CatalogNbr = 'osa' `;
//     }

//     const query_result = await executeQuery(query, []);

//     return query_result?.recordset || [];
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

// export const getPrices = async (invt_id) => {
//   try {
//     const parameters = [{ name: "invt_id", value: invt_id }];
//     const query = `SELECT LTRIM(RTRIM(CatalogNbr)) AS catalog_nbr, LTRIM(RTRIM(InvtID)) as invt_id, LTRIM(RTRIM(SlsUnit)) as uom, 
//          LTRIM(RTRIM(DiscPrice)) as price from a_inventory_salesprice WHERE CatalogNbr = 'OSA' AND InvtID = @invt_id AND CatalogNbr IS NOT NULL`;

//     const result = await executeQuery(query, parameters);

//     return result?.recordset || [];
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };
