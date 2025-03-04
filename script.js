async function init() {
  let pokemonData = await fetchPokemonData();
  renderPokemonCards(pokemonData);
  fetchPokemonType(pokemonData);
}

window.onload = init;

function renderPokemonCards(pokemonData) {
  let container = document.getElementById("pokemon-container");
  container.innerHTML = "";

  for (let i = 0; i < pokemonData.length; i++) {
    container.innerHTML += createPokemonCard(pokemonData[i]);
  }
}

async function fetchPokemonData() {
  try {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0");
    let data = await response.json();

    let pokemonDetails = [];

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
    console.log(`Types for ${pokemonData[i].name}: ${pokemonData[i].types.join(", ")}`);
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

function showOverlay() {
  document.getElementById("pokemonOverlay").style.display = "flex";
}

function closeOverlay() {
  document.getElementById("pokemonOverlay").style.display = "none";
}
