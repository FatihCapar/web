var dataFound = 0;
var dataPerPage = 10;
var favoriteMovies = [];
var currentPage = 1;
var totalResults = 0;
var searchResults = [];
var apiKey = localStorage.getItem('apiKey') || "";

function updateApiKey() {
  var apiKey = $("#apiKeyInput").val();

  if (apiKey) {
    localStorage.setItem('apiKey', apiKey);
    location.reload();
    alert("API-Schlüssel wurde aktualisiert!");
  } else {
    alert("API-Schlüssel darf nicht leer sein!");
  }
}

$(document).ready(function() {
  loadFavorites();
});


function showResults() {
  var startIndex = (currentPage - 1) * dataPerPage;
  var endIndex = startIndex + dataPerPage;
  var resultsToDisplay = searchResults.slice(startIndex, endIndex);

  console.log("currentPage:", currentPage);
  console.log("totalResults:", totalResults);
  console.log("startIndex:", startIndex);
  console.log("endIndex:", endIndex);
  console.log("resultsToDisplay:", resultsToDisplay);

  console.log("Before split_jason call");
  split_jason(resultsToDisplay);
  console.log("After split_jason call");
}

async function nextPage() {
  if ((currentPage * dataPerPage) < totalResults) {
      if (!apiKey) {
          alert("Bitte geben Sie einen gültigen API-Schlüssel ein.");
          return;
      }
      currentPage++;
      console.log("Going to next page. New currentPage:", currentPage);
      await loadResultsPage(currentPage);
      showResults();
  }
}

// Funktion zum Laden der Suchergebnisse basierend auf der Seite
async function loadResultsPage(page) {
  var search = $("#search").val();
  if (search != null || search != "") {
      try {
          console.log("Loading results for page:", page);
          if (!apiKey) {
              alert("Bitte geben Sie einen gültigen API-Schlüssel ein.");
              return;
          }
          var response = await $.ajax({
              url: "http://www.omdbapi.com/?s=" + search + "&r=json&apikey=" + apiKey + "&page=" + page,
              dataType: 'json'
          });
          console.log("API response:", response);
          if (response.hasOwnProperty("Response") && response.Response == "True") {
              totalResults = parseInt(response.totalResults) || 0;
              searchResults = searchResults.concat(response.Search || []);
          } else {
              console.error("Error in API response:", response.Error);
          }
      } catch (error) {
          console.error("Error making API request:", error);
      }
  }
}


function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    console.log("Going to previous page. New currentPage:", currentPage);
    showResults();
  }
}


function get_movie_result() {
  currentPage = 1;
  var search = $("#search").val();
  var apiKey = localStorage.getItem('apiKey');

  if (!apiKey) {
    alert("Bitte geben Sie einen gültigen API-Schlüssel ein.");
    return;
  }

  if (!search || search.trim() === "") {
    alert("Bitte geben Sie einen Suchbegriff ein.");
    return;
  }

  if (search != null || search != "") {
    $.ajax({
      url: "http://www.omdbapi.com/?s=" + search + "&r=json&apikey=" + apiKey,
      dataType: 'json',
      success: function (data) {
        if (data.hasOwnProperty("Response") && data.Response == "True") {
          totalResults = parseInt(data.totalResults) || 0;
          searchResults = data.Search || [];
        
          showResults();
        }
      },
      error: function (xmlHttpRequest, textStatus, errorThrown) {
        alert(textStatus, errorThrown);
      }
    });
  }
}

async function split_jason(myArray) {
  console.log("split_jason function called");
  console.log("myArray:", myArray);
  if (check_Array(myArray)) {
    $("#movieresult tbody").empty();
    for (var x = 0; x < myArray.length; x++) {
      var poster = "";
      var plot = "N/A"; 
      var rating = "N/A"; 
      var genre = "N/A"; 
      var year = "N/A"; 

      if (myArray[x].hasOwnProperty("Poster") && myArray[x].Poster != "N/A") poster = "<img class='img-fluid' style='max-width: auto; height: auto;' src='" + myArray[x].Poster + "'><br>";

      if (myArray[x].hasOwnProperty("imdbID")) {
        await getPlotData(myArray[x].imdbID).then((plotData) => {
          if (plotData.hasOwnProperty("Plot")) {
            plot = plotData.Plot;
          }
        }).catch((error) => {
          console.error("Error fetching plot data: ", error);
        });

        await getRatingData(myArray[x].imdbID).then((ratingData) => {
          if (ratingData.hasOwnProperty("imdbRating")) {
            rating = ratingData.imdbRating;
          }
        }).catch((error) => {
          console.error("Error fetching rating data: ", error);
        });

        await getDetailData(myArray[x].imdbID).then((detailData) => {
          if (detailData.hasOwnProperty("Genre")) {
            genre = detailData.Genre;
          }
          if (detailData.hasOwnProperty("Year")) {
            year = detailData.Year;
          }
        }).catch((error) => {
          console.error("Error fetching detail data: ", error);
        });
      }

      var starRating = convertToStars(rating);

      var newRowContent = "<tr><td>" + poster + "</td><td>" + starRating + "</td><td>" + plot + "</td><td>" + genre + "</td><td>" + year + "</td><td><i class='bi bi-heart-fill' onclick='addToFavorites(\"" + myArray[x].imdbID + "\")'></i> " + myArray[x].Title + "</td></tr>";

      $("#movieresult tbody").append(newRowContent);
    }
  } else {
    alert("Fehler bei der Verarbeitung !");
  }
}

