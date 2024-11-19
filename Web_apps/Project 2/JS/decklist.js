window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClickedDeckList};
window.onload = (e) => {document.querySelector("#Type").addEventListener("change", updateButtonAction)};
let displayTerm = "";
let results;


updateButtonAction();
function updateButtonAction() {
  let selector = document.querySelector("#Type");
  console.log(selector);
  let selectorValue = selector.value;
  let button = document.querySelector("#search");

  if (selectorValue === "Partial_Matches") {
    button.onclick = action1;
  } else if (selectorValue === "Bulk_Proxy") {
    button.onclick = searchButtonClickedDeckList;
  }
}


function searchButtonClickedDeckList(){
  clearGrid();
  displayTerm = "";
    console.log("searchButtonClicked() called");

    const API_URL = "https://api.scryfall.com/cards/named?exact=";




    results = parseInput(removeCommasAndApostrophes(document.querySelector("#searchterm").value));
    console.log(document.querySelector("#searchterm").value);
    console.log(results);

    let url  = "";
    for(let i = 0; i < results.length; i++)
    {
        
        console.log(url);
        for (let j = 0; j < results[i].num; j++)
        {
          url = API_URL + results[i].name;
          getData(url);
        
          pauseWithSetTimeout();
  
          url = "";
        }
        
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

let legalityselector = document.querySelector("#Format");
let legalityselectorValue = legalityselector.value;



switch (legalityselectorValue)
{
  case "Standard":
    addImage(obj.image_uris.normal, (obj.legalities.standard == "legal"));
  break;

  case "Pioneer":
    addImage(obj.image_uris.normal, (obj.legalities.pioneer == "legal"));

  break;

  case "Modern":
    addImage(obj.image_uris.normal, (obj.legalities.modern == "legal"));

  break;

  case "Legacy":
    addImage(obj.image_uris.normal, (obj.legalities.legacy == "legal"));

  break;

  default:

}

results.find(asdf => asdf.name === removeCommasAndApostrophes(obj.name)).imgUrl = obj.image_uris.normal;


 }

 function dataError(e)
 {
     console.log("An error ossured");
 }


function addImage(imgurl, valid)
 {
    const imageUrl = imgurl;  

    if (imageUrl) {
      if (true) {
        const anchor = document.createElement('a');
        anchor.href = imageUrl;
        anchor.target = '_blank';  
  
        const img = document.createElement('img');
      if (!valid)
      {
        img.style.filter = 'sepia(100%) saturate(500%) hue-rotate(-50deg)';
      }
        img.src = imageUrl;
  
        anchor.appendChild(img);
        imageGrid.appendChild(anchor);
  
      }
    } else {
      alert('Please enter an image URL.');
    }
 }

 function parseInput(input) {
    const regex = /(\d+)\s*([a-zA-Z\s]+)/g;
    
    const result = [];
    let match;
  
    while ((match = regex.exec(input)) !== null) {
      const obj = {
        num: parseInt(match[1], 10),  
        name: match[2].trim(),        
        imgUrl: ""
      };
  
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
    return input.replace(/[,'"]/g, '');
  }

  function clearGrid() {
    const grid = document.getElementById('imageGrid');
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
  }



 document.getElementById('changePageButton').addEventListener('click', function() {

  localStorage.setItem('imagePath', JSON.stringify(results));
  console.log(results);
  const url = "decklist.html";  
  window.open(url, '_blank');
});