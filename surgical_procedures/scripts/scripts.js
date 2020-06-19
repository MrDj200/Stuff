window.onload = () => {
  filter();
};

function filter() {
  let table = document.getElementById("table_entries");
  let filter = document.getElementById("filter").value.toLowerCase();

  table.innerHTML = ""; // Purging the current table entries so we dont append the results to the table

  var procedureArray = allProcedures.goonstation.procedures; // TODO: Add switchable procedure object to use in other codebases

  procedureArray.sort(compareByOrgan); // Sorting the array alphabetically

  procedureArray.forEach((entry) => {
    if (filter != "" && !recipeContains(entry, filter)) {
      return;
    }

    let row = document.createElement("tr");
    let arr = [
      entry.organ,
      entry.target,
      entry.intent,
      entry.procedure.toString().replace(/\,/g, " => "),
    ];
    arr.forEach((a) => {
      let cell = document.createElement("td");
      a = entry.note ? a + `<span>${entry.note}</span>` : a;
      cell.innerHTML = colorIntent(a);
      cell.className = "powerhouse";
      row.append(cell);
    });
    table.appendChild(row);
  });
}

function colorIntent(_string) {
  _string = _string.replace("help", '<p style="color:green">Help</p>');
  _string = _string.replace("harm", '<p style="color:red">Harm</p>');
  _string = _string.replace("grab", '<p style="color:orange">Grab</p>');
  _string = _string.replace("none", '<p style="color:black"><i>N/A</i></p>');

  return _string;
}

function recipeContains(proc, filter) {
  return proc.organ.toLowerCase().includes(filter);
}

function compareByOrgan(a, b) {
  if (a.organ < b.organ) {
    return -1;
  }
  if (a.organ > b.oragn) {
    return 1;
  }
  return 0;
}