function check_Array(myArray) {
  return Array.isArray(myArray);
}

function convertToStars(rating) {
  var roundedRating = Math.round(parseFloat(rating));
  var fullStars = Math.floor(roundedRating / 2);
  var halfStar = roundedRating % 2 === 1;
  var starRating = "";

  for (var i = 0; i < fullStars; i++) {
    starRating += "<i class='bi bi-star-fill'></i>"; 
  }

  if (halfStar) {
    starRating += "<i class='bi bi-star-half'></i>"; 
  }

  return starRating;
}

function addToFavorites(imdbID) {
  if (favoriteMovies.indexOf(imdbID) === -1) {
    favoriteMovies.push(imdbID);
    saveFavorites(); 
    alert("Film zu Favoriten hinzugefügt!");
  } else {
    alert("Film ist bereits in den Favoriten!");
  }
}

function saveFavorites() {
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
}

function loadFavorites() {
  var storedFavorites = localStorage.getItem('favoriteMovies');
  if (storedFavorites) {
    favoriteMovies = JSON.parse(storedFavorites);
  }
}

async function fetchData(imdbID, plot = false) {
  let plotParam = "";
  if (plot) {
    plotParam = "&plot=short";
  }

  const url = `http://www.omdbapi.com/?i=${imdbID}&r=json${plotParam}&apikey=${apiKey}`;

  try {
    return await $.ajax({
      url,
      dataType: 'json'
    });
  } catch (error) {
    console.error(`Error fetching ${plot ? 'plot' : 'detail'} data: `, error);
    return {};
  }
}

async function getPlotData(imdbID) {
  return await fetchData(imdbID, true);
}

async function getRatingData(imdbID) {
  return await fetchData(imdbID);
}

async function getDetailData(imdbID) {
  return await fetchData(imdbID);
}


