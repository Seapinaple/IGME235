 // 1
 window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
 // 2
 let displayTerm = "";
 
 
 // 3
 function searchButtonClicked(){
     console.log("searchButtonClicked() called");

     //1
     const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

     //2
     let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";

     //3
     let url = GIPHY_URL;
     url += "api_key=" + GIPHY_KEY;

     //4
     let term = document.querySelector("#searchterm").value;
     displayTerm = term;

     //5
     term = term.trim();

     //6
     term = encodeURIComponent(term);

     //7
     if (term.length < 1) return;

     //8
     url += "&q=" + term;

     //9
     let limit = document.querySelector("#limit").value;
     url += "&limit=" + limit;

     //10
     document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

     //11
     console.log(url);

     // 12 Request data!
     getData(url);
     
 }
 

 function getData(url)
 {
     console.log("call");
     //1
     let xhr = new XMLHttpRequest();

     //2
     xhr.onload = dataLoaded;

     //3
     xhr.onerror = dataError;

     //4
     xhr.open("GET", url);
     xhr.send();
 }

 function dataLoaded(e)
 {
     console.log("call1");

     //5
     let xhr = e.target;

     //6
     console.log(xhr.responseText);

     //7
     let obj = JSON.parse(xhr.responseText);

     //8
     if (!obj.data || obj.data.length == 0)
     {
         document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>"
         return;
     }

     //9
     let results = obj.data;
     console.log("Results.length = " + results.length)
     let bigString = "";

     //10
     for (let i = 0; i < results.length; i++)
     {
         let result = results[i];

         //11
         let smallURL = result.images.fixed_width_downsampled.url;
         if (!smallURL) smallURL = "images/no-image-found.png";

         //12
         let url = result.url;

         //13
         let line = `<div class = 'result'><a target = '_blank' href = '${url}'><img src = '${smallURL}' title = '${result.title}' alt = '${result.title}'/></a>`;
         line += `<span><a target = '_blank' href = '${url}'>${result.title}</a><p>Rating: ${result.rating.toUpperCase()}</p></div>`;

         //14

         //15
         bigString += line;
     }

     //16
     document.querySelector("#content").innerHTML = bigString;

     //17
     document.querySelector("#status").innerHTML = "<b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p></b>"
 }

 function dataError(e)
 {
     console.log("An error ossured");
 }