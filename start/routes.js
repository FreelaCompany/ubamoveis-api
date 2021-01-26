"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.group(() => {
  Route.post("/", "CurriculosController.store");
  Route.get("/", "CurriculosController.list");
}).prefix("curriculos");

Route.group(() => {
  Route.post("/", "NewsletterController.store");
  Route.get("/", "NewsletterController.list");
}).prefix("newsletter");

Route.group(() => {
  Route.post("/", "ProdutosController.store");
  Route.get("/", "ProdutosController.list");
  Route.get("/categorias", "ProdutosController.listCategorias");
  Route.get("/subcategorias", "ProdutosController.listSubCategorias");
}).prefix("produtos");

Route.group(() => {
  Route.post("/", "BannerController.store");
  Route.delete("/", "BannerController.delete");
  Route.get("/", "BannerController.list");
}).prefix("banner");

Route.group(() => {
  Route.post("/", "CadastroController.enviar");
}).prefix("cadastro");

Route.group(() => {
  Route.post("/", "LoginController.logar");
}).prefix("login");

Route.get("/", () => {
  return { greeting: "Ola amigo" };
});
