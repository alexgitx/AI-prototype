// Importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
// const { createAct,
//     checkAct,
//     retrieveActPDF,
//     checkDiploma,
//     retrieveDiploma,
//     createActSC,
//     checkActSC,
//     retrieveActPDFSC,
//     checkDiplomaSC,
//     retrieveDiplomaSC } = require("./modules/act.js");
// const { Act, Hash } = require("./models/schemas.js");


// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)
const ads = {title: 'Yo!'};

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

//Mongo connection

var url = "mongodb://admin:J5B3NAzXttzS@172.26.7.117:27017/?authSource=CUN&readPreference=primary&appname=MongoDB%20Compass&ssl=false";
var db_name = "BchainSeguros";
const client = new MongoClient(url);

var jwt = require('jsonwebtoken');

const secretKey = "BchainSeguros-secret";

//Endpoints

module.exports = function (app) {
	
	/**
	 * @swagger
	 * /v0.1/auth/register:
	 *  post:
	 *    summary: Login
	 *    requestBody:
	 *      content:
	 *        application/json:
	 *          schema:
	 *            type: object
	 *            properties:
	 *              username:
	 *                type: string
	 *              password:
	 *                type: string
	 *    responses:
	 *      '201':
	 *        description: Created
	 *      '409':
	 *        description: Alredy exists
	*/
	app.post('/v0.1/auth/register', async (req, res) => {
			const username = req.body.username;
		const password = req.body.password;
		const hashedPassword = await bcrypt.hash(password, 10);
		await client.connect();
		const db = client.db(db_name);
		if (await db.collection('users').findOne({"username": username})) {
			res.status(409).json({ error: 'User already exists' });
			return;
		}
		await db.collection('users').insertOne({
			username: username,
			password: hashedPassword
		});
	
		client.close();
	
		res.json({ message: 'User registered successfully' });
	});
    
	/**
	 * @swagger
	 * /v0.1/auth/login:
	 *  post:
	 *    summary: Login
	 *    requestBody:
	 *      content:
	 *        application/json:
	 *          schema:
	 *            type: object
	 *            properties:
	 *              username:
	 *                type: string
	 *              password:
	 *                type: string
	 *    responses:
	 *      '401':
	 *        description: Invalid username or password
	 *      '200':
	 *        description: Checkout token
	*/
    app.post('/v0.1/auth/login', async (req, res) => {
		var username = req.body.username;
		if (username === undefined) {
			var username = req.body.email;
		}
		const password = req.body.password;
	    await client.connect();
	    const db = client.db(db_name);	
		const user = await db.collection('users').findOne({"username": username});
		if (!user) {
			res.status(401).json({ error: 'Invalid username or password' });
			return;
		}
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			res.status(401).json({ error: 'Invalid username or password' });
			return;
		}
	    const token = jwt.sign({ username: user.username }, secretKey);
		const token_res = {"type": "Bearer", "token": token};
		client.close();
		res.json(token_res);
	});

	// /**
	//  * @swagger
	//  * components:
	//  *   securitySchemes:
    //  *     BearerAuth:
    //  *       type: http
    //  *       scheme: bearer
	//  * /v0.1/act/create:
	//  *  post:
	//  *    summary: Adds new act
	//  *    security:
	//  *      - BearerAuth: []
	//  *    requestBody:
	//  *      content:
	//  *        application/json:
	//  *          schema:
	//  *            type: object
	//  *    responses:
	//  *      '201':
	//  *        description: Created
	//  *      '409':
	//  *        description: Alredy exists
	// */
	// app.post('/v0.1/act/create', verify, async function (req, res) {
	// 	const data = req.body;
	// 		const { error, value } = Act.validate(data);
	// 		if (error) {
	// 			return res.status(400).json({ error: error.details[0].message });
	// 		}
	// 		await client.connect();
	// 		const db = client.db(db_name);
	// 		try {
	// 			created = await createAct(db, data);
	// 			if (created) {
	// 				res.status(201).json(created);	
	// 			} else {
	// 				res.status(409).json(created);
	// 			}
	// 		} catch (err) {
	// 			console.log(err);
	// 			res.status(500).json({ err });
	// 		}
	// });

	// /**
	//  * @swagger
	//  * components:
    //  *   securitySchemes:
    //  *     BearerAuth:
	//  *       type: http
	//  *       scheme: bearer
	//  * /v0.1/act/check:
	//  *  post:
	//  *    summary: Checks act data for modifies
	//  *    security:
	//  *      - BearerAuth: []
	//  *    requestBody:
	//  *      content:
	//  *        application/json:
	//  *          schema:
	//  *            type: object
	//  *            properties:
	//  *              id_curso:
	//  *                type: string
	//  *              hash_act:
	//  *                type: string
	//  *    responses:
	//  *      '200':
	//  *        description: Not modified
	//  *      '404':
	//  *        description: Modified
	//  */
	// app.post('/v0.1/act/check', verify, async function (req, res) {
	// 		const data = req.body;
	// 		await client.connect();
	// 		const db = client.db(db_name);
	// 		try {
	// 			revised = await checkAct(db, data);
	// 			if (!revised) {
	// 				res.status(404).json(revised);	
	// 			} else {
    //                 res.status(200).json(revised);
	// 			}
	// 		} catch (err) {
	// 			console.log(err);
	// 			res.status(500).json({ err });
	// 		}
	// });

	// /**
	//  * @swagger
	//  * components:
    //  *   securitySchemes:
    //  *     BearerAuth:
    //  *       type: http
    //  *       scheme: bearer
	//  * /v0.1/act/retrieve:
	//  *   get:
	//  *     summary: Returns pdf of act if exists
	//  *     security:
	//  *       - BearerAuth: []
	//  *     parameters:
	//  *       - name: hash
	//  *         in: query
	//  *         required: true
	//  *         schema:
	//  *           type: string
	//  *     responses:
	//  *       '200':
	//  *         description: Success
	//  *       '404':
	//  *         description: Act doesn't exist
	// */
	// app.get('/v0.1/act/retrieve', verify, async function (req, res) {
	// 		const data = req.query.hash;
	// 		await client.connect();
	// 		const db = client.db(db_name);
	// 		try {
	// 			revised = await retrieveActPDF(db, data);
	// 			if (revised) {
	// 				res.status(200).json(revised);
	// 			} else {
	// 				res.status(404).json(revised);
	// 			}
	// 		} catch (err) {
	// 			console.log(err);
	// 			res.status(500).json({ err });
	// 		}
	// });

	// /**
	//  * @swagger
	//  * components:
	//  *   securitySchemes:
	//  *     BearerAuth:
	//  *       type: http
	//  *       scheme: bearer
	//  * /v0.1/diploma/retrieve:
	//  *   post:
	//  *     summary: Returns pdf of diploma if exists
	//  *     security:
    //  *       - BearerAuth: []
	//  *     requestBody:
	//  *       content:
	//  *         application/json:
	//  *           schema:
	//  *             type: object
	//  *             properties:
	//  *               cod_tipo_documento:
	//  *                 type: string
	//  *               numero_documento:
	//  *                 type: string
	//  *               id_curso:
	//  *                 type: string
	//  *               id_expediente:
	//  *                 type: number
	//  *               hash_expediente:
	//  *                 type: string
	//  *     responses:
	//  *       '200':
	//  *         description: Success
	//  *       '404':
	//  *         description: Diploma doesn't exist
	// */
	// app.post('/v0.1/diploma/retrieve', verify, async function (req, res) {
	// 	const data = req.body;
	// 	await client.connect();
	// 	const db = client.db(db_name);
	// 	try {
	// 		revised = await retrieveDiploma(db, data);
	// 		if (revised) {
	// 			res.status(200).json(revised);
	// 		} else {
	// 			res.status(404).json(revised);
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 		res.status(500).json({ err });
	// 	}
	// });

	// /**
	//  * @swagger
	//  * components:
    //  *   securitySchemes:
    //  *     BearerAuth:
    //  *       type: http
    //  *       scheme: bearer
	//  * /v0.1/diploma/check:
	//  *   get:
	//  *     summary: Checks diploma data for modifies
	//  *     security:
	//  *       - BearerAuth: []
	//  *     parameters:
	//  *       - name: hash
	//  *         in: query
	//  *         required: true
	//  *         schema:
	//  *           type: string
	//  *     responses:
	//  *       '200':
	//  *         description: Not modified
	//  *       '404':
	//  *         description: Modified
	//  */
	// app.get('/v0.1/diploma/check', verify, async function (req, res) {
	// 	const data = req.query.hash;
	// 	await client.connect();
	// 	const db = client.db(db_name);
	// 	try {
	// 		revised = await checkDiploma(db, data);
	// 		if (revised) {
	// 			res.status(200).json(revised);
	// 		} else {
    //             res.status(404).json(revised);
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 		res.status(500).json({ err });
	// 	}
	// });

///////////////////////////////////// SMARTCONTRACT ///////////////////////////////////////

	// /**
	//  * @swagger
	//  * components:
    //  *   securitySchemes:
    //  *     BearerAuth:
    //  *       type: http
    //  *       scheme: bearer
	//  * /v0.2/act/create:
	//  *  post:
	//  *    summary: Adds new act
	//  *    security:
    //  *      - BearerAuth: []
	//  *    requestBody:
	//  *      content:
	//  *        application/json:
	//  *          schema:
	//  *            type: object
	//  *    responses:
	//  *      '201':
	//  *        description: Created
	//  *      '409':
	//  *        description: Alredy exists
	//  */
	// app.post('/v0.2/act/create', verify, async function (req, res) {
	// 	const data = req.body;
	// 	const { error, value } = Act.validate(data);
	// 	if (error) {
	// 		return res.status(400).json({ error: error.details[0].message });
	// 	}
	// 	try {
	// 		created = await createActSC(data);
	// 		if (created) {
	// 			res.status(201).json(created);	
	// 		} else {
	// 			res.status(409).json(created);
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 		res.status(500).json({ err });
	// 	}
	// });

	// /**
	//  * @swagger
	//  * components:
	//  *   securitySchemes:
	//  *     BearerAuth:
	//  *       type: http
	//  *       scheme: bearer
	//  * /v0.2/act/check:
	//  *  post:
	//  *    summary: Checks act data for modifies
	//  *    security:
	//  *      - BearerAuth: []
	//  *    requestBody:
	//  *      content:
	//  *        application/json:
	//  *          schema:
	//  *            type: object
	//  *            properties:
	//  *              id_curso:
	//  *                type: string
	//  *              hash:
	//  *                type: string
	//  *    responses:
	//  *      '200':
	//  *        description: response "true" means modified othervise response "false" means not modified
	//  */
	// app.post('/v0.2/act/check', verify, async function (req, res) {
	// 	const data = req.body;
	// 	try {
	// 		revised = await checkActSC(data);
	// 		res.status(200).json(revised);
	// 	} catch (err) {
	// 		console.log(err);
	// 		res.status(500).json({ err });
	// }
	// });

	// /**
	//  * @swagger
	//  * components:
    //  *   securitySchemes:
    //  *     BearerAuth:
    //  *       type: http
    //  *       scheme: bearer
	//  * /v0.2/act/retrieve:
	//  *   get:
	//  *     summary: Returns pdf of act if exists
	//  *     security:
    //  *       - BearerAuth: []
	//  *     parameters:
	//  *       - name: hash
	//  *         in: query
	//  *         required: true
	//  *         schema:
	//  *           type: string
	//  *     responses:
	//  *       '200':
	//  *         description: Success
	//  *       '404':
	//  *         description: Act doesn't exist
	//  */
	// app.get('/v0.2/act/retrieve', verify, async function (req, res) {
	// 	const data = req.query.hash;
	// 	try {
	// 		revised = await retrieveActPDFSC(data);
	// 		if (revised) {
	// 			res.status(200).json(revised);
	// 		} else {
	// 			res.status(404).json(revised);
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 		res.status(500).json({ err });
	// 	}
	// });

	// /**
	//  * @swagger
	//  * components:
	//  *   securitySchemes:
	//  *     BearerAuth:
	//  *       type: http
	//  *       scheme: bearer
	//  * /v0.2/diploma/retrieve:
	//  *   post:
	//  *     summary: Returns pdf of diploma if exists
	//  *     security:
	//  *       - BearerAuth: []
	//  *     requestBody:
	//  *       content:
	//  *         application/json:
	//  *           schema:
	//  *             type: object
	//  *             properties:
	//  *               cod_tipo_documento:
	//  *                 type: string
	//  *               numero_documento:
	//  *                 type: string
	//  *               id_curso:
	//  *                 type: string
	//  *               id_expediente:
	//  *                 type: number
	//  *               hash_expediente:
	//  *                 type: string
	//  *     responses:
	//  *       '200':
	//  *         description: Success
	//  *       '404':
	//  *         description: Diploma doesn't exist
	//  */
	// app.post('/v0.2/diploma/retrieve', verify, async function (req, res) {
	// 	const data = req.body;
	// 	try {
	// 		revised = await retrieveDiplomaSC(data);
	// 		if (revised) {
	// 			res.status(200).json(revised);
	// 		} else {
	// 			res.status(404).json(revised);
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 		res.status(500).json({ err });
	// }
	// });

	// /**
	//  * @swagger
	//  * components:
	//  *   securitySchemes:
	//  *     BearerAuth:
	//  *       type: http
	//  *       scheme: bearer
	//  * /v0.2/diploma/check:
	//  *   get:
	//  *     summary: Checks diploma data for modifies
	//  *     security:
	//  *       - BearerAuth: []
	//  *     parameters:
	//  *       - name: hash
	//  *         in: query
	//  *         required: true
	//  *         schema:
	//  *           type: string
	//  *     responses:
	//  *       '200':
	//  *         description: response "true" means modified othervise response "false" means not modified
	//  */
	// app.get('/v0.2/diploma/check', verify, async function (req, res) {
	// 	const data = req.query.hash;
	// 	try {
	// 		revised = await checkDiplomaSC(data);
	// 		res.status(200).json(revised);
	// 	} catch (err) {
	// 		console.log(err);
	// 		res.status(500).json({ err });
	// }
	// });

/////////////////////////////////// SMARTCONTRACT END /////////////////////////////////////
	

}

function verify(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
}
