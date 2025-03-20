import { getInventory, getPrices } from "../../models/mldi/inventory.js";

export const getInventory_Cont = async (req, res) => {
    try {
        const { company } = req.query;

        const inventory = await getInventory(company);

        res.json(inventory);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
};

export const getPrices_Cont = async (req, res) => {
    console.log("invt_id", req.query);
    try {
        const { invt_id, company } = req.query;

        const prices = await getPrices(invt_id, company);

        res.json(prices);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
};