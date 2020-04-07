let steps = require('./steps');

class RecipeDetails {
  constructor(id, userRecipe, author, title, summary, servings, readyInMinutes, image, extraInfo, cuisine, mealType, published, userId) {
    this.id = id;
    this.userRecipe = userRecipe;
    this.author = author;
    this.title = title;
    this.summary = summary;
    this.servings = servings;
    this.readyInMinutes = readyInMinutes;
    this.extraInfo = extraInfo;
    this.image = image;
    this.cuisine = cuisine;
    this.mealType = mealType;
    this.isPublished = published;
    this.userId = userId;
    this.includedIngredients = [];
    this.instructions = [];
  }
}

module.exports = RecipeDetails;