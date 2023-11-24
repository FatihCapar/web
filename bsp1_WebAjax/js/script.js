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
          // data.Search Array von Ergebnissen
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
      var plot = "N/A"; // Standardwert
      var rating = "N/A"; // Standardwert für Bewertung
      var genre = "N/A"; // Standardwert für Genre
      var year = "N/A"; // Standardwert für Jahr

      if (myArray[x].hasOwnProperty("Poster") && myArray[x].Poster != "N/A") poster = "<img class='img-fluid' style='max-width: 100%; height: auto;' src='" + myArray[x].Poster + "'><br>";

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

        // Hier wird die Bewertungs-Abfrage durchgeführt
        $.ajax({
          url: "http://www.omdbapi.com/?i=" + myArray[x].imdbID + "&r=json&apikey=2279b9f1",
          async: false,
          dataType: 'json',
          success: function (ratingData) {
            if (ratingData.hasOwnProperty("imdbRating")) {
              rating = ratingData.imdbRating;
            }
          },
          error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.error("Error fetching rating data: " + textStatus, errorThrown);
          }
        });

        // Hier wird die Genre- und Jahr-Abfrage durchgeführt
        $.ajax({
          url: "http://www.omdbapi.com/?i=" + myArray[x].imdbID + "&r=json&apikey=2279b9f1",
          async: false,
          dataType: 'json',
          success: function (detailData) {
            if (detailData.hasOwnProperty("Genre")) {
              genre = detailData.Genre;
            }
            if (detailData.hasOwnProperty("Year")) {
              year = detailData.Year;
            }
          },
          error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.error("Error fetching detail data: " + textStatus, errorThrown);
          }
        });
      }

      // Hier wird die Bewertung in Sterne umgewandelt
      var starRating = convertToStars(rating);

      var newRowContent = "<tr><td>" + poster + "</td><td>" + starRating + "</td><td>" + plot + "</td><td>" + genre + "</td><td>" + year + "</td><td>" + myArray[x].Title  + "</td></tr>";
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

function convertToStars(rating) {
  var roundedRating = Math.round(parseFloat(rating));
  var fullStars = Math.floor(roundedRating / 2);
  var halfStar = roundedRating % 2 === 1;
  var starRating = "";

  for (var i = 0; i < fullStars; i++) {
    starRating += "<i class='bi bi-star-fill'></i>"; // Bootstrap Icons für vollen Stern
  }

  if (halfStar) {
    starRating += "<i class='bi bi-star-half'></i>"; // Bootstrap Icons für halben Stern
  }

  // Leere Sterne
//  for (var j = 0; j < 5 - fullStars; j++) {
//    starRating += "<i class='bi bi-star'></i>";
//  }

  return starRating;
}


