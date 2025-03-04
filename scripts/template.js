function createPokemonCard(pokemonDetails) {
  return `
    <div id="pokemon-card${pokemonDetails.id}" class="pokemon-card" onclick="showOverlay()">
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
