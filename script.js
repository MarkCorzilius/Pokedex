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
async function handleFetch(pokemon) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  let data = await response.json();
  return formatPokemonData(data);
}

async function formatPokemonData(data) {
  return {
    id: data.id,
    name: capitalizeWords(data.name),
    imgUrl: data.sprites.other["official-artwork"].front_default,
    types: data.types.map((typeInfo) => typeInfo.type.name),
    height: data.height,
    weight: data.weight,
    baseExperience: data.base_experience,
    abilities: data.abilities.map((a) => capitalizeWords(a.ability.name)),
  };
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

async function fetchPokemonList() {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  let data = await response.json();
  return data.results;
}

async function fetchPokemonDetails(pokemonList) {
  let newPokemonList = [];
  let newPokemonHTML = [];

  for (let i = 0; i < pokemonList.length; i++) {
    let pokemonData = await handleFetch(pokemonList[i].name);
    pokemonDetails.push(pokemonData);
    newPokemonList.push(pokemonData);
    newPokemonHTML.push(createPokemonCard(pokemonData));
  }

  return { newPokemonList, newPokemonHTML };
}

async function fetchMorePokemons() {
  if (!enforcePokemonRenderLimit()) return;

  let pokemonList = await fetchPokemonList();
  let { newPokemonList, newPokemonHTML } = await fetchPokemonDetails(pokemonList);

  document.getElementById("pokemon-container").innerHTML += newPokemonHTML.join("");
  offset += limit;
  fetchPokemonType(newPokemonList);
}

function enforcePokemonRenderLimit() {
  if (offset >= 200) {
    alert("Limit of 200 Pokémon reached!");
    return false;
  } else return true;
}

function filterRenderedPokemons() {
  const input = document.getElementById("search-input").value.toLowerCase();
  const allRenderedPokemons = document.querySelectorAll(".pokemon-card");

  for (let i = 0; i < allRenderedPokemons.length; i++) {
    let pokemonName = allRenderedPokemons[i].querySelector(".pokemon-name").textContent.toLowerCase();

    if (pokemonName.includes(input)) {
      allRenderedPokemons[i].style.display = "block";
    } else {
      allRenderedPokemons[i].style.display = "none";
    }
  }
}

function switchOverlayTab(tabName, clickedButton) {
  const allTabs = document.querySelectorAll(".overlay-tab");

  allTabs.forEach((tab) => tab.classList.remove("active"));

  clickedButton.classList.add("active");

  renderTabContent(tabName);
}

function renderTabContent() {}
