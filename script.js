//Global Variables
const numVillagersShown = 6;
let numVillagersIncrement = 0;
const totalVillagers = 488;
const acKey = '9162d778-d8bc-4629-b3a6-f54f33165f66';
let searchQuery = '';

// The firstLoad() function will run when the page first loads and will call loadList()
function firstLoad() {
    loadList();
}

// The loadList function will make the fetch request to the API to retrieve the villager data

// The add more button will filter whether or not the user is looking at all users or they are filtering for a specific species
// This is done by checking if there is a searchQuery present 
function addMore() {
    if (searchQuery.length > 0) {
        return filterList();
    } else {
        return loadList();
    };
};

// This function will fire if the showAll button is pressed. It will reset the increment back to 0, clear the searchQuery and clear the current villager container 
function showAll() {
    numVillagersIncrement = 0;
    searchQuery = '';
    document.getElementById('villagerContainer').innerHTML = "";
    loadList();
}

function loadList() {
    // Adding the "villager-loading" class will make the spinner appear while its retrieving the data 
    document.querySelector('#spinner').classList.add('villager-loading');

    // The fetch request allows us to make asynchronous HTTP requests, in this case, to the Animal Crossing API
    fetch('https://api.nookipedia.com/villagers?api_key=' + acKey)
        .then(response => response.json())
        .then(data => {
            // The villager data retrieved from the fetch request is passed into the "addToContainer()" function
            addToContainer(data);
        })
        .catch(error => {
            console.error('Error: ', error);
        })
        // Once the promise is completed, it calls a callback function. In this case, it is an anonymous function that will remove the "villager-loading" class from the spinner 
        .finally(() => document.querySelector('#spinner').classList.remove('villager-loading'));

}

function addToContainer(result) {

    // Create the container that will hold all the villager cards
    let villagerContainer = document.querySelector('#villagerContainer');

    // Currently the array equals the result. If the user filtered for a specific species then then all results show 
    let villagerArr = result;

    // As the data from the API returns an array containing all 488 villagers, we will slice the array so we only show 6 villagers on first load. If the user chooses a species filter, it will show all the animals in the data array
    // The array of villagers data will be stored in the variable "villagerArr"

    if (result.length == 488) {
        villagerArr = result.slice(numVillagersIncrement, numVillagersShown + numVillagersIncrement);
    }

    // The "Load More" button will only show if the villager array length is equal to the number of villagers shown or if the length is less than the total number of villagers
    if (villagerArr.length === numVillagersShown || villagerArr.length < result.length) {
        document.querySelector('#loadMoreBtn').style.display = 'block';
    } else {
        document.querySelector('#loadMoreBtn').style.display = 'none';
    };

    // The event listener for the "Load More" button will increase the number of villagers shown by 6 when clicked.
    document.getElementById('loadMoreBtn').addEventListener('click', event => {
        event.preventDefault();

        if (villagerArr.length < result.length) {
            numVillagersIncrement += 6;
        }
    });

    // The for loop will loop through the villager array and dynamically create a card that will display the villager's information
    for (let i = 0; i < villagerArr.length; i++) {
        //Create Villager Card 
        let card = document.createElement('div');
        card.classList.add('villager-card');

        //Add villager image 
        let img = document.createElement('img');

        $.get(villagerArr[i]['icon_uri'])
            .done(() => {
                img.src = villagerArr[i]['image_url'];
            })
            .fail(() =>{
                // If the image is unable to load, a filler image will display instead
                img.src = 'https://static.wikia.nocookie.net/animalcrossing/images/d/d6/3f52d308e63bbaf1bfced2d240a7f107.jpg/';
            })

        card.appendChild(img);

        //Add villager name 
        let name = document.createElement('h2');
        name.innerText = villagerArr[i].name;
        name.classList.add('villager-name');

        card.appendChild(name);

        // Create a list of Villager Traits 
        let villagerTraits = document.createElement('ul');

        //Personality type 
        let personality = document.createElement('li');
        personality.innerText = 'Personality: ' + villagerArr[i].personality;
        villagerTraits.appendChild(personality);

        // Birthday  
        let birthday = document.createElement('li');
        birthday.innerText = 'Birthday: ' + villagerArr[i]['birthday_month'] + " " + villagerArr[i]['birthday_day'];
        villagerTraits.appendChild(birthday);

        //Species 
        let species = document.createElement('li');
        species.innerText = 'Species: ' + villagerArr[i].species;
        villagerTraits.appendChild(species);

        //Catchphrase
        let catchphrase = document.createElement('li');
        // As the catchphrase data is given in all in lower case, when we display it on the card, we will select the first character at the 0 index and captitalize it
        // Then we concatenate the remaining characters of the catchphrase
        catchphrase.innerText = 'Catchphrase: ' + '"' + villagerArr[i]['phrase'].charAt(0).toUpperCase() + villagerArr[i]['phrase'].slice(1) + '"';
        villagerTraits.appendChild(catchphrase);

        //Add the list of traits to the card 
        card.appendChild(villagerTraits);

        //Add the card to the container 
        villagerContainer.appendChild(card);
    }

}

const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
    button.addEventListener('click', handleClick, false);
});

function handleClick(e) {

    if (e.target.matches('button')) {
        // reset increment,clear search query if present, and the container 
        numVillagersIncrement = 0;
        searchQuery = "";
        document.getElementById('villagerContainer').innerHTML = "";

        searchQuery = "&species=" + e.target.textContent;
        filterList();
    };
};

function filterList() {
       document.querySelector('#spinner').classList.add('villager-loading');

       fetch('https://api.nookipedia.com/villagers?api_key=' + acKey + searchQuery)
           .then(response => response.json())
           .then(data => {
               addToContainer(data);
           })
           .catch(error => {
               console.error('Error: ', error);
           })
           .finally(() => document.querySelector('#spinner').classList.remove('villager-loading'));
}