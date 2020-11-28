"use strict";

const DB = use("App/Database/UbamoveisDB");
const FtpUpload = use("App/Services/FtpUpload");
const Connection = new DB().getConnection();

class ProdutosRepository {
  async store({ request }) {
    try {
      const {
        nome,
        preco,
        validade_preco,
        largura,
        altura,
        profundidade,
        cor1,
        cor2,
        cor3,
        cor4,
        foto,
        id_categoria,
        id_subcategoria,
      } = request.post();

      const file = request.file("foto");

      const uploadFile = await new FtpUpload().store(file, "produtos");

      const sql = `
      INSERT INTO produtos (nome,
        preco,
        validade_preco,
        largura,
        altura,
        profundidade,
        cor1,
        cor2,
        cor3,
        cor4,
        foto,
        id_categoria,
        id_subcategoria,data_cadastro) VALUES ('${nome}', '${preco}','${validade_preco}', '${largura}', '${altura}', '${profundidade}','${cor1}', '${cor2}','${cor3}', '${cor4}', '${uploadFile}', ${id_categoria},${id_subcategoria}, NOW())
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
        SELECT
        p.nome,
        p.preco,
        p.validade_preco,
        p.largura,
        p.altura,
        p.profundidade,
        p.cor1,
        p.cor2,
        p.cor3,
        p.cor4,
        p.foto,
        c.categoria,
        s.subcategoria
        FROM produtos as p
        INNER JOIN produtos_categoria as c
        ON p.id_categoria = c.id_categoria
        INNER JOIN produtos_subcategoria as s
        ON p.id_subcategoria = s.id_subcategoria
      `.trim();

      const [dataResult] = await Connection.raw(sql);
      const data = dataResult.map((produtoUnit) =>
        this.produtosMapper(produtoUnit)
      );
      return { data: data };
    } catch (error) {
      throw { status: 404, message: "Não existem produtos cadastrados" };
    }
  }

  produtosMapper(produtoUnit) {
    const { foto, ...rest } = produtoUnit;
    const produtosBaseUrl = "http://www.casabelavistavr.com.br/produtos/";
    return { ...rest, foto: `${produtosBaseUrl}${foto}` };
  }
}

module.exports = ProdutosRepository;
