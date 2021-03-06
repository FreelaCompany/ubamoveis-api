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
        id_categoria,
        id_subcategoria,
        mostrar_preco,
      } = request.post();

      const file = request.file("foto");

      const uploadFile = await new FtpUpload().store(file, "produtos");

      const verPreco = mostrar_preco === "true" ? 1 : 0;

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
        mostrar_preco,
        id_categoria,
        id_subcategoria,data_cadastro) VALUES ('${nome}', '${preco}','${validade_preco}', '${largura}', '${altura}', '${profundidade}','${cor1}', '${cor2}','${cor3}', '${cor4}', '${uploadFile}', ${verPreco}, ${id_categoria},${id_subcategoria}, NOW())
      `.trim();

      await Connection.raw(sql);
    } catch (error) {
      throw {
        status: 400,
        message: "Erro ao gravar o registro no banco de dados",
      };
    }
  }

  async edit({ request }) {
    try {
      const {
        id,
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
        mostrar_preco,
        id_categoria,
        id_subcategoria,
      } = request.post();

      console.log(mostrar_preco);

      const verPreco = mostrar_preco === "true" ? 1 : 0;

      if (foto === undefined) {
        const file = request.file("foto");

        const uploadFile = await new FtpUpload().store(file, "produtos");

        const sql = `
      UPDATE produtos
        SET nome = '${nome}',
        preco = '${preco}',
        validade_preco = '${validade_preco}',
        largura = '${largura}',
        altura = '${altura}',
        profundidade = '${profundidade}',
        cor1 = '${cor1}',
        cor2 = '${cor2}',
        cor3 = '${cor3}',
        cor4 = '${cor4}',
        foto = '${uploadFile}',
        mostrar_preco = ${verPreco},
        id_categoria = ${id_categoria},
        id_subcategoria = ${id_subcategoria},
        data_update = NOW()
        WHERE id_produto = ${id}
      `.trim();

        await Connection.raw(sql);
      } else {
        const sql = `
        UPDATE produtos
          SET nome = '${nome}',
          preco = '${preco}',
          validade_preco = '${validade_preco}',
          largura = '${largura}',
          altura = '${altura}',
          profundidade = '${profundidade}',
          cor1 = '${cor1}',
          cor2 = '${cor2}',
          cor3 = '${cor3}',
          cor4 = '${cor4}',
          mostrar_preco = ${verPreco},
          id_categoria = ${id_categoria},
          id_subcategoria = ${id_subcategoria},
          data_update = NOW()
          WHERE id_produto = ${id}
        `.trim();

        await Connection.raw(sql);
      }
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
        p.id_produto,
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
        p.mostrar_preco,
        p.id_categoria,
        p.id_subcategoria
        FROM produtos as p
        ORDER BY p.id_produto DESC
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
    const { mostrar_preco, foto, ...rest } = produtoUnit;
    const produtosBaseUrl = "http://www.ubamoveis.com.br/produtos/";
    return {
      ...rest,
      foto: `${produtosBaseUrl}${foto}`,
      mostrar_preco: mostrar_preco === 1 ? true : false,
    };
  }

  async listCategorias({ request }) {
    try {
      const sql = `
        SELECT
        *
        FROM produtos_categoria
      `.trim();

      const [dataResult] = await Connection.raw(sql);

      return { data: dataResult };
    } catch (error) {
      throw { status: 404, message: "Não existem categorias cadastradas" };
    }
  }

  async delete({ params }) {
    try {
      const { id } = params;

      const sql = `
      DELETE FROM produtos WHERE id_produto = ${id}
      `.trim();

      await Connection.raw(sql);
    } catch (error) {
      throw {
        status: 400,
        message: "Erro ao gravar o registro no banco de dados",
      };
    }
  }

  async listSubCategorias({ request }) {
    try {
      const sql = `
        SELECT
        *
        FROM produtos_subcategoria
      `.trim();

      const [dataResult] = await Connection.raw(sql);

      return { data: dataResult };
    } catch (error) {
      throw { status: 404, message: "Não existem subcategorias cadastradas" };
    }
  }
}

module.exports = ProdutosRepository;
