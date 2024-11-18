window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};

let displayTerm = "";
function searchButtonClicked(){
    console.log("searchButtonClicked() called");

    const API_URL = "https://api.scryfall.com/cards/named?exact=";




    const results = parseInput(removeCommasAndApostrophes(document.querySelector("#searchterm").value));
    console.log(document.querySelector("#searchterm").value);
    console.log(results);

    let url  = "";
    for(let i = 0; i < results.length; i++)
    {
        url = API_URL + results[i].name;
        console.log(url);
        getData(url);
        pauseWithSetTimeout();

        url = "";
    }
    


    //10
    //document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    //11
    console.log(url);

    // 12 Request data!
    
    
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
      if (true) {
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

 function parseInput(input) {
    // Define the regular expression to match 'num name' format
    const regex = /(\d+)\s*([a-zA-Z\s]+)/g;
    const result = [];
    let match;
  
    // Use regex.exec() to find all matches in the input string
    while ((match = regex.exec(input)) !== null) {
      // Create an object with 'num' and 'name' properties
      const obj = {
        num: parseInt(match[1], 10),  // Convert num to an integer
        name: match[2].trim()         // Trim name to remove extra spaces
      };
  
      // Push the object into the result array
      result.push(obj);
    }
  
    return result;
  }

  function pauseWithSetTimeout() {
    setTimeout(() => {
      console.log("Pause complete after 50 milliseconds");
    }, 50);
  }
  function removeCommasAndApostrophes(input) {
    // Use replace() with a regular expression to remove commas and apostrophes
    return input.replace(/[,'"]/g, '');
  }
