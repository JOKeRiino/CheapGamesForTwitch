
const game_api_url = 'https://www.cheapshark.com/api/1.0/deals?'
const game_stores_url = 'https://www.cheapshark.com/api/1.0/stores'
let gameStores;
let api_query = 'storeID=1,25,4,7,8,13';
let pageSize = '&pageSize=20';

const requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

//  Get data about the stores and logos
async function getStoreData() {
    const response = await fetch(game_stores_url, requestOptions)
    const data = await response.json();
    gameStores = data;
}

//  API fetch request on game data
async function getGameData(query, pageSize) {
    // Show the loading animation
    const loader = document.getElementById('alien-loader');
    loader.style.display = 'flex';

    let game_cat_url = game_api_url + query + pageSize;

    const response = await fetch(game_cat_url, requestOptions);
    const data = await response.json();
    console.log(data);

    setTimeout(function(){
        getGameInfo(data);
    }, 1000);
}

//  Build website components with fetched data
function getGameInfo(data) {
    let gameList = document.getElementById('gameList');
    let count = 1;

    for(const game of data) {
        let liElem = document.createElement('li');
        // let liLink = document.createElement('a');
        let liTitle = document.createElement('h2');
        let dealRating = document.createElement('span');
        let gamePrice = document.createElement('span');
        let savings = document.createElement('span');
        let storeImg = document.createElement('img');

        // liLink.classList.add('item-link');
        liElem.classList.add('list-item');
        gamePrice.classList.add('game-price');
        savings.classList.add('savings');
        dealRating.classList.add('deal-rating');
        storeImg.classList.add('store-img');

        let gameTitle = count + '. ' + game.title
        if (gameTitle.length > 19) {
            gameTitle = gameTitle.substr(0,16) + '...'
        }

        liTitle.textContent = gameTitle.substr(0,19);
        // liLink.href = 'https://www.cheapshark.com/redirect?dealID=' + game.dealID
        // liLink.target = '_blank';
        // liLink.title = 'Open in Browser';
        
        dealRating.textContent = 'deal rating: ' + game.dealRating;
        gamePrice.textContent = game.salePrice + '$';

        //different colors for sale percentages
        if (parseInt(game.savings) <= 50) {
            savings.style.color = 'yellow';
        }
        else {
            if (parseInt(game.savings) <= 75) {
                savings.style.color = 'orange';
            }
            else if(parseInt(game.savings) >= 95) {
                savings.style.color = '#f72585'
                savings.style.textShadow = '0 0 4px #f72585'
            }
        }

        savings.textContent = '-' + parseInt(game.savings) + '%';

        for(store of gameStores) {
            if(game.storeID === store.storeID) {
                storeImg.src = 'https://www.cheapshark.com' + store.images.logo;
            }
        }

        // liElem.appendChild(liLink);
        liElem.appendChild(liTitle);
        liElem.appendChild(dealRating);
        liElem.appendChild(gamePrice);
        liElem.appendChild(savings);
        liElem.appendChild(storeImg);
        const loader = document.getElementById('alien-loader');
        loader.style.display = 'none';
        gameList.appendChild(liElem);
        count++;
    }
}

//  Refetch API with different category
function resetGameData(option) {
    //remove all contents of the old list:
    let oldList = document.getElementById('gameList');
    oldList.innerHTML = '';

    //Switch cases for chosen option
    switch (option.id) {
        case 'all-opt':
            console.log(option.id + ' found');
            api_query = 'storeID=1,25,15,7,8,13';
            getGameData(api_query,pageSize)
            break;
        case 'steam-opt':
            console.log(option.id + ' found');
            api_query = 'storeID=1';
            getGameData(api_query,pageSize);
            break;
        case 'gog-opt':
            console.log(option.id + ' found');
            api_query = 'storeID=7';
            getGameData(api_query,pageSize);
            break;
        case 'origin-opt':
            console.log(option.id + ' found');
            api_query = 'storeID=8';
            getGameData(api_query,pageSize);
            break;
        case 'uplay-opt':
            console.log(option.id + ' found');
            api_query = 'storeID=13';
            getGameData(api_query,pageSize);
            break;
        case 'fanatical-opt':
            console.log(option.id + ' found');
            api_query = 'storeID=15';
            getGameData(api_query,pageSize);
            break;
        case 'epic-opt':
            console.log(option.id + ' found');
            api_query = 'storeID=25';
            getGameData(api_query,pageSize);
            break;
        case 'underfive-opt':
            console.log(option.id + ' found');
            api_query = 'storeID=1,25,15,7,8,13&upperPrice=5';
            getGameData(api_query,pageSize);
            break;
        case 'aaa-opt':
            console.log(option.id + ' found');
            api_query = 'storeID=1,25,15,7,8,13&AAA=true';
            getGameData(api_query,pageSize);
            break;
    }
}

// Refetch API with different result count
function resetSizeData(numOption) {
    //remove all contents of the old list:
    let oldList = document.getElementById('gameList');
    oldList.innerHTML = '';

    //switch cases for numOptions
    switch (numOption.id) {
        case 'sixty-opt':
            pageSize = '&pageSize=60';
            getGameData(api_query,pageSize);
            break;
        case 'fourty-opt':
            pageSize = '&pageSize=40';
            getGameData(api_query,pageSize);
            break;
        case 'twenty-opt':
            pageSize = '&pageSize=20';
            getGameData(api_query,pageSize);
            break;
    }
}

function init() {
    getStoreData();
    getGameData(api_query, pageSize);
    console.log('App initialized!');
}

document.addEventListener('DOMContentLoaded', () => {

    const selected = document.querySelector('.selected');
    const selectedPages = document.querySelector('.selected-page')
    const optionsContainer = document.querySelector('.options-container');
    const optionsContainerPages = document.querySelector('.options-container-page');
    const optionsList = document.querySelectorAll('.option');
    const optionsListPages = document.querySelectorAll('.option-page');

    console.log('DOM loaded!');
    init();

    selected.addEventListener('click', () => {
        optionsContainer.classList.toggle('active');
    });

    optionsList.forEach( o => {
        let count = 0;
        o.addEventListener('click', () => {
            selected.innerHTML = o.querySelector('label').innerHTML;
            optionsContainer.classList.remove('active');
            if(count % 2 === 0) {
                resetGameData(o);
                count++;
            } else {count++;}
        })
    })

    selectedPages.addEventListener('click', () => {
        optionsContainerPages.classList.toggle('active');
    });

    optionsListPages.forEach( op => {
        let count = 0;
        op.addEventListener('click', () => {
            selectedPages.innerHTML = op.querySelector('label').innerHTML;
            optionsContainerPages.classList.remove('active');
            if(count % 2 === 0) {
                resetSizeData(op);
                count++;
            } else {count++;}
        })
    })
})