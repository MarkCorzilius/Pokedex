async function init() {
  let pokemonData = await fetchPokemonData();
  renderPokemonCards(pokemonData);
  fetchPokemonType(pokemonData);
}

function renderPokemonCards(pokemonData) {
  let container = document.getElementById("pokemon-container");

  for (let i = 0; i < pokemonData.length; i++) {
    container.innerHTML += createPokemonCard(pokemonData[i]);
  }
}

async function fetchPokemonData() {
  document.getElementById("spinner").style.display = "block";
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`);
    let data = await response.json();

    return await LoopThroughPokemonData(data);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    return [];
  } finally {
    document.getElementById("spinner").style.display = "none";
  }
}

async function LoopThroughPokemonData(data) {
  for (let i = 0; i < data.results.length; i++) {
    let pokemon = data.results[i].name;
    let pokemonData = await handleFetch(pokemon);
    pokemonDetails.push(pokemonData);
  }
  return pokemonDetails;
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
    stats: data.stats.map((stat) => stat.base_stat),
    chain: [],
  };
}

async function fetchPokemonSpecies(pokemonName) {
  try {
    await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
    accessPokemonChain(pokemonName);
  } catch (error) {
    console.error(`Error in fetchPokemonSpecies: ${error}`);
  }
}

async function accessPokemonChain(pokemonName) {
  try {
    let evolutionData = await showEvolutionChain(pokemonName);

    return await findPokemonInArrays(evolutionData, pokemonName);
  } catch (error) {
    console.error(`Error in accessPokemonChain: ${error}`);
  }
}

async function findPokemonInArrays(evolutionData, pokemonName) {
  let pokemon = pokeChains.find((p) => p.name.toLowerCase() === pokemonName.toLowerCase());

  if (pokemon) {
    pokemon.chain = evolutionData;
  }

  let pokemonInDetails = pokemonDetails.find((p) => p.name.toLowerCase() === pokemonName.toLowerCase());

  if (pokemonInDetails) {
    pokemonInDetails.chain = evolutionData;
  }
}

async function showEvolutionChain(pokemonName) {
  try {
    return await retrieveEvoChain(pokemonName);
  } catch (error) {
    console.error("Fehler beim Abrufen der Evolution-Kette:", error);
    return [];
  }
}

async function retrieveEvoChain(pokemonName) {
  pokeChains = [];
  let speciesData = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`).then((r) => r.json());

  let evolutionChainData = await fetch(speciesData.evolution_chain.url).then((r) => r.json());

  await extractEvolutionData(evolutionChainData.chain);

  return pokeChains;
}

async function extractEvolutionData(chain) {
  if (!chain) return;

  let name = chain.species.name;

  let pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((r) => r.json());

  pokeChains.push({ name, img: pokemonData.sprites.front_default });

  for (let evolution of chain.evolves_to) {
    await extractEvolutionData(evolution);
  }
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

async function showOverlay(pokemonInfo) {
  document.body.style.overflow = "hidden";
  document.getElementById("pokemonOverlay").style.display = "flex";
  currentPokemon = pokemonInfo;
  await fetchPokemonSpecies(pokemonInfo.name);

  getInfoOverlay(pokemonInfo);
  checkOverlayBgColor(pokemonInfo);
}

function closeOverlay() {
  document.body.style.overflow = "auto";
  document.getElementById("pokemonOverlay").style.display = "none";
  deleteChainsAfterUsage();
}

function deleteChainsAfterUsage() {
  pokemonDetails.forEach((pokemon) => (pokemon.chain = null));
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

  typeContainer.innerHTML = "";

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
  document.getElementById("pokemon-container").style.display = "none";
  document.getElementById("spinner").style.display = "block";
  document.getElementById("batchPokemonsBtn").style.display = "none";
  try {
    let pokemonList = await fetchPokemonList();
    let { newPokemonList, newPokemonHTML } = await fetchPokemonDetails(pokemonList);

    document.getElementById("pokemon-container").innerHTML += newPokemonHTML.join("");
    offset += limit;
    fetchPokemonType(newPokemonList);
  } catch (error) {
    console.error("Error fetching data", error);
  } finally {
    document.getElementById("pokemon-container").style.display = "grid";
    document.getElementById("batchPokemonsBtn").style.display = "block";
    document.getElementById("spinner").style.display = "none";
  }
  scrollToBottom();
}

function enforcePokemonRenderLimit() {
  if (offset >= 1000) {
    alert("Limit of 1000 Pokémon reached!");
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

async function switchOverlayTab(tabName, clickedButton) {
  const allTabs = document.querySelectorAll(".overlay-tab");

  allTabs.forEach((tab) => tab.classList.remove("active"));

  clickedButton.classList.add("active");

  await renderTabContent(tabName);
}

async function renderTabContent(tabName) {
  let tabsContainerRef = document.getElementById("overlay-details");
  tabsContainerRef.innerHTML = "";

  switch (tabName) {
    case "main":
      tabsContainerRef.innerHTML = createOverlayDetailsMain(currentPokemon);
      break;

    case "stats":
      tabsContainerRef.innerHTML = getStatsTemplate(currentPokemon);
      break;

    case "evochain":
      try {
        tabsContainerRef.innerHTML = `<p>Loading evolution chain...</p>`;

        await fetchPokemonSpecies(currentPokemon.name);

        let updatedPokemon = pokemonDetails.find((p) => p.name.toLowerCase() === currentPokemon.name.toLowerCase());

        tabsContainerRef.innerHTML = getEvoChainTemplate(updatedPokemon);
      } catch (error) {
        console.error("Error fetching evolution chain:", error);
      }
      break;

    default:
      tabsContainerRef.innerHTML = createOverlayDetailsMain(currentPokemon);
      break;
  }
}

function changeOverlayPage(direction, pokemonId) {
  if (direction === "previous" && pokemonId > 1) {
    pokemonId--;
  } else if (direction === "next" && pokemonId < offset) {
    pokemonId++;
  } else return;

  deleteChainsAfterUsage();

  let newPokemon = pokemonDetails.find((p) => p.id === pokemonId);
  showOverlay(newPokemon);
}

function scrollToBottom() {
  setTimeout(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  }, 300);
}
