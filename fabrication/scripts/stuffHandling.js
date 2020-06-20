var Debug = {};

async function makeRequest() {
  var rawurl =
    "https://raw.githubusercontent.com/experienceddevs/goonstation/master/code/datums/manufacturing.dm";
  await fetch(rawurl)
    .then((res) => res.text())
    .then((result) => doTheShit(result));
  filter();
}

function doTheShit(params) {
  Debug.raw = params;
  var body = params.replace(/\/\/.*/g, ""); // Removing pesky comments
  body = body.replace(/\/\*([\s\S]+?)\*\//g, ""); // Removing block commments
  Debug.noComments = body;
  var entries = body.match(/\/datum\/manufacture([\s\S]+?category = (.*)\n)/g); // Getting entries
  Debug.matches = entries;

  var finalList = {};
  entries.forEach((element) => {
    if (element == null) {
      return;
    }
    var temp = getDataObj(element);
    if (temp !== null && !isEmptyObject(temp) && "required_reagents" in temp) {
      temp.custom_recipe_string = makeRecipeString(temp.required_reagents);
      finalList[temp.id == null ? temp.result : temp.id] = temp;
    }
  });

  result = finalList;
}

function makeRecipeString(recipe) {
  var myString = "";
  myString = JSON.stringify(recipe).replace(/[\t\n]/g, ""); // Removing tabs and newlines
  myString = myString.replace(/["'"]/g, ""); // removing quotes
  myString = myString.replace(/,/g, ";"); // converting "," to ";"
  myString = myString.replace(/:/g, "="); // converting ":" to "="
  myString = myString.replace(/^\{/g, ""); // removing {
  myString = myString.replace(/\}$/g, ""); // removing }

  return myString;
}

function getDataObj(str) {
  str = str.replace(/\t/g, ""); // Sanitizing the tabs away
  str = str.replace(/["']/g, ""); // removing quotes
  var chemObj = {};
  str.split("\n").forEach((entry) => {
    if (entry !== "") {
      if (entry.includes("=")) {
        var shit = entry.split("=");
        chemObj[shit[0].trim()] = shit[1].includes("list")
          ? shitListToObj(entry)
          : shit[1].trim();
      }
    }
  });
  console.log(chemObj);
  return chemObj;
}

function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

function shitListToObj(str) {
  var shitObj = {};
  str = str.trim(); // Sanitizing
  console.log("ree" + str);
  var ingredients = str.match(/\w*.=.[^list][0-9]*/g);
  //old "\w*".=.[0-9]*

  if (ingredients == null) {
    return null;
  }

  ingredients.forEach((ingr) => {
    ingr = ingr.replace(/"/g, "");
    var idunno = ingr.split("=");
    shitObj[idunno[0].trim()] = idunno[1].trim();
  });

  return shitObj;
}
