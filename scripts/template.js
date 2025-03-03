function createPokemonCard(pokemonDetails) {
  return `
    <div class="pokemon-card">
        <div class="pokemon-header">
            <span class="pokemon-number">${pokemonDetails.id}</span>
            <span class="pokemon-name">${pokemonDetails.name}</span>
        </div>
        <div class="pokemon-image">
            <img src="${pokemonDetails.imgUrl}" alt="Pokemon Image">
        </div>
        <div class="pokemon-types">
        ${pokemonDetails.types
          .map(
            (type) =>
              `<img class="type-icon" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-iii/colosseum/3.png" alt="">`
          )
          .join("")}
        </div>
    </div>
    `;
}
