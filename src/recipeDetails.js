let steps = require('./steps');

class RecipeDetails {
  constructor(id, userRecipe, author, title, summary, servings, readyInMinutes, image, extraInfo, cuisines, published) {
    this.id = id;
    this.userRecipe = userRecipe;
    this.author = author;
    this.title = title;
    this.summary = summary;
    this.servings = servings;
    this.readyInMinutes = readyInMinutes;
    this.extraInfo = extraInfo;
    this.image = image;
    this.cuisines = cuisines;
    this.isPublished = published;
    this.includedIngredients = [];
    this.instructions = [];
  }
}

module.exports = RecipeDetails;