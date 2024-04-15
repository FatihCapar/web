import React from "react";

import './css/custom.css'

export default function Body() {
  // Dummy Daten für Filme (zum Testen)
  const movies = [
    {
      id: 1,
      poster: "https://m.media-amazon.com/images/M/MV5BZGU5ZTUyZmMtZjExYy00MDAzLTljZTEtMGE0MWI5YWFiYTJkXkEyXkFqcGdeQXVyNzc5MjA3OA@@._V1_SX300.jpg",
      rating: "7",
      userRating: "7",
      plot: "While on an African expedition with her father, Jane Parker meets Tarzan, and the two become fascinated by each other.",
      genre: "Adventure, Drama",
      year: "1981",
      title: "Tarzan the Ape Man"
    },
    
  ];

  // Funktion zum Hinzufügen zu Favoriten
  const addToFavorites = (movieId) => {
    // Implementieren Sie die Logik zum Hinzufügen des Films zu den Favoriten
    console.log("Film mit der ID", movieId, "zu Favoriten hinzugefügt.");
  };

  return (
    <>
      

      {/* Ergebnisse der Filmsuche */}
      <div className="modal-dialog modal-lg"  role="document">
        <div className="modal-content" style={{ backgroundColor: "#2f495e" }}>
          {/* Ergebnis */}
          <div className="modal-header">
           {/* <h5 className="modal-title" style={{ color: "#39ff14", fontSize: "26px" }}>
              Ergebnis
  </h5>*/}
            <div className="btn-group" role="group" aria-label="Options">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => console.log("Alle Filme entfernen")}
              >
                Alle Filme entfernen
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => console.log("Alle Bewertungen zurücksetzen")}
              >
                Alle Bewertungen zurücksetzen
              </button>
            </div>
          </div>
          <div className="modal-body">
            {}
            <table className="table" id="movieresult" style={{ backgroundColor: "#9babb9" }}>
              <thead>
                <tr>
                  <td>Poster</td>
                  <td>Bewertung</td>
                  <td>Eigene Bewertung</td>
                  <td>Inhalt</td>
                  <td>Genre</td>
                  <td>Year</td>
                  <td>Titel</td>
                  <td>Favorit</td> {/* Knopf zum Hinzufügen zu Favoriten */}
                </tr>
              </thead>
              <tbody>
                {/* Filme aus der Suche anzeigen */}
                {movies.map((movie) => (
                  <tr key={movie.id}>
                    <td>
                      <img src={movie.poster} alt="Poster" style={{ maxWidth: "100px" }} />
                    </td>
                    <td>{movie.rating}</td>
                    <td>{movie.userRating}</td>
                    <td>{movie.plot}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.year}</td>
                    <td>{movie.title}</td>
                    <td>
                      <button
                        onClick={() => addToFavorites(movie.id)}
                        className="btn btn-primary"
                      >
                        Zu Favoriten hinzufügen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            {/* Buttons zum Navigieren oder für andere Aktionen */}
            <button
              type="button"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#apiKeyModal"
            >
              API Key ändern
            </button>
            {/* Weitere Modal-Komponenten und Buttons */}
          </div>
        </div>
      </div>
    </>
  );
}
