const postResourcesMigration = require("./postMigration");
const userResourcesMigration = require("./userMigration");

const migrationMap = new Map([
  ['users', userResourcesMigration],
  ['posts', postResourcesMigration],
])

const tableNames = [...migrationMap.keys()];

module.exports = { migrationMap, tableNames };