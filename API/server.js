'use strict';

// Framework express
var express = require('express');
var app = express();

// REQUEST AND CONNECTION PARAMETERS
var request = require('request');
var http = require('http');
var bodyParser = require('body-parser');
var cors = require('cors');
var swaggerJsDoc =require ('swagger-jsdoc');
const swaggerUi=require('swagger-ui-express');
// CONFIGURE APP
const swaggerOptions={
    swaggerDefinition:{
        openapi: '3.0.0',
        info:{
            title:'BchainSeguros API',
            description:'The BchainSeguros project swagger',
            contact:{
                name:'Cibernos'
            },
            servers:['http://0.0.0.0:8080']
        }
    },
    apis:['API/src/routes.js']
};
const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.set('rest', request);


app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static('public'));
app.use(cors({
    origin: '*'
}));

// ROUTES
require("./src/routes")(app);

// RUN SERVER
const PORT = 8080;
http.createServer({}, app)
	.listen(PORT, function () {
        console.log("Server active on port: ", PORT);
    })

