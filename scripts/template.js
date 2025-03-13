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
            <div id="overlay-body" class="overlay-body">
              <div class="overlay-pokemon-image">
                <img class="overlay-pokemon-img" src="${pokemon.imgUrl}" alt="Pokemon Image" />
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

function getStatsTemplate(pokemon) {
  const statNames = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];
  let statsHTML = "";

  for (let i = 0; i < pokemon.stats.length; i++) {
    let statValue = pokemon.stats[i];
    let statName = statNames[i];

    statsHTML += `
        <div class="stat-row">
          <div class="stat-label">${statName}</div>
          <div class="stat-value">${statValue}</div>
          <div class="progress-container">
            <div class="progress-bar ${statValue >= 50 ? "green" : "red"}" style="width: ${(statValue / 150) * 100}%;"></div>
          </div>
        </div>`;
  }

  let totalStats = pokemon.stats.reduce((sum, stat) => sum + stat, 0);

  statsHTML += `
      <div class="stat-row">
        <div class="stat-label">Total</div>
        <div class="stat-value">${totalStats}</div>
        <div class="progress-container">
          <div class="progress-bar green" style="width: ${(totalStats / 900) * 100}%;"></div>
        </div>
      </div>`;

  return statsHTML;
}

function getEvoChainTemplate(pokemonDetails) {
  if (!pokemonDetails.chain || pokemonDetails.chain.length === 0) {
    return `<p>No evolution data available.</p>`;
  }

  let stages = pokemonDetails.chain
    .map(({ name, id }) => {
      let imgSrc = id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` : "";

      return `
          <div class="evo-stage">
              <img src="${imgSrc}" alt="${name}">
              <p>${name}</p>
          </div>
        `;
    })
    .join('<span class="arrow"> &gt;&gt; </span>');

  return `<div class="evo-chain">${stages}</div>`;
}
