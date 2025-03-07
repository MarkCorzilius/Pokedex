async function init() {
  let pokemonData = await fetchPokemonData();
  renderPokemonCards(pokemonData);
  fetchPokemonType(pokemonData);
}

window.onload = init;

function renderPokemonCards(pokemonData) {
  let container = document.getElementById("pokemon-container");

  for (let i = 0; i < pokemonData.length; i++) {
    container.innerHTML += createPokemonCard(pokemonData[i]);
  }
}

async function fetchPokemonData() {
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`);
    let data = await response.json();

    for (let i = 0; i < data.results.length; i++) {
      let pokemon = data.results[i].name;
      let pokemonData = await handleFetch(pokemon);
      pokemonDetails.push(pokemonData);
    }
    return pokemonDetails;
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    return [];
  }
}

async function handleFetch(pokeParameter) {
  let pokemon = pokeParameter;
  let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  let pokemonData = await pokemonResponse.json();

  let types = pokemonData.types.map((typeInfo) => typeInfo.type.name);
  let imgUrl = pokemonData.sprites.other["official-artwork"].front_default;

  const pokemonInstance = {
    id: pokemonData.id,
    name: capitalizeWords(pokemonData.name),
    imgUrl: imgUrl,
    types: types,
  };
  return pokemonInstance;
}

async function fetchPokemonType(pokemonData) {
  for (let i = 0; i < pokemonData.length; i++) {
    checkTypeColor(pokemonData[i]);
    renderTypeIcons(pokemonData[i]);
  }
}

function checkTypeColor(pokemon) {
  let primaryType = pokemon.types[0] + "-bg";
  let card = document.getElementById(`pokemon-card${pokemon.id}`);
  if (card) {
    card.style.backgroundColor = typeColors[primaryType];
  }
}

function renderTypeIcons(pokemon) {
  let iconContainerRef = document.getElementById(`pokemon-types${pokemon.id}`);

  if (!iconContainerRef) return;

  for (let i = 0; i < pokemon.types.length; i++) {
    let type = pokemon.types[i];

    if (typeColors[`${type}-bg`]) {
      iconContainerRef.innerHTML += `<img class="type-icon" src="assets/icons/poke-type-icons/${type}.svg" alt="${type}">`;
    }
  }
}

function capitalizeWords(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showOverlay(pokemonInfo) {
  document.getElementById("pokemonOverlay").style.display = "flex";
  getInfoOverlay(pokemonInfo);
  checkOverlayBgColor(pokemonInfo);
}

function closeOverlay() {
  document.getElementById("pokemonOverlay").style.display = "none";
}

function checkOverlayBgColor(pokemonInfo) {
  let overlayBody = document.getElementById("overlay-body");

  if (!overlayBody) return;

  let primaryType = pokemonInfo.types[0] + "-bg";
  overlayBody.style.backgroundColor = typeColors[primaryType] || "#fff"; // Fallback-Farbe
}

function renderOverlayTypeIcons(pokemon) {
  let typeContainer = document.getElementById(`overlay-pokemon-types${pokemon.id}`);

  if (!typeContainer) return;

  typeContainer.innerHTML = ""; // Lösche vorherige Inhalte, falls vorhanden

  for (let i = 0; i < pokemon.types.length; i++) {
    let type = pokemon.types[i];

    if (typeColors[`${type}-bg`]) {
      typeContainer.innerHTML += `
          <img class="type-icon" src="assets/icons/poke-type-icons/${type}.svg" alt="${type}">
        `;
    }
  }
}

async function fetchMorePokemons() {
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    let data = await response.json();

    let newPokemonList = [];
    let newPokemonHTML = [];

    for (let i = 0; i < data.results.length; i++) {
      let pokemonData = await handleFetch(data.results[i].name);
      pokemonDetails.push(pokemonData);
      newPokemonList.push(pokemonData);
      newPokemonHTML.push(createPokemonCard(pokemonData));
    }

    document.getElementById("pokemon-container").innerHTML += newPokemonHTML.join("");
    offset += limit;
    fetchPokemonType(newPokemonList);
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
  }
}
