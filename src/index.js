/** @format */

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";

import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";

const app = express();

app.use(express.json());

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

const jwtConfig = {
  secret: jwtSecret,
  expiresIn: "1h",
};

app.listen(3000, () =>
  console.log("Application running on http://localhost:3000")
);

const USERS = [];

const userSchema = yup.object().shape({
  username: yup.string().required(),
  age: yup.number().required().positive().integer(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const bodyValidate = (userSchema) => async (req, res, next) => {
  const data = req.body;

  try {
    await userSchema.validate(data);
    next();
  } catch (err) {
    res.status(422).json({ message: err.errors.join(", ") });
  }
};

const usernameOrEmailAlreadyExists = (req, res, next) => {
  const { username, email } = req.body;

  const userFound = USERS.find((user) => user.username == username);
  const emailFound = USERS.find((user) => user.email == email);

  if (userFound) {
    return res
      .status(422)
      .json({ message: `Username ${username} already exists on database!` });
  }
  if (emailFound) {
    return res
      .status(422)
      .json({ message: `Email ${email} already exists on database!` });
  } else return next();
};

const authUser = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = USERS.find((user) => user.username == decoded.username);

    req.user = user;
  });

  return next();
};

const verifyUserToChangePassword = (req, res, next) => {
  const { uuid } = req.params;
  const { user } = req;

  uuid != user.uuid
    ? res.status(403).json({ message: "Permission denied" })
    : next();
};

app.post(
  "/signup",
  bodyValidate(userSchema),
  usernameOrEmailAlreadyExists,
  async (req, res) => {
    try {
      const { password, email, age, username } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const userSerializer = {
        uuid: uuidv4(),
        createdOn: new Date(),
        email: email,
        age: age,
        username: username,
      };

      const userWithPassword = { ...userSerializer, password: hashedPassword };

      USERS.push(userWithPassword);

      res.status(201).json(userSerializer);
    } catch (err) {
      res.status(422).json({ message: "Error while creating an user" });
    }
  }
);

app.get("/users", authUser, (req, res) => {
  res.status(200).json(USERS);
});

app.put(
  "/users/:uuid/password",
  authUser,
  verifyUserToChangePassword,
  async (req, res) => {
    try {
      const { user } = req;
      const { password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
    } catch (err) {
      res.status(400).json({ message: "Something went wrong" });
    }

    res.status(204).json("");
  }
);

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = USERS.find((user) => user.username == username);

  try {
    const match = await bcrypt.compare(password, user.password);

    const token = jwt.sign(
      {
        username: username,
        password: user.password,
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    match
      ? res.status(200).json({ token: token })
      : res.status(401).json({ message: "Invalid Credentials" });
  } catch (err) {
    res.status(401).json({ message: "Invalid Credentials" });
  }
});
