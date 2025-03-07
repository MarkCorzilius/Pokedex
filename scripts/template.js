function createPokemonCard(pokemonDetails) {
  return `
    <div id="pokemon-card${pokemonDetails.id}" class="pokemon-card" onclick='showOverlay(${JSON.stringify(pokemonDetails)})'>
        <div class="pokemon-header">
            <span class="pokemon-number">${pokemonDetails.id}</span>
            <span class="pokemon-name">${pokemonDetails.name}</span>
        </div>
        <div class="pokemon-image">
            <img src="${pokemonDetails.imgUrl}" alt="Pokemon Image">
        </div>
        <div id="pokemon-types${pokemonDetails.id}" class="pokemon-types">
    
        </div>
    </div>
    `;
}

function getInfoOverlay(pokemon) {
  let contentRef = document.getElementById("pokemonOverlay");
  contentRef.innerHTML = "";
  contentRef.innerHTML = `      <div class="overlay-content" onclick="event.stopPropagation()">
            <div class="overlay-header">
              <span class="overlay-pokemon-id">#${pokemon.id}</span>
              <span class="overlay-pokemon-name">${pokemon.name}</span>
            </div>
            <div id="overlay-body">
              <div class="overlay-pokemon-image">
                <img src="${pokemon.imgUrl}" alt="Pokemon Image" />
              </div>
              <div class="overlay-pokemon-types" id="overlay-pokemon-types${pokemon.id}">

              </div>
            </div>
            <div class="overlay-tabs">
              <button class="overlay-tab active">main</button>
              <button class="overlay-tab">stats</button>
              <button class="overlay-tab">evo chain</button>
            </div>
            <div class="overlay-details">
              <p><span>Height</span>: 2 m</p>
              <p><span>Weight</span>: 100 kg</p>
              <p><span>Base experience</span>: 263</p>
              <p><span>Abilities</span>: overgrow, chlorophyll</p>
            </div>
          </div>`;

  renderOverlayTypeIcons(pokemon);
}
