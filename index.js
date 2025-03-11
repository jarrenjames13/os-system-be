import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';

import userRoutes from './routes/user-routes.js'
import cartRoutes from './routes/cart-routes.js'

const app = express();

const PORT = process.env.PORT;

app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(userRoutes)
app.use(cartRoutes)

app.get('/', (req, res) => {
    return res.send('If you see this message. API IS WORKING!!')
});

app.listen(PORT, () => {
    console.log(`Server is now running in PORT:\t\t ${PORT}`)
});