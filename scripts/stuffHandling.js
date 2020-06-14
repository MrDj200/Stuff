async function makeRequest(){
    var rawurl = "https://raw.githubusercontent.com/experienceddevs/goonstation/master/code/modules/chemistry/Chemistry-Recipes.dm"
    await fetch(rawurl)
      .then(res => res.text())
      .then((result) => doTheShit(result))
    filter();
  }

function doTheShit(params) {
    var body = params.replace(/\/\/.*\n/g, "") // Removing pesky comments
    var entries = body.match(/\t{2}\w*\n(\t{3}.*\n)*/g)

    var finalList = {}
    entries.forEach(element => {
        var temp = getChemObj(element)
        if (temp !== null && !isEmptyObject(temp) && 'required_reagents' in temp) {
        temp.custom_recipe_string = makeRecipeString(temp.required_reagents)
        finalList[temp.id == null ? temp.result : temp.id] = temp
        }
    });

    result = finalList;
}

function makeRecipeString(recipe){
    var myString = ""
    myString = JSON.stringify(recipe).replace(/[\t\n]/g, "") // Removing tabs and newlines
    myString = myString.replace(/["'"]/g, "") // removing quotes
    myString = myString.replace(/,/g, ";") // converting "," to ";"
    myString = myString.replace(/:/g, "=") // converting ":" to "="
    myString = myString.replace(/^\{/g, "") // removing {
    myString = myString.replace(/\}$/g, "") // removing }

    return myString
}

function getChemObj(str){
    str = str.replace(/\t/g, "") // Sanitizing the tabs away
    str = str.replace(/["']/g, "") // removing quotes
    var chemObj = {}
    str.split("\n").forEach(entry => {
        if (entry !== "") {
            if (entry.includes("=")) {
                var shit = entry.split("=")
                chemObj[shit[0].trim()] = shit[1].includes("list") ? shitListToObj(entry) : shit[1].trim()
            }
        }
    });
    return chemObj
}

function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
        }
    }
    return true;
}

function shitListToObj(str){
    var shitObj = {}
    str = str.trim() // Sanitizing
    var ingredients = str.match(/\w*.=.[^list][0-9]*/g)
    //old "\w*".=.[0-9]*

    if (ingredients == null) {
        return null
    }

    ingredients.forEach(ingr => {
        ingr = ingr.replace(/"/g, "")
        var idunno = ingr.split("=")
        shitObj[idunno[0].trim()] = idunno[1].trim()
    });
    return shitObj
}

