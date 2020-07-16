var result = null;

window.onload = () => {
  makeRequest();
  filter();
};

function recipeContains(recipe, filter, useChemNames, useRecipeNames) {
  var returner = false;
  if (useChemNames) {
    if (recipe.id == null) {
      console.log(
        `Having a problem with ${JSON.stringify(recipe)}\n(id is null)`
      );
    }
    returner = recipe.name == null ? recipe.id?.toLowerCase().includes(filter) : recipe.name.toLowerCase().includes(filter);
  }
  if (useRecipeNames) {
    returner = returner || recipe.custom_recipe_string.toLowerCase().includes(filter);
  }
  return returner;
}

function filter() {
  let table = document.getElementById("recipes");
  let filter = document.getElementById("filter").value.toLowerCase();

  table.innerHTML = "";

  if (result == null) {
    return;
  }

  var useChemNames = document.getElementById("box_chem").checked;
  var useRecipeNames = document.getElementById("box_recipe").checked;

  var myKeys = Object.keys(result);

  myKeys.sort((a, b) => {
    if (result[a].name < result[b].name) {
      return -1;
    }
    if (result[a].name > result[b].name) {
      return 1;
    }
    return 0;
  });

  myKeys.forEach((key) => {
    var curRecipe = result[key];
    if ( filter != "" && !recipeContains(curRecipe, filter, useChemNames, useRecipeNames) ) {
      return;
    }

    let row = document.createElement("tr");
    let arr = [
      curRecipe.name == undefined ? curRecipe.id : curRecipe.name,
      underlineBases(curRecipe.custom_recipe_string),
      curRecipe.result_amount,
    ];
    for (let a of arr) {
      let cell = document.createElement("td");
      cell.innerHTML = a;
      row.append(cell);
    }
    table.appendChild(row);
  });
}

function underlineBases(recipeString){
  bases.forEach(base => {
    recipeString = recipeString.replace(base, `<span class="ingredientBase">${base}</span>`);
  });
  return recipeString;
}