function showFavorites() {
  $("#favoritesList").empty();

  async function loadDetails(imdbID) {
    try {
      return await $.ajax({
        url: "http://www.omdbapi.com/?i=" + imdbID + "&plot=short&r=json&apikey="+apiKey,
        dataType: 'json'
      });
    } catch (error) {
      console.error("Error fetching details for favorite movie: ", error);
      return {};
    }
  }

  async function addToFavoritesList(imdbID) {
    if (favoriteMovies.includes(imdbID)) {
      const details = await loadDetails(imdbID);
      const starRating = convertToStars(details.imdbRating || 'N/A');
      const userStarRating = getUserStarRating(imdbID);

      const starRatingInput = `
        <div class='mb-3 '>
          <label for='userStarRating_${imdbID}' class='form-label'>Deine Bewertung:</label>
          <select class='form-select' id='userStarRating_${imdbID}'>
            ${generateStarRatingOptions()}
          </select>
          <button class='btn btn-primary mt-2' onclick='submitUserRating("${imdbID}")'>Bewertung abschicken</button>
        </div>
      `;


      // (#8c9287)
      var listItem =
      "<li class='mb-3 border rounded p-3' style='background-color: #B3B3B3;'>" +
        "<div class='row align-items-center'>" +
          "<div class='col-3 border-right text-center'> <img src='" + (details.Poster || 'N/A') + "' alt='Poster' class='img-fluid'></div>" +
          "<div class='col-1 border-right text-center'><strong>Bewertung:</strong> <span class='text-warning font-weight-bold'>" + (details.imdbRating || 'N/A') + "</span> " + starRating + "</div>" +
          "<div class='col-1 border-right text-center'><strong>Deine Bewertung:</strong> " + userStarRating + "</div>" +
          "<div class='col-md-3 border-right'><strong>Plot:</strong> <textarea class='form-control' rows='5' readonly style='background-color: #fff; font-weight: bold;'>" + (details.Plot || 'N/A') + "</textarea></div>" +
          "<div class='col-2 border-right text-center'><strong>Genre:</strong> " + generateGenreBadges(details.Genre) + "</div>" +
          "<div class='col-2 text-center'><strong>Year:</strong> " + generateYearBadges(details.Year) + "</div>" +
          "<div class='col-2 left '><strong>Titel:</strong> <span class='text-primary font-weight-bold'>" + (details.Title || 'N/A') + "</span></div>" +
          "<div class='col-1 text-center'><button class='btn btn-danger btn-sm mt-2' onclick='removeFromFavorites(\"" + imdbID + "\")'>Entfernen</button></div>" +
          "<div class='col-12'>" + starRatingInput + "</div>" +
        "</div>" +
      "</li>";

      function generateStarRatingOptions() {
  let options = '';
  for (let i = 1; i <= 10; i++) {
    options += '<option value="' + i + '">' + i + ' Sterne</option>';
  }
  return options;
}
  
function generateGenreBadges(genre) {
  if (!genre) return 'N/A';

  var genreArray = genre.split(', ');

  var genreColors = {
    'Action': 'bg-primary',
    'Adventure': 'bg-success',
    'Animation': 'bg-info',
    'Biography': 'bg-warning',
    'Comedy': 'bg-danger',
    'Crime': 'bg-secondary',
    'Documentary': 'bg-dark',
    'Drama': 'bg-primary',
    'Family': 'bg-success',
    'Fantasy': 'bg-info',
    'Film-Noir': 'bg-warning',
    'History': 'bg-danger',
    'Horror': 'bg-secondary',
    'Music': 'bg-dark',
    'Musical': 'bg-primary',
    'Mystery': 'bg-success',
    'Romance': 'bg-info',
    'Sci-Fi': 'bg-warning',
    'Sport': 'bg-danger',
    'Thriller': 'bg-secondary',
    'War': 'bg-dark',
    'Western': 'bg-primary'
  };

  var badges = genreArray.map(genreItem => {
    var colorClass = genreColors[genreItem] || 'bg-primary';
    return `<span class='badge ${colorClass} mb-1'>${genreItem}</span>`;
  });

  return badges.join('');
}



function generateYearBadges(year) {
  if (!year) return 'N/A';

  var yearArray = year.split(', ');
  var badges = yearArray.map(function (yearItem) {
    return "<span class='badge bg-secondary mr-1'>" + yearItem + "</span>";
  });

  return badges.join('');
}
    

      $("#favoritesList").append(listItem);
    }
  }

  for (var i = 0; i < favoriteMovies.length; i++) {
    var imdbID = favoriteMovies[i];
    addToFavoritesList(imdbID);
  }
}

function removeFromFavorites(imdbID) {
  var index = favoriteMovies.indexOf(imdbID);
  if (index !== -1) {
    favoriteMovies.splice(index, 1);
    saveFavorites(); 
    showFavorites(); 
    alert("Film aus Favoriten entfernt!");
  } else {
    alert("Film nicht in den Favoriten gefunden!");
  }
}

function clearFavorites() {
  favoriteMovies = [];
  saveFavorites(); 
  showFavorites(); 
  alert("Alle Filme aus Favoriten entfernt!");
}
function submitUserRating(imdbID) {
  var userStarRating = $("#userStarRating_" + imdbID).val();

  alert("Deine Bewertung für " + imdbID + ": " + userStarRating);

  saveUserRating(imdbID, userStarRating);

  $("#myModal").modal("hide");
  showFavorites();
}

function saveUserRating(imdbID, rating) {
  localStorage.setItem('userStarRating_' + imdbID, rating);
}


function getUserStarRating(imdbID) {
  var rating = localStorage.getItem('userStarRating_' + imdbID);

  if (rating !== null) {
    return convertToStars(rating);
  } else {
    return 'N/A';
  }
}
function clearAllFavorites() {
  favoriteMovies = [];
  saveFavorites(); 
  showFavorites(); 
  alert("Alle Filme aus Favoriten entfernt!");
}

function resetAllRatings() {
  for (var i = 0; i < favoriteMovies.length; i++) {
      var imdbID = favoriteMovies[i];
      localStorage.removeItem('userStarRating_' + imdbID);
  }
  showFavorites(); 
  alert("Alle Bewertungen zurückgesetzt!");
}