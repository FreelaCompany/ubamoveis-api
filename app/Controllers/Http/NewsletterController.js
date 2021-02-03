"use strict";

const Repo = use("App/Repositories/NewsletterRepository");

class NewsletterController {
  async store({ request, response }) {
    try {
      await new Repo().store({ request });
      return response.status(200).send({
        message: "Número cadastrado com sucesso",
      });
    } catch (error) {
      return response.status(error.status || 400).send({
        error: {
          message: error.message || "Erro ao consultar a api",
        },
      });
    }
  }

  async delete({ params, response }) {
    try {
      return await new Repo().delete({ params });
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
}

module.exports = NewsletterController;
