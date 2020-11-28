"use strict";

const Repo = use("App/Repositories/ProdutosRepository");

class ProdutosController {
  async store({ request, response }) {
    try {
      return await new Repo().store({ request });
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
    } catch (error) {
      return response.status(error.status || 400).send({
        error: {
          message: error.message || "Erro ao consultar a api",
        },
      });
    }
  }

  async listCategorias({ request, response }) {
    try {
      return await new Repo().listCategorias({ request });
    } catch (error) {
      return response.status(error.status || 400).send({
        error: {
          message: error.message || "Erro ao consultar a api",
        },
      });
    }
  }

  async listSubCategorias({ request, response }) {
    try {
      return await new Repo().listSubCategorias({ request });
    } catch (error) {
      return response.status(error.status || 400).send({
        error: {
          message: error.message || "Erro ao consultar a api",
        },
      });
    }
  }
}

module.exports = ProdutosController;
