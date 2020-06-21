var rawPool = {};

window.onload = () => {
  makeRequest();
  filter();
};

var entryObj = {};
function filter() {
  if (rawPool.total == null) {
    return;
  }
  let table = document.getElementById("table_entries");
  let filter = document.getElementById("filter").value.toLowerCase().toString();
  let suggest = document.getElementById("suggested_char");
  table.innerHTML = ""; // Purging the current table entries so we dont append the results to the table

  let pwList = rawPool.total.filter((word) => word.length == filter.length); // Getting all passwords witht the same length as the input

  if (pwList == null) {
    return; // TODO: Give feedback whats happening
  }
  var curEntries = [];

  pwList.forEach((element) => {
    if (filter != "" && !contains(element, filter)) {
      return;
    }
    let row = document.createElement("tr");
    let arr = [element, element.length];
    curEntries.push(element);
    for (let a of arr) {
      let cell = document.createElement("td");
      cell.innerHTML = a;
      row.append(cell);
    }
    table.appendChild(row); // Updating table

    element.split("").forEach((i) => (entryObj[i] = entryObj[i] ? entryObj[i] + 1 : 1));
    filter.replace("*", "").split("").forEach((i) => delete entryObj[i]);
    suggest.innerText = getMaxValueKey(entryObj) || "N/A";
  });
}

function getMaxValueKey(array) {
    let highest = null;
    let _temp = 0;
    for (let key in array) {
        if (array.hasOwnProperty(key)) {
            let element = array[key];
            if (element > _temp) {
                _temp = element;
                highest = key;
            }
        }
    }
    return highest;
}

function contains(entry, filter) {
  let entryArray = entry.split("");
  let filterArray = filter.split("");
  for (let i = 0; i < entryArray.length; i++) {
    if (filterArray[i] == "*") {
      continue;
    }
    if (entryArray[i] != filterArray[i]) {
      return false;
    }
  }
  return true;
}

async function makeRequest() {
  var rawUrl =
    "https://raw.githubusercontent.com/goonstation/goonstation/master/strings/password_pool.txt";
  await fetch(rawUrl)
    .then((res) => res.text())
    .then((result) => {
      let pwObj = {};
      pwObj.total = [];
      let fuck = result.replace(/\@/g, "").split("\n");

      fuck.forEach((element) => {
        if (element.includes("=")) {
          let shit = element.split("=");
          pwObj[shit[0]] = shit[1].split(",");
          pwObj.total = pwObj.total.concat(pwObj[shit[0]]);
        }
      });
      rawPool = pwObj;
    });
}
