"use strict";

const DB = use("App/Database/UbamoveisDB");
const FtpUpload = use("App/Services/FtpUpload");
const Connection = new DB().getConnection();

class BannerRepository {
  async store({ request }) {
    try {
      const { link } = request.post();

      const banner = request.file("banner");

      const uploadBanner = await new FtpUpload().store(banner, "banner");

      const banner_mobile = request.file("banner_mobile");

      const uploadBannerMobile = await new FtpUpload().store(
        banner_mobile,
        "banner_mobile"
      );

      const sql = `
      INSERT INTO banner_home (banner, banner_mobile, link, data_cadastro) VALUES ('${uploadBanner}', '${uploadBannerMobile}','${link}', NOW())
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
          *
        FROM banner_home
      `.trim();

      const [dataResult] = await Connection.raw(sql);
      const data = dataResult.map((bannerUnit) =>
        this.bannerMapper(bannerUnit)
      );
      return data;
    } catch (error) {
      throw { status: 404, message: "Não existem currículos cadastrados" };
    }
  }

  bannerMapper(bannerUnit) {
    const { banner, banner_mobile, ...rest } = bannerUnit;
    const bannerBaseUrl = "http://www.casabelavistavr.com.br/banner/";
    const bannerMobileBaseUrl =
      "http://www.casabelavistavr.com.br/banner_mobile/";
    return {
      ...rest,
      banner: `${bannerBaseUrl}${banner}`,
      banner_mobile: `${bannerMobileBaseUrl}${banner_mobile}`,
    };
  }
}

module.exports = BannerRepository;
