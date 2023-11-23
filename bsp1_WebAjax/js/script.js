//
var dataFound = 0;
var dataPerPage = 10;
//

function get_movie_result() {
  var search = $("#search").val();
  alert(search);
  if (search != null || search != "") {
    $.ajax({
      url: "http://www.omdbapi.com/?s=" + search + "&r=json&apikey=2279b9f1",
      dataType: 'json',
      success: function (data) {
        if (data.hasOwnProperty("Response") && data.Response == "True") {
          // Abfrage ist auf jeden Fall erfolgreich, noch Garantie, dass Daten OK oder vorhanden sind
          // data.Search Array von Ergebnisse
          split_jason(data.Search);
        }
      },
      error: function (xmlHttpRequest, textStatus, errorThrown) {
        alert(textStatus, errorThrown);
      }
    });
  }
}

function split_jason(myArray) {
  if (check_Array(myArray)) {
    $("#movieresult tbody").empty();
    for (var x = 0; x < myArray.length; x++) {
      var poster = "";
      if (myArray[x].hasOwnProperty("Poster") && myArray[x].Poster != "N/A") poster = "<img class='img-fluid' style='max-width: 100%; height: auto;' src='" + myArray[x].Poster + "'><br>";

      var plot = "Short Plot"; // Standardwert
      if (myArray[x].hasOwnProperty("imdbID")) {
        // Hier wird die Plot-Abfrage mit dem Standardwert "short" durchgeführt
        $.ajax({
          url: "http://www.omdbapi.com/?i=" + myArray[x].imdbID + "&plot=short&r=json&apikey=2279b9f1",
          async: false, // Synchron, um das Ergebnis sofort zu erhalten
          dataType: 'json',
          success: function (plotData) {
            if (plotData.hasOwnProperty("Plot")) {
              plot = plotData.Plot;
            }
          },
          error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.error("Error fetching plot data: " + textStatus, errorThrown);
          }
        });
      }

      var newRowContent = "<tr><td>" + myArray[x].Title + "</td><td>" + myArray[x].Year + "<td><td>" + poster + "</td><td>" + plot + "</td></tr>";
      $("#movieresult tbody").append(newRowContent);
    }
  } else {
    alert("Fehler bei der Verarbeitung !");
  }
}

function check_Array(myArray) {
  if (typeof myArray === 'object' && myArray instanceof Array) {
    return true;
  } else {
    return false;
  }
}
