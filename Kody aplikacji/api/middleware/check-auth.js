// sprawdzenie autoryzacji & uprawnień
// package.json --> "echo \"Error: no test specified\" && exit 1" poprzedni test
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        //jesli sukces zwróci decoded
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authorization failed'
        });
    }
};