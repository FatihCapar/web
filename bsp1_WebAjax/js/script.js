//
var dataFound=0;
var dataPerPage=10;
//
function get_movie_result(){
  var search = $("#search").val();
  alert (search);
  if (search != null || search != "") {
    $.ajax({
        url: "http://www.omdbapi.com/?s="+search+"&r=json&apikey=2279b9f1",
        dataType: 'json',
        success: function(data) {
        if(data.hasOwnProperty("Response") && data.Response =="True" ){
          //ABfrage ist auf jedenfall erfolgreich noch grantie daten ok oder vorhanden
          //data.Search Array von Ergebnisse
          split_jason(data.Search);
        }


      },   
        error: function (xmlHttpRequest, textStatus, errorThrown) {
              alert(textStatus, errorThrown);
       }
     }
     );
   }
}

function split_jason(myArray){
  if(check_Array(myArray)) {
    $("#movieresult tbody").empty();
    for(var x =0; x < myArray.length; x++){
      var poster= "";
      if(myArray[x].hasOwnProperty("Poster") && myArray[x].Poster != "N/A") poster ="<img class='img-fluid' style='max-width: 100%; height: auto;' src='" + myArray[x].Poster + "'><br>";
      var newRowContent = "<tr><td>" + myArray[x].Title + "</td><td>" + myArray[x].Year +"<td><td>" + poster +"</td><tr>";
      $("#movieresult tbody").append(newRowContent);
    }
  } else{
  alert("Fehler bei der Verarbeitung !");
  }
}
function check_Array(myArray) {
  if(typeof myArray === 'object' && myArray instanceof Array) { 
    return true;
  } else{
    return false;
  }
}