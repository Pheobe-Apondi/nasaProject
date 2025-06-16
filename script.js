const apodUrl= 'https://api.nasa.gov/planetary/apod?api_key=pbds0fTDZhOfIBHhe8G5L5fzvSRJrfILJPKgJyOv'

let currentSol = 1000;

const marsUrl=`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${currentSol}&api_key=pbds0fTDZhOfIBHhe8G5L5fzvSRJrfILJPKgJyOv`




async function fetchApod(){
    try{
        const response = await fetch (apodUrl)
        const data = await response.json()
        console.log(data)

        document.getElementById("title").textContent = data.title;
        document.getElementById('date').textContent = data.date;
        const imageElement = document.getElementById('apodImage');
        imageElement.src = data.url;
        imageElement.alt = data.title;

        const description = document.getElementById('description');
        description.textContent = data.explanation;
        imageElement.style.display = 'block'

    }catch(error){
          console.log("Error Fetching APOD:",error)
          document.getElementById('description').textContent = "Failed to load APOD"

    }
}

fetchApod()

let isLoading = false; 
async function fetchNextSolWithPhotos() {

    try{
          while (true) {
        const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${currentSol}&api_key=pbds0fTDZhOfIBHhe8G5L5fzvSRJrfILJPKgJyOv`);
        const data = await response.json();
        const photos = data.photos;
        if (photos.length > 0) {
            displayMarsImages(photos);
            break;
        } else {
            currentSol++; 
        }
    }

    }catch(error){
        console.log("Error fetching Mars Images:", error);
         document.getElementById('marsImagesContainer').textContent = "Failed to load Mars Images. Please try again";
         isLoading = false;

    }
    
}

fetchNextSolWithPhotos() 

function displayMarsImages(photos) {
    const container = document.getElementById('marsImagesContainer');
    container.innerHTML = ''
    photos.slice(0, 8).forEach(photo => {
        const card = document.createElement('div');
        card.classList.add('mars-card');
        const img = document.createElement('img');
        img.src = photo.img_src;
        img.alt = `Mars Rover - ${photo.rover.name}`;
        const likeBtn = document.createElement('button');
        likeBtn.classList.add('like-btn');

        likeBtn.innerHTML = '<i class="fa-solid fa-heart" style="color: #E0E4EB;"></i>';

        likeBtn.addEventListener('click', () => {
            likeBtn.classList.toggle('liked');
            const icon = likeBtn.querySelector('i');
            const isLiked = likeBtn.classList.contains('liked');
            icon.style.color = isLiked ? 'red' : 'white';
            if (isLiked) saveFavourites(photo);
        });
        card.appendChild(img);
        card.appendChild(likeBtn);
        container.appendChild(card);
    });
    document.getElementById('currentSolDisplay').textContent = `Sol: ${currentSol}`;
    currentSol++; 
    isLoading = false;
}



document.getElementById('nextBtn').addEventListener('click', () => {
    currentSol++;
    fetchNextSolWithPhotos();
});
document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentSol > 0) {
        currentSol--;
        fetchNextSolWithPhotos();
    }
});


function getSavedFavorites(){
    return JSON.parse(localStorage.getItem('favorites')) || []

};

function saveFavourites(photo){
    const favorites = getSavedFavorites()
    if(!favorites.some(fav=>fav.id === photo.id)){
        favorites.push(photo);
        localStorage.setItem('favorites',JSON.stringify(favorites))
        displayFavorites()
    }
}

function displayFavorites(){
    const favorites = getSavedFavorites()
    const favoritesContainer = document.querySelector('.favoritesContent')
    favoritesContainer.innerHTML = ''
    favorites.forEach(photo=>{
        const card = document.createElement('div')
           card.classList.add('mars-card');
            const img = document.createElement ('img')
            img.src = photo.img_src;
            img.alt = `Saved Mars Image - ${photo.rover.name}`
            card.appendChild(img)
        favoritesContainer.appendChild(card)

            

    })
}


displayFavorites()

function clearFavorites() {
    localStorage.removeItem('favorites'); 
    const favoritesContainer = document.querySelector('.favoritesContent');
    favoritesContainer.innerHTML = ''; 
}