// server.js
import { create, router as _router, defaults, bodyParser } from "json-server";
import { sign, verify } from "jsonwebtoken";
const server = create();
const router = _router("db.json");
const middlewares = defaults();

const SECRET_KEY = "your-secret-key";
const expiresIn = "1h";

server.use(middlewares);
server.use(bodyParser);

// Génération d'un JWT
function createToken(payload) {
	return sign(payload, SECRET_KEY, { expiresIn });
}

// Vérification d'un JWT
function verifyToken(token) {
	return verify(token, SECRET_KEY, (err, decode) =>
		decode !== undefined ? decode : err
	);
}

// Connexion
server.post("/login", (req, res) => {
	const { username, password } = req.body;
	const user = router.db.get("users").find({ username, password }).value();

	if (!user) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	const accessToken = createToken({ username });
	const refreshToken = createToken({ username });

	router.db.get("users").find({ username }).assign({ refreshToken }).write();

	return res.status(200).json({ user, accessToken, refreshToken });
});

// Rafraîchissement du token
server.post("/refresh", (req, res) => {
	const { refreshToken } = req.body;
	if (!refreshToken) {
		return res.status(403).json({ message: "Refresh token is required" });
	}

	const decodedToken = verifyToken(refreshToken);
	if (decodedToken instanceof Error) {
		return res.status(403).json({ message: "Invalid refresh token" });
	}

	const user = router.db
		.get("users")
		.find({ username: decodedToken.username })
		.value();
	if (user.refreshToken !== refreshToken) {
		return res.status(403).json({ message: "Invalid refresh token" });
	}

	const newAccessToken = createToken({ username: decodedToken.username });

	return res.status(200).json({ accessToken: newAccessToken });
});

// Vérification du token d'accès
server.use(/^(?!\/login|\/refresh).*$/, (req, res, next) => {
	if (
		req.headers.authorization === undefined ||
		req.headers.authorization.split(" ")[0] !== "Bearer"
	) {
		return res
			.status(401)
			.json({ message: "Authorization header missing" });
	}

	try {
		const token = req.headers.authorization.split(" ")[1];
		verifyToken(token);
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid token" });
	}
});

// Utilisation de routes par défaut
server.use(router);

server.listen(3000, () => {
	console.log("JSON Server is running on http://localhost:3000");
});
