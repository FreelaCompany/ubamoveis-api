"use strict";

const DB = use("App/Database/UbamoveisDB");
const Connection = new DB().getConnection();

class NewsletterRepository {
  async store({ request }) {
    try {
      const { whatsapp } = request.post();

      const sql = `
        INSERT INTO newsletter
          (whatsapp, data_cadastro)
        VALUES
          ('${whatsapp}', NOW())
      `.trim();

      await Connection.raw(sql);
    } catch (error) {
      throw {
        status: 400,
        message: "Erro ao gravar o registro no banco de dados",
      };
    }
  }

  async delete({ params }) {
    try {
      const { id } = params;

      const sql = `
      DELETE FROM newsletter WHERE id = ${id}
      `.trim();

      await Connection.raw(sql);
    } catch (error) {
      throw {
        status: 400,
        message: "Erro ao gravar o registro no banco de dados",
      };
    }
  }

  async list({ request }) {
    try {
      const sql = `
        SELECT * from newsletter
      `.trim();

      const [dataResult] = await Connection.raw(sql);
      return dataResult;
    } catch (error) {
      throw {
        status: 400,
        message: "Erro ao gravar o registro no banco de dados",
      };
    }
  }
}

module.exports = NewsletterRepository;
