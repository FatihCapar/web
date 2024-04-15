import React from "react";
//import MovieItem from "./react";
//import { useState, useEffect } from "react";

export default function MovieList(){
  //  const[data, setData] = useState([]);

   // useEffect(()=>{
    //    const urllink= 'http://omdbapi.com/?s=${suchText}&apikey=7330c24f';
    //    const url= new URL(urllink);
    //    fetch(url)
   //     .then(response =>{})

 //   }, suchText)
    return(
        <>
        <div>
        
        
        
        </div>
        </>
    )
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