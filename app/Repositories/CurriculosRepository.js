"use strict";

const DB = use("App/Database/UbamoveisDB");
const FtpUpload = use("App/Services/FtpUpload");
const Connection = new DB().getConnection();

class CurriculosRepository {
  async store({ request }) {
    try {
      const {
        nome,
        email,
        telefone,
        endereco,
        sexo,
        data_nascimento,
      } = request.post();

      const cleanTelefone = telefone.replace(/[^0-9]/g, "");

      const file = request.file("curriculo");

      const uploadFile = await new FtpUpload().store(file, "curriculos");

      const sql = `
      INSERT INTO trabalhe_conosco (nome, email, telefone, endereco, sexo, data_nascimento, curriculo, data_cadastro) VALUES ('${nome}', '${email}','${cleanTelefone}', '${endereco}', '${sexo}', '${data_nascimento}','${uploadFile}', NOW())
      `.trim();

      await Connection.raw(sql);
    } catch (error) {
      throw {
        status: 400,
        message: error,
      };
    }
  }

  async list({ request }) {
    try {
      const sql = `
        SELECT
          *
        FROM trabalhe_conosco
      `.trim();

      const [dataResult] = await Connection.raw(sql);
      const data = dataResult.map((curriculoUnit) =>
        this.curriculosMapper(curriculoUnit)
      );
      return data;
    } catch (error) {
      throw { status: 404, message: "Não existem currículos cadastrados" };
    }
  }

  curriculosMapper(curriculoUnit) {
    const { curriculo, ...rest } = curriculoUnit;
    const curriculosBaseUrl = "http://www.casabelavistavr.com.br/curriculos/";
    return { ...rest, curriculo: `${curriculosBaseUrl}${curriculo}` };
  }
}

module.exports = CurriculosRepository;
