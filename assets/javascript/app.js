// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

//Capitalize Each Word
function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

// Initial array of gifs and vars
var colors = ["Blue","Red","Yellow","Blue","Green","Red"];
var limit=10;
var offset=0;
var currentGif = "";
var favorites = JSON.parse(localStorage.getItem("favorites"));
var topics = JSON.parse(localStorage.getItem("topics"));

if(favorites === null){
  var favorites ={
  title:[],
  source:[],
  rating:[]
  }
}

if (topics === null){
  var topics = ["Elephant", "Breaking Bad", "Spider-Man", "Airplane","Computers"];
}

// displayGifInfo function re-renders the HTML to display the appropriate content
function displayGifInfo() {
  var backgroundColor = 0;
  var queryURL ="https://api.giphy.com/v1/gifs/search?q="+currentGif+"&api_key=hhBv85lxTTC42VBNDR2XgvLeyH4or0R1&limit="+limit+"&offset="+offset;

  // Creating an AJAX call for the specific gif button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // $("#gifs-view").empty();
    for(i=0;i<limit;i++){
      var newDiv = $("<div></div>");
      var gifContainer = $("<div></div>");
      var titleGif = $("<p></p>");
      var newGif = $("<img>");
      var newRating = $("<p></p>");
      var downloadBtn = $("<a download target='_blank'></a>");
      var favBtn = $("<button></button>");
      //Var depends of data
      var title = response.data[i].title.split("GIF")[0];
      var src = response.data[i].images.original.url.split("?cid")[0];
      //Add class, attributes and text to 
      $(newDiv).addClass("col-md-3 col-sm-6");
      $(gifContainer).addClass("gif-container"+" "+colors[backgroundColor]);
      $(titleGif).addClass("title-Gif").text(titleCase(title));
      $(newGif).attr('src', src.replace(/\.gif/i, "_s.gif")).addClass("gif");
      $(newRating).addClass("rating").text("Rating: "+response.data[i].rating.toUpperCase());
      $(downloadBtn).addClass("DownloadButton").attr('href',src).text("Go to Original");
      $(favBtn).addClass("FavoriteButton").attr("data-title",title).attr("data-src-gif",src.replace(/\.gif/i, "_s.gif"));
      $(favBtn).attr("data-rating",response.data[i].rating);
      $(favBtn).html('<i class="fa-hover-hidden fa fa-star-o" aria-hidden="true"></i><i class="fa-hover-show fa fa-star" aria-hidden="true"></i>');
      //Append Everything
      $(gifContainer).append(titleGif).append(newGif).append(newRating).append(downloadBtn).append(favBtn);
      $(newDiv).append(gifContainer);
      $("#gifs-view").append(newDiv);
      //Change class for Background Color on each gif
      backgroundColor++;
      if (backgroundColor==6){
        backgroundColor=0;
      }
    }
    $(".additional-gifs").html(' <input class="more-gifs col" id="add-more-gif" type="submit" value="Add More Gifs!"></input>');   
  });
}

// Function for displaying gif data
function renderButtons() {
  $("#buttons-view").empty();
  var buttonColor = 0;
  for (var i = 0; i < topics.length; i++) {
    var a = $("<a>");
    var del = $("<button>");
    del.addClass("delBtn Red").attr("data-del",i).html('<i class="fa fa-times" aria-hidden="true"></i>');
    a.addClass("gif-btn col btn btn-light "+colors[buttonColor]);
    a.attr("data-name", topics[i]);
    a.text(topics[i]);
    $("#buttons-view").append(a).append(del);
    //Change class for Background Color each button
    buttonColor++;
    if (buttonColor==6){
      buttonColor=0;
    }
  }
}

//Function display Favorites
function displayFavorites() {
  var backgroundColor = 0;
  $("#gifs-view").empty();
  $(".additional-gifs").empty();
    for(i=0;i<favorites.title.length;i++){
      var newDiv = $("<div></div>");
      var gifContainer = $("<div></div>");
      var titleGif = $("<p></p>");
      var newGif = $("<img>");
      var newRating = $("<p></p>");
      var delBtn = $("<button></button>");
      //Var depends of data
      var title = favorites.title[i];
      var src = favorites.source[i];
      //Add class, attributes and text to 
      $(newDiv).addClass("col-md-3 col-sm-6");
      $(gifContainer).addClass("gif-container"+" "+colors[backgroundColor]);
      $(titleGif).addClass("title-Gif").text(titleCase(title));
      $(newGif).attr('src', src).addClass("gif");
      $(newRating).addClass("rating").text("Rating: "+favorites.rating[i].toUpperCase());
      $(delBtn).addClass("delFav").attr("data-number",i).html('<i class="fa fa-times" aria-hidden="true"></i>');
      //Append Everything
      $(gifContainer).append(titleGif).append(newGif).append(newRating).append(delBtn);
      $(newDiv).append(gifContainer);
      $("#gifs-view").prepend(newDiv);
      //Change class for Background Color on each gif
      backgroundColor++;
      if (backgroundColor==6){
        backgroundColor=0;
      }
    }
}

// This function handles events where a add gif button is clicked
$("#add-gif").on("click", function(event) {
  event.preventDefault();
  var gif = $("#gif-input").val().trim();
  //Get Capitalized Array of Gifs
  var currentGifList = topics.map(function (e) { 
    return e.toUpperCase()
  });
  //Check if is not empty or is not already a button
  if(gif !== "" && currentGifList.indexOf(gif.toUpperCase())<0){
    topics.push(titleCase(gif));
    localStorage.setItem("topics",JSON.stringify(topics));
  }
  $("#gif-input").val("");
  renderButtons();
});

//Delete Button
$(document).on("click",".delBtn",function(){
  event.preventDefault();
  var index= $(this).attr("data-del");
  topics.splice(index,1);
  localStorage.setItem("topics",JSON.stringify(topics));
  renderButtons();
});

//Show Favorites
$("#show-favs").on("click",displayFavorites);

// This function handles events where a more gifs button is clicked
$(document).on("click","#add-more-gif", function(event) {
  event.preventDefault();
  console.log(offset);
  if(offset ===0){
    offset=10;
  }
  else{
    offset+=5;
  }
  console.log(offset);
  limit=5;
  displayGifInfo();
});

// Adding a click event listener to all elements with a class of "gif-btn"
$(document).on("click", ".gif-btn", function(){
  currentGif = $(this).attr("data-name");
  offset=0;
  limit=10;
  displayGifInfo(); 
  $("#gifs-view").empty();

});

//Clicking on add favorite Button
$(document).on("click",".FavoriteButton",function(){

  if(favorites.source.indexOf($(this).attr("data-src-gif"))<0){
    favorites.title.push($(this).attr("data-title"));
    favorites.source.push($(this).attr("data-src-gif"));
    favorites.rating.push($(this).attr("data-rating"));
    localStorage.setItem("favorites",JSON.stringify(favorites));
  }
});

//Delete Favorite
$(document).on("click",".delFav",function(){
  var index = $(this).attr("data-number");
  favorites.source.splice(index,1);
  favorites.title.splice(index,1);
  favorites.rating.splice(index,1);
  localStorage.setItem("favorites",JSON.stringify(favorites));
  displayFavorites();
});

// Calling the renderButtons function to display the intial buttons
renderButtons();

//Start/Stop Gif 
$('body').on('click', '.gif', function() {
    var src = $(this).attr("src");
  if($(this).hasClass('playing')){
    //Stop
    $(this).attr('src', src.replace(/\.gif/i, "_s.gif"))
    $(this).removeClass('playing');
  } else {
    //Play
    $(this).addClass('playing');
    $(this).attr('src', src.replace(/\_s.gif/i, ".gif"))
  }
});

//Scroll back to top
$(document).on("click", "#topBtn", topFunction );

