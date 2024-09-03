const {
  authenticate,
  signup,
  retrieveuseridfromusername,
} = require("../services/authService");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const retrieveusernameController = async (req, res) => {
  const { user_id } = req.query;

  const result = await retrieveuseridfromusername(user_id);

  if (result.status === 200) {
    const user = result.user;
    return res.status(200).json({ message: result.message, user });
  }
  res.status(401).json({ message: "Unauthorized" });
};

const authenticateController = async (req, res) => {
  const { user } = req.body;
  if (!user) {
    return res.status(401).json({ message: "missing data" });
  }
  const result = await authenticate(user);

  if (result.status === 200) {
    const token = jwt.sign(
      { userId: result?.user?.client_id },
      process.env.SECRET_KEY,
      { expiresIn: "50m" }
    );

    return res
      .status(200)
      .json({ message: result.message, user: result.user, token: token });
  }
  res.status(401).json({ message: "Unauthorized" });
};

const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "missing data" });
  }

  try {
    const result = await signup({
      name,
      email,
      password,
    });

    if (result.status === 200) {
      const token = jwt.sign(
        { userId: result.user.client_id },
        process.env.SECRET_KEY,
        { expiresIn: "50m" }
      );
      return res
        .status(200)
        .json({ message: result.message, user: result.user, token: token });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  authenticateController,
  retrieveusernameController,
  registerController,
};
