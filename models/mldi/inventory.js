import { poolPromise as poolPromiseCMDI } from "../../utils/cmdi/utils.js";
import { poolPromise as poolPromiseMLDI } from "../../utils/mldi/utils.js";
import { poolPromise as poolPromiseMDI } from "../../utils/mdi/utils.js";

const executeQuery = async (query, inputParameters = [], poolPromise) => {
    const pool = await poolPromise;
    const request = pool.request();

    inputParameters.forEach(param => {
        request.input(param.name, param.value);
    });

    try {
        const result = await request.query(query);
        return result;
    } catch (err) {
        console.log("executeQuery Error:", err);
        throw err;
    }
}

export const getInventory = async (company) => {
  try {
    let query;
    let poolPromise;

    switch (company) {
      case "CMDI":
        query = `
          SELECT LTRIM(RTRIM(InvtID)) AS invt_id, LTRIM(RTRIM(prod_desc)) AS descr, 
          LTRIM(RTRIM(ClassID)) AS class_id FROM a_inventory WHERE   ClassID 
          IN (SELECT LTRIM(RTRIM(ClassID)) FROM ProductClass )`;
        poolPromise = poolPromiseCMDI;
        break;
      case "MLDI":
        query = `
          SELECT DISTINCT LTRIM(RTRIM(CatalogNbr)) AS catalog_nbr, LTRIM(RTRIM(InvtID)) AS invt_id, LTRIM(RTRIM(Descr)) AS descr, 
          LTRIM(RTRIM(ClassID)) AS class_id FROM a_inventory_salesprice WHERE CatalogNbr IS NOT NULL AND ClassID 
          IN (SELECT LTRIM(RTRIM(ClassID)) FROM ProductClass WHERE DfltInvtSub LIKE '1%' AND ClassID NOT IN ('COC','CPI','EPDI','GFI','GFSI','GNPI','GOO','HIM','MJN','NKC','OLE','PCPPI','PRO','RBH','SCA','SMPC','SYM','THA','UNB')) 
          AND CatalogNbr = 'osa'`;
        poolPromise = poolPromiseMLDI;
        break;
      case "RDI":
        query = `
          SELECT DISTINCT LTRIM(RTRIM(CatalogNbr)) AS catalog_nbr, LTRIM(RTRIM(InvtID)) AS invt_id, LTRIM(RTRIM(Descr)) AS descr, 
          LTRIM(RTRIM(ClassID)) AS class_id FROM a_inventory_salesprice WHERE CatalogNbr IS NOT NULL AND ClassID 
          IN (SELECT LTRIM(RTRIM(ClassID)) FROM ProductClass WHERE DfltInvtSub LIKE '2%' AND ClassID NOT IN ('COC','CPI','EPDI','GFI','GFSI','GNPI','GOO','HIM','MJN','NKC','OLE','PCPPI','PRO','RBH','SCA','SMPC','SYM','THA','UNB')) 
          AND CatalogNbr = 'osa'`;
        poolPromise = poolPromiseMLDI;
        break;
      case "MDI":
        query = `
          SELECT DISTINCT LTRIM(RTRIM(InvtID)) AS invt_id, LTRIM(RTRIM(Descr)) AS descr, LTRIM(RTRIM(SelectFld2)) AS class_id
          FROM a_inventory_salesprice WHERE CatalogNbr IS NOT NULL `;
        poolPromise = poolPromiseMDI;
        break;
      default:
        throw new Error("Invalid company");
    }


    const query_result = await executeQuery(query, [], poolPromise);

    return query_result?.recordset || [];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getPrices = async (invt_id, company) => {
  try {
    const parameters = [{ name: "invt_id", value: invt_id }];
    let query;
    let poolPromise;

    switch (company) {
      case "CMDI":
        query = `SELECT LTRIM(RTRIM(CatalogNbr)) AS catalog_nbr, LTRIM(RTRIM(InvtID)) as invt_id, LTRIM(RTRIM(SlsUnit)) as uom, 
         LTRIM(RTRIM(DiscPrice)) as price from a_inventory_ WHERE CatalogNbr = 'OSA' AND InvtID = @invt_id AND CatalogNbr IS NOT NULL`;
        break;
      case "MLDI":
      case "RDI":
        query = `SELECT LTRIM(RTRIM(CatalogNbr)) AS catalog_nbr, LTRIM(RTRIM(InvtID)) as invt_id, LTRIM(RTRIM(SlsUnit)) as uom, 
         LTRIM(RTRIM(DiscPrice)) as price from a_inventory_salesprice WHERE CatalogNbr = 'OSA' AND InvtID = @invt_id AND CatalogNbr IS NOT NULL`;
        poolPromise = poolPromiseMLDI;
        break;
      case "MDI":
        query = `SELECT  LTRIM(RTRIM(InvtID)) as invt_id, LTRIM(RTRIM(SlsUnit)) as uom, 
         LTRIM(RTRIM(DiscPrice)) as price from a_inventory_salesprice WHERE InvtID = @invt_id AND CatalogNbr IS NOT NULL`;
        poolPromise = poolPromiseMDI;
        break;
      default:
        throw new Error("Invalid company");
    }

    const result = await executeQuery(query, parameters, poolPromise);

    return result?.recordset || [];
  } catch (err) {
    console.log(err);
    throw err;
  }
};