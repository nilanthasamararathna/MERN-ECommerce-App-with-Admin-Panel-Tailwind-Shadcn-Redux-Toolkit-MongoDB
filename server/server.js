const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// create a database connection -> You also can create a seperate file 
// for this and then import/use that file here

mongoose.connect('mongodb+srv://nilantha33:NmZotnoRM1lbIOkQ@cluster0.m2hlp.mongodb.net/')
.then(() => console.log('MongoDB Connected'))
.catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({

        origin: 'http://localhost:5173/',
        methode: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders:[
            'Conten-Type',
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials: true
    })
);

 app.use(cookieParser());
 app.use(express.json());

  app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`))