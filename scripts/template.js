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
            <div id="overlay-tabs" class="overlay-tabs">
              <button class="overlay-tab active" onclick="switchOverlayTab('main', this)">main</button>
              <button class="overlay-tab" onclick="switchOverlayTab('stats', this)">stats</button>
              <button class="overlay-tab" onclick="switchOverlayTab('evochain', this)">evo chain</button>
            </div>
            <div id="overlay-details" class="overlay-details">${createOverlayDetailsMain(pokemon)}
            </div>
          </div>`;

  renderOverlayTypeIcons(pokemon);
}

function createOverlayDetailsMain(currentPokemon) {
  return `
      <p><strong>Height:</strong> ${currentPokemon.height / 10} m</p>
      <p><strong>Weight:</strong> ${currentPokemon.weight / 10} kg</p>
      <p><strong>Base Experience:</strong> ${currentPokemon.baseExperience}</p>
      <p><strong>Abilities:</strong> ${currentPokemon.abilities.join(", ")}</p>`;
}

function createOverlayDetailsStats() {
  return `<div class="stats">
        <div class="stat-row">
            <div class="stat-label">HP</div>
            <div class="stat-value">45</div>
            <div class="progress-container">
                <div class="progress-bar red" style="width: 45%;"></div>
            </div>
        </div>

        <div class="stat-row">
            <div class="stat-label">Attack</div>
            <div class="stat-value">60</div>
            <div class="progress-container">
                <div class="progress-bar green" style="width: 60%;"></div>
            </div>
        </div>

        <div class="stat-row">
            <div class="stat-label">Defense</div>
            <div class="stat-value">48</div>
            <div class="progress-container">
                <div class="progress-bar red" style="width: 48%;"></div>
            </div>
        </div>

        <div class="stat-row">
            <div class="stat-label">Sp. Atk</div>
            <div class="stat-value">65</div>
            <div class="progress-container">
                <div class="progress-bar green" style="width: 65%;"></div>
            </div>
        </div>

        <div class="stat-row">
            <div class="stat-label">Sp. Def</div>
            <div class="stat-value">65</div>
            <div class="progress-container">
                <div class="progress-bar green" style="width: 65%;"></div>
            </div>
        </div>

        <div class="stat-row">
            <div class="stat-label">Speed</div>
            <div class="stat-value">45</div>
            <div class="progress-container">
                <div class="progress-bar red" style="width: 45%;"></div>
            </div>
        </div>

        <div class="stat-row">
            <div class="stat-label">Total</div>
            <div class="stat-value">317</div>
            <div class="progress-container">
                <div class="progress-bar green" style="width: 80%;"></div>
            </div>`;
}
