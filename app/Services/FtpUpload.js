const Env = use("Env");
const Ftp = require("basic-ftp");

class FtpUpload {
  constructor() {
    this.config = {
      host: Env.get("FTP_HOST"),
      user: Env.get("FTP_USER"),
      password: Env.get("FTP_PASSWORD"),
    };
  }

  async store(file, caminho) {
    const pathUpload = `${file.tmpPath}`;

    const fileName = `${new Date().getTime()}.${file.extname}`;

    const pathFTP = `\\www\\${caminho}\\${fileName}`;

    const client = new Ftp.Client();
    client.ftp.verbose = true;

    try {
      await client.access(this.config);
      console.log("TESTEsafsdfasdfasdfasdfasdfsd", await client.list("\\www"));
      await client.uploadFrom(pathUpload, pathFTP);
      return fileName;
    } catch (error) {
      throw { status: 400, message: error };
    }
  }
}

module.exports = FtpUpload;
