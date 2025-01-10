const baseUrl = "https://cdn.contentful.com/spaces/";

const SPACE_ID = localStorage.getItem("space_id");
const ACCESS_TOKEN = localStorage.getItem("access_token");
const apiURL = `${baseUrl}${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}&content_type=artist`;

const fetchArtists = async () => {
  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error("HTTP-fel! Något gick snett i förfrågan.");
    }

    const data = await response.json();

    const artistsWithDetails = data.items.map((artist) => {
      const genreId = artist.fields.genre.sys.id;
      const stageId = artist.fields.stage.sys.id;
      const dayId = artist.fields.day.sys.id;

      const genre = data.includes.Entry.find((entry) => entry.sys.id === genreId);
      const stage = data.includes.Entry.find((entry) => entry.sys.id === stageId);
      const day = data.includes.Entry.find((entry) => entry.sys.id === dayId);

    
      return {
        name: artist.fields.name,
        description: artist.fields.description,
        genre: genre.fields.name,
        stageName: stage.fields.name,  
        stageDescription: stage.fields.description, 
        stageArea: stage.fields.area,  
        dayName: day.fields.description,  
        dayDate: new Date(day.fields.date).toLocaleDateString("sv-SE"),
      };
    });


    const artistContainer = document.getElementById("artists-container");
    const artistHTML = artistsWithDetails.map((artist) => {
      return `<div class="artist-card">
                <h3>${artist.name}</h3>
                <p><strong>Genre:</strong> ${artist.genre}</p>
                <p><strong>Stage:</strong> ${artist.stageName},
                  ${artist.stageDescription}, Area: ${artist.stageArea}</p>  
                <p><strong>When:</strong> ${artist.dayName} (${artist.dayDate})</p>  
                <p><strong>About</strong> ${artist.description}<br></p>
              </div>`;
    });


    artistContainer.innerHTML = artistHTML.join("");
  } catch (error) {
    console.error("Ett fel inträffade vid hämtning av data:", error);
  }
};

fetchArtists();

