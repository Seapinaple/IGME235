window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};

let displayTerm = "";
function searchButtonClicked(){
    console.log("searchButtonClicked() called");

    const API_URL = "https://api.scryfall.com";


    let url = API_URL;

    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    //5
    term = term.trim();

    //6
    term = encodeURIComponent(term);

    //7
    if (term.length < 1) return;

    //8
    url += "/cards/named?exact=" + term;


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

console.log(obj);

    addImage(obj.image_uris.normal);
 }

 function dataError(e)
 {
     console.log("An error ossured");
 }

 function addImage(imgurl)
 {
    const imageUrl = imgurl;  // Get the URL from the input

    if (imageUrl) {
      // Validate that the URL seems to be an image
      if (isValidImageUrl(imageUrl)) {
        // Create an anchor tag to wrap the image (optional for linking)
        const anchor = document.createElement('a');
        anchor.href = imageUrl;
        anchor.target = '_blank';  // Opens image in a new tab
  
        // Create the image element
        const img = document.createElement('img');
        img.src = imageUrl;
  
        // Add the image to the anchor and the anchor to the grid
        anchor.appendChild(img);
        imageGrid.appendChild(anchor);
  
        // Clear the input field after adding the image
        imageUrlInput.value = '';
      } else {
        alert('Please enter a valid image URL.');
      }
    } else {
      alert('Please enter an image URL.');
    }
 }

 function isValidImageUrl(url)
 {
    return true;
 }