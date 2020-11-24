"use strict";

const Database = use("Database");

class UbamoveisDB {
  getConnection() {
    return Database.connection("ubamoveis");
  }
}

module.exports = UbamoveisDB;
