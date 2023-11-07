var jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
	try {
		const token = req.header('Authorization').split(' ')[1];
		if (!token) {
			res.status(401).send('Acceso denegado');
		} else {
			const verified = jwt.verify(token, process.env.JWT_KEY);
			req.user = verified;
			next();
		}
	} catch (error) {
		res.status(400).send('Token inválido');
	}
}
