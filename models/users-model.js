import { poolPromise } from '../utils/utils.js'

const executeQuery = async (query, inputParameters = []) => {
  const pool = await poolPromise;
  const request = pool.request();

  inputParameters.forEach((param) => {
    request.input(param.name, param.value);
  });

  try {
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.log("executeQuery Error:", err);
    throw err;
  }
};

export const getUsers = async () => {
    try {
        const inputParameters = [
            {name: "id", value: 1}
        ]

        const query = 'SELECT * FROM users'

        const result = executeQuery(query, [])

        return result
    } catch (err) {
        console.log("getUsers: ", err)
    }
};
