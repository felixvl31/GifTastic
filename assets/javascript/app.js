

//Capitalize Each Word
function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

 // Initial array of gifs
      var topics = ["Friends", "Breaking Bad", "Spider-Man", "Naruto"];

      // displayGifInfo function re-renders the HTML to display the appropriate content
      function displayGifInfo() {

        var gif = $(this).attr("data-name");
        var limit=12;
        var queryURL ="http://api.giphy.com/v1/gifs/search?q="+gif+"&api_key=hhBv85lxTTC42VBNDR2XgvLeyH4or0R1&limit="+limit;

        // Creating an AJAX call for the specific gif button being clicked
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
          console.log(response);
          $("#gifs-view").empty();
            for(i=0;i<limit;i++){
              var newDiv = $("<div></div>");
              var gifContainer = $("<div></div>");
              var newGif = $("<img>");
              var newRating = $("<p></p>");
              var src = response.data[i].images.original.url.split("?cid")[0];
              $(newGif).attr('src', src.replace(/\.gif/i, "_s.gif")).addClass("gif").attr("height", "180px").attr("width", "240px");
              $(newDiv).addClass("col-md-3 col-sm-6");
              $(gifContainer).addClass("gif-container");
              $(newRating).addClass("rating");
              $(newRating).text("Rating: "+response.data[i].rating.toUpperCase());
              $(gifContainer).append(newGif).append(newRating);
              $(newDiv).append(gifContainer);
              $("#gifs-view").append(newDiv);
            }
        });

      }

      // Function for displaying gif data
      function renderButtons() {
        $("#buttons-view").empty();
        for (var i = 0; i < topics.length; i++) {
          var a = $("<button>");
          a.addClass("gif-btn btn btn-outline-success");
          a.attr("data-name", topics[i]);
          a.text(topics[i]);
          $("#buttons-view").append(a);
        }
      }

      // This function handles events where a gif button is clicked
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

      // Adding a click event listener to all elements with a class of "gif-btn"
      $(document).on("click", ".gif-btn", displayGifInfo);

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