//
var dataFound=0;
var dataPerPage=10;
//
function get_movie_result(){
  var search = $("#search").val();
  alert (search);
  if (search != null || search != "") {
    $.ajax({
        url: "http://www.omdbapi.com/?s="+search+"&r=json&apikey=xxxxxxxxxx",
        dataType: 'json',
        success: function(data) {
         var dataAsText = JSON.stringify(data);
         $('.jason').append(dataAsText);
       },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
              alert(textStatus, errorThrown);
       }
     });
   }
}
