import React from "react";
import movieList from "./MovieList";

export default function Header(){
    return(
        <>
        <h1>Header</h1>

        


        <div style={{ backgroundColor: "#333f49" }} className="Backround">
      <img
        src="pic/Logo.PNG"
        alt="Bild"
        className="img-fluid rounded-circle"
        style={{
          maxWidth: "10%",
          maxHeight: "10%",
          borderRadius: "500px",
          border: "5px solid black",
          position: "relative",
          marginLeft: "20px",
          marginTop: "20px",
          marginBottom: "-100px"
        }}
      />

      <div className="modal-dialog modal-lg " role="document">
        <div className="modal-content" style={{ backgroundColor: "#333f49" }}>
          {/* Suchleiste */}
          <div className="modal-header">
            <input
              type="text"
              className="form-control"
              style={{ borderRadius: "50px" }}
              defaultValue="Tarzan"
              id="search"
            />
            <button
              type="button"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#favoritesModal"
            >
              Favoriten anzeigen
            </button>
            <button onClick={get_movie_result} className="btn btn-success">
              Suchen
            </button>
          </div>
        </div>
      </div>

      {/* Weitere Modal-Komponenten und Buttons können hier hinzugefügt werden */}
    </div>
        </>
    )
}
