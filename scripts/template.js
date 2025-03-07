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
              <button class="overlay-tab active" onclick="switchOverlayTab('main', this)">main</button>
              <button class="overlay-tab" onclick="switchOverlayTab('stats', this)">stats</button>
              <button class="overlay-tab" onclick="switchOverlayTab('evochain', this)">evo chain</button>
            </div>
            <div class="overlay-details">${createOverlayDetails(pokemon)}
            </div>
          </div>`;

  renderOverlayTypeIcons(pokemon);
}

function createOverlayDetails(pokemon) {
  return `
      <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
      <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
      <p><strong>Base Experience:</strong> ${pokemon.baseExperience}</p>
      <p><strong>Abilities:</strong> ${pokemon.abilities.join(", ")}</p>`;
}
