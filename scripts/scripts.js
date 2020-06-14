var result = null;

window.onload = () => {      
    makeRequest();
    filter();
}

function recipeContains(recipe, filter)
{    
    return recipe.name == null ? recipe.id.toLowerCase().includes(filter) : recipe.name.toLowerCase().includes(filter);
}

function filter() {
    let table = document.getElementById("recipes");
    let filter = document.getElementById("filter").value;

    table.innerHTML = "<tr><th>Chemical</th><th>Recipe String</th><th class=\"num_head\">Resulting num</th></tr>"

    if(result == null){
        return;
    }

    var myKeys = Object.keys(result);

    myKeys.forEach(key => {
        var curRecipe = result[key]
        if (filter != "" && !recipeContains(curRecipe, filter)) {
            return
        }

        let row = document.createElement("tr");
        let arr = [curRecipe.name, curRecipe.custom_recipe_string, curRecipe.result_amount];
        for (let a of arr){
            let cell = document.createElement("td");
            cell.innerText = a;
            row.append(cell);
        }
        table.appendChild(row);
    });
}

