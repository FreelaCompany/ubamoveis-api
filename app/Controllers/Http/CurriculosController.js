"use strict";

const Repo = use("App/Repositories/CurriculosRepository");

class CurriculosController {
  async store({ request, response }) {
    try {
      return await new Repo().store({ request });

      return response.status(200).send({
        success: true,
      });
    } catch (error) {
      return response.status(error.status || 400).send({
        error: {
          message: error.message || "Erro ao consultar a api",
        },
      });
    }
  }

  async list({ request, response }) {
    try {
      return await new Repo().list({ request });

      return response.status(200).send({
        success: true,
      });
    } catch (error) {
      return response.status(error.status || 400).send({
        error: {
          message: error.message || "Erro ao consultar a api",
        },
      });
    }
  }
}

module.exports = CurriculosController;
