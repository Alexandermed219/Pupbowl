const playerContainer = document.querySelector('#all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-ET-WEB-PT-A';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}/players`);
        const player = await response.json();
        return player;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`);
        const result = await response.json();
        return result;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

function newPlayerForm(){
    newPlayerFormContainer.innerHTML = `
    <form >
        
        <div class="row">
            <div class= "col-1">
                <label for="puppyForm">Name:</label>
            </div>
            <div class= "col-2">
                <input id="puppyName" type="text"/>
            </div>
        </div>
        <div class="row">
            <div class= "col-1">
                <label>Breed:</label>
            </div>
            <div class= "col-2">
                <input id="dogBreed" type="text" />
            </div>
        </div>
        <div class="row">
            <div class= "col-1">
                <label>Status:</label>
            </div>
            <div class= "col-2">
                <input id="dogStatus" type="text" />
            </div>
        </div>
        <div class="row">
            <div class= "col-1">
                <label>Image URL:</label>
            </div>
            <div class= "col-2">
                <input id="dogPicture" type="text" />
            </div>
        </div>
    
        <button class="submit" type="submit">Submit</button>
    </form>
  `
}


const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${APIURL}/players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(playerObj)
        
        });
        const result = await response.json();
        console.log(result);
        fetchAllPlayers();
        window.location.reload();

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const renderNewPlayer = async ()=>{

    newPlayerFormContainer.addEventListener('submit', async function(e) {
        e.preventDefault();
        const dogName = document.getElementById('puppyName').value;
        const dogBreed = document.getElementById('dogBreed').value;
        const dogStatus = document.getElementById('dogStatus').value;
        const URL = document.getElementById('dogPicture').value;
    
        const newPuppy = {
            name: dogName,
            breed: dogBreed,
            status: dogStatus,
            imageUrl: URL
        };
    
        await addNewPlayer(newPuppy);
        const puppies = await fetchAllPlayers();
        renderAllPlayers(puppies);
    })
}
const removePlayer = async (playerId) => {
    
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`,
            {
                method: 'DELETE',
            }
        );
            const result = await response.json();
            console.log(result);
            fetchAllPlayers();
            window.location.reload();
    }catch (err) {
        console.error(
                        `Whoops, trouble removing player #${playerId} from the roster!`,err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
* @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    
    try {   
        
        const playerListTemplate = playerList.map(players =>  
            `
            <div id = "playersTemplate" class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src=${players.imageUrl} alt="Avatar" style="width:300px;height:300px;">
                        
                    </div>
                    <div class="flip-card-back">
                        <h1 id = "space">Name: ${players.name}</h2>
                        <h2 id = "space">Breed: ${players.breed}</h3>
                        <h2 id = "space">Status: ${players.status}</h3>
                        <button class= "button" data-id= ${players.id}> Delete </button>
                    </div>
                </div>
            </div>`);
          playerContainer.innerHTML = playerListTemplate.join('');
        

    }
    
    catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

playerContainer.addEventListener('click', async (e) => {
    e.preventDefault();
    if(e.target.matches('button')){
        const temp = e.target.textContent;
    
        if(temp === " Details ")
        {
            const id= e.target.dataset.id;
        
            const players = await fetchAllPlayers();
            renderAllPlayers(players.data.players);

        }else if (temp === " Delete ")
        {
            const id= e.target.dataset.id;
            await removePlayer(id);
            const players = await fetchAllPlayers();
            renderAllPlayers(players.data.players);
        }
        
    }
    
})

const init = async () => {
    const player = await fetchAllPlayers();
    console.log(player);
    console.log(player.data.players);
    renderAllPlayers(player.data.players);
    newPlayerForm();
    renderNewPlayer();
}

init();

