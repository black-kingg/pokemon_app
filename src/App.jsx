import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "./index.css";
import { typeColors, statName } from "./setup";

function App() {
	const [currentList, setCurrentList] = useState([]);
	const [selectedPokemon, setSelectedPokemon] = useState(null);
	const [selectedSpecies, setSelectedSpecies] = useState(null);
	const [currentlyShowingAmount, setCurrentlyShowingAmount] = useState(0);
	const [maxIndex, setMaxIndex] = useState(29);

	// Function for fetching data and updating the state
	async function fetchData() {
		try {
			// Fetch data from the Pokemon API
			const response = await fetch(
				"https://pokeapi.co/api/v2/pokemon/?limit=898"
			);
			const data = await response.json();

			const pokemonList = data.results.map((pokemon, index) => ({
				id: index + 1,
				name: pokemon.name,
				types: [],
			}));

			for (let i = 0; i < 18; i++) {
				const typeResponse = await fetch(
					`https://pokeapi.co/api/v2/type/${i + 1}`
				);
				const typeData = await typeResponse.json();

				const pokemonInType = typeData.pokemon;

				for (let j = 0; j < pokemonInType.length; j++) {
					const pokemonId = pokemonInType[j].pokemon.url
						.split("/")
						.slice(-2)[0];
					if (pokemonId <= pokemonList.length) {
						pokemonList[pokemonId - 1].types.push(typeData.name);
					}
				}
			}

			setCurrentList(pokemonList);
			//console.log(pokemonList);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		function handleScroll() {
			if (
				window.innerHeight + window.scrollY >=
					document.body.offsetHeight - 100 &&
				currentlyShowingAmount < currentList.length
			) {
				// Increase maxIndex when near the bottom and more items are available
				setMaxIndex((prevMaxIndex) => prevMaxIndex + 10);
			}
		}

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [currentList, currentlyShowingAmount]);

	async function openInfo(id) {
		const urlPokemon = "https://pokeapi.co/api/v2/pokemon/" + id;
		const urlSpecies = "https://pokeapi.co/api/v2/pokemon-species/" + id;

		try {
			const responsePokemon = await fetch(urlPokemon);
			const responseSpecies = await fetch(urlSpecies);
			const pokemon = await responsePokemon.json();
			const species = await responseSpecies.json();

			console.log(pokemon);
			console.log(species);
			console.log(pokemon.abilities);

			setSelectedPokemon(pokemon);
			setSelectedSpecies(species);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}

	function handlePokemonClick(pokemon) {
		openInfo(pokemon.id);
	}

	return (
		<div className="w-screen px-12">
			<div className="bg-white flex w-full md:w-8/12 p-4 mt-5 ml-0 md:ml-20 shadow-md rounded-3xl">
				<input
					className="flex-1 outline-none text-base text-blue-900 font-semibold"
					placeholder="Search your Pokemon"
				></input>
				<div className="bg-[#FF5350] text-white flex justify-center items-center w-10 h-10 drop-shadow-[5px_8px_10px_rgba(255,83,80,0.533)] rounded-xl">
					<AiOutlineSearch size={20} />
				</div>
			</div>
			<div className="min-h-screen flex flex-col md:flex-row justify-center items-center">
				<div>
					<div className="flex flex-wrap relative md:w-[75%] md:mt-24">
						{currentList.slice(0, maxIndex).map((pokemon) => (
							<div
								key={pokemon.id}
								className="bg-white flex flex-col justify-center items-center w-[42%] md:w-[22%] rounded-lg m-1 md:m-10 pt-10 p-5 relative cursor-pointer  hover:border-gray-300 shadow-md hover:shadow-none"
								onClick={() => handlePokemonClick(pokemon)}
							>
								<img
									className="absolute top-[-55px] pixelated transition duration-100  hover:scale-125"
									src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
									alt={pokemon.name}
								/>
								<span className="text-base text-gray-300 font-semibold ">
									N°{pokemon.id}
								</span>
								<h2 className="text-base  font-semibold mt-2">
									{pokemon.name}
								</h2>
								<div className="flex mt-2 space-x-2">
									{pokemon.types.map((type, Index) => (
										<div
											key={Index}
											className={`px-2 md:px-3 py-1 text-xs md:text-sm text-white rounded-md`}
											style={{ background: typeColors[type] }}
										>
											{type}
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="bg-white w-[27%] h-[70vh] md:fixed right-[calc(10vw-60px)] px-1 py-5 text-center bottom-0 mb-0 rounded-3xl ">
					{selectedPokemon && (
						<div className="flex flex-col justify-center items-center">
							<img
								className="absolute top-[-112px] pixelated transition duration-100 h-[126px]"
								src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${selectedPokemon.id}.gif`}
								alt={selectedPokemon.name}
							/>
							<div className="flex flex-col justify-center items-center relative overflow-y-scroll">
								<div className="h-full mt-3 flex flex-col justify-center items-center">
									<span className="text-base text-gray-300 font-semibold">
										N°{selectedPokemon.id}
									</span>
									<h2 className="text-base font-semibold">
										{selectedPokemon.name}
									</h2>
									<div className="flex mt-2 space-x-2">
										{selectedPokemon.types.map((typeData, Index) => (
											<div
												key={Index}
												className={`px-3 py-1 text-sm text-white rounded-md`}
												style={{ background: typeColors[typeData.type.name] }}
											>
												{typeData.type.name}
											</div>
										))}
									</div>
									<div className="mt-5">
										<span className="text-base font-semibold">
											Pokedex Entry
										</span>
										<div className="text-gray-400 font-medium text-sm mt-2">
											{selectedSpecies.flavor_text_entries[0].flavor_text}
										</div>
									</div>
									<div className="mt-5 w-full">
										<div className="grid grid-cols-2 mt-2 space-x-4 m-2">
											<div className="flex flex-col space-y-3">
												<span className="font-semibold">Height</span>
												<span className=" font-medium text-sm px-10 py-3 bg-gray-100 rounded-2xl">
													{selectedPokemon.height}
												</span>
											</div>
											<div className="flex flex-col space-y-3">
												<span className="font-semibold">Weight</span>
												<span className="font-medium text-sm px-10 py-3 bg-gray-100 rounded-2xl">
													{selectedPokemon.weight}
												</span>
											</div>
										</div>
									</div>
									<div className="mt-5">
										<span className="text-base font-semibold">Abilities</span>
										<div className="grid grid-cols-2 space-x-4 mt-2">
											{selectedPokemon.abilities
												.slice(0, 2)
												.map((abilityType, Index) => (
													<div
														key={Index}
														className="font-medium text-sm px-10 py-3 bg-gray-100 rounded-2xl"
													>
														{abilityType.ability.name}
													</div>
												))}
										</div>
									</div>
									<div className="mt-5">
										<span className="text-base font-semibold">Stats</span>
										<div className="flex space-x-4 mt-2">
											{selectedPokemon.stats.map((stat, index) => (
												<div
													key={index}
													className="flex flex-col font-medium text-sm p-1 rounded-3xl bg-gray-100 space-y-2"
												>
													<span
														className="w-auto p-1 h-auto rounded-2xl"
														style={{ background: statName[index].color }}
													>
														{statName[index].name}
													</span>
													<span>{stat.base_stat}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
