const UserModel = require('../models/user')
const { userErrors } = require("../constants/errorMessages");

// POST /users/login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username?.trim() || !password?.trim())
    return res.status(400).json({ error: userErrors.MISSING_CREDENTIALS });

  try {
    const user = await UserModel.login({ username, password });

    if (!user)
      return res.status(404).json({ error: userErrors.INVALID_CREDENTIALS });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: userErrors.LOGIN_ERROR });
  }
}

// GET /users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: userErrors.FIND_ALL_ERROR });
  }
}

// POST /users
exports.createUser = async (req, res) => {
  const { username, password, type } = req.body;

  if (!username?.trim() || !password?.trim() || type == null)
    return res.status(400).json({ error: userErrors.MISSING_CREATE_DATA });

  if (!(type >= 0 && type <= 2))
    return res.status(400).json({ error: userErrors.INVALID_TYPE });

  try {
    const newUser = await UserModel.createUser({ username, password, type });
    res.status(201).json(newUser);
  } catch (error) {

    if (error.code === '23505' && error.constraint === 'users_username_key')
      return res.status(409).json({ error: userErrors.DUPLICATE_USERNAME })

    res.status(500).json({ error: userErrors.CREATE_ERROR });
  }
}

// GET /users/:id
exports.getUserById = async (req, res) => {
  const id = req.params.id

  try {
    const userById = await UserModel.getUserById(id);

    if (!userById)
      return res.status(404).json({ error: userErrors.NOT_FOUND });

    res.status(200).json(userById);
  } catch (error) {
    res.status(500).json({ error: userErrors.FIND_BY_ID_ERROR });
  }
}

// PUT /users/:id
exports.updateUser = async (req, res) => {
  const id = req.params.id
  const { password } = req.body

  if (!password?.trim())
    return res.status(400).json({ error: userErrors.MISSING_UPDATE_DATA });

  try {
    const updatedUser = await UserModel.updateUser(id, { password });

    if (!updatedUser)
      return res.status(404).json({ error: userErrors.NOT_FOUND });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: userErrors.UPDATE_ERROR });
  }
}

// DELETE /users/:id
exports.deleteUserById = async (req, res) => {
  const id = req.params.id

  try {
    const user = await UserModel.deleteUserById(id);

    if (!user)
      return res.status(404).json({ error: userErrors.NOT_FOUND });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: userErrors.DELETE_ERROR });
  }
}
