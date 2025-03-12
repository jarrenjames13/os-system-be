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
    try {
        const { invt_id } = req.query

        const prices = await getPrices(invt_id)

        res.json(prices)
    } catch (err) {
        console.log(err)
        throw err
    }
};