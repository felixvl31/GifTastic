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

// Initial array of gifs
var topics = ["Elephant", "Breaking Bad", "Spider-Man", "Airplane","Computers"];
var colors = ["Blue","Red","Yellow","Blue","Green","Red"];
var limit=10;
var currentGif = "";

// displayGifInfo function re-renders the HTML to display the appropriate content
function displayGifInfo() {
  var backgroundColor = 0;
  var queryURL ="https://api.giphy.com/v1/gifs/search?q="+currentGif+"&api_key=hhBv85lxTTC42VBNDR2XgvLeyH4or0R1&limit="+limit;

  // Creating an AJAX call for the specific gif button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    $("#gifs-view").empty();
    console.log(response);
    for(i=0;i<limit;i++){
      var newDiv = $("<div></div>");
      var gifContainer = $("<div></div>");
      var newGif = $("<img>");
      var newRating = $("<p></p>");
      var downloadBtn = $("<a target='_blank'></a>");
      var src = response.data[i].images.original.url.split("?cid")[0];
      $(downloadBtn).attr('class',"DownloadButton").attr('href',src).text("Download");
      $(newGif).attr('src', src.replace(/\.gif/i, "_s.gif")).addClass("gif");
      $(newDiv).addClass("col-md-3 col-sm-6");
      $(gifContainer).addClass("gif-container"+" "+colors[backgroundColor]);
      $(newRating).addClass("rating");
      $(newRating).text("Rating: "+response.data[i].rating.toUpperCase());
      $(gifContainer).append(newGif).append(newRating).append(downloadBtn);
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
    var a = $("<button>");
    a.addClass("gif-btn col btn btn-light "+colors[buttonColor]);
    a.attr("data-name", topics[i]);
    a.text(topics[i]);
    $("#buttons-view").append(a);
    //Change class for Background Color each button
    buttonColor++;
    if (buttonColor==6){
      buttonColor=0;
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
  }
  renderButtons();
});

// This function handles events where a more gifs button is clicked
$(document).on("click","#add-more-gif", function(event) {
  event.preventDefault();
  console.log(limit);
  limit+=5;
  displayGifInfo();
});

// Adding a click event listener to all elements with a class of "gif-btn"
$(document).on("click", ".gif-btn", function(){
  currentGif = $(this).attr("data-name");
  displayGifInfo(); 
  limit=10;
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

$(document).on("click", "#myBtn", topFunction );

function download(file)
{
 window.location=file;
}

