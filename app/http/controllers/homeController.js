const Food = require("../../models/food");

function homeController() {
  return {
    async index(req, res) {
      const foods = await Food.find();
      return res.render("home", { foods: foods });
    }
  };
}

module.exports = homeController;
