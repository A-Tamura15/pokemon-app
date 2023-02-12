import { useEffect, useState } from "react";
import "./styles/styles.css";
import Card from "./components/Card/Card";
import Navbar from "./components/Navbar/Navbar";
import { getAllPokemon, getPokemon, getPokemonType } from "./utils/pokemon";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon/";
  const initialSpeciesURL = "https://pokeapi.co/api/v2/pokemon-species/";
  const [loading, setLoading] = useState(true);
  const [pokemonSpeciesData, setPokemonSpeciesData] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonTypesData, setPokemonTypesData] = useState([]);
  const [nextUrl, setNextUrl] = useState();
  const [nextSpeciesUrl, setNextSpeciesUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();
  const [prevSpeciesUrl, setPrevSpeciesUrl] = useState();
  const [nextVisible, setNextVisible] = useState(true);
  const [prevVisible, setPrevVisible] = useState(false);

  useEffect(() => {
    const fetchPokemonData = async () => {
      // 全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL, false);
      let res2 = await getAllPokemon(initialSpeciesURL, true);
      // 各ポケモンの詳細データを取得
      await loadPokemon(res.results, false);
      await loadPokemon(res2.results, true);
      setLoading(false);
      setNextUrl(res.next);
      setNextSpeciesUrl(res2.next);
      setPrevUrl(res.previous);
      setPrevSpeciesUrl(res2.previous);
    };
    fetchPokemonData();
  }, []);
  const loadPokemon = async (data, species_flg) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    if (species_flg) {
      setPokemonSpeciesData(_pokemonData);
    } else {
      setPokemonData(_pokemonData);
      typesPokemon(_pokemonData);
    }
  };

  const typesPokemon = async (data, species_flg) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        const pokemonsTypes = async (pokemon) => {
          let pokemonTypes = await Promise.all(
            pokemon.types.map((type) => {
              let pokemonRecord = getPokemon(type.type.url);
              return pokemonRecord;
            })
          );
          return pokemonTypes;
        };
        return pokemonsTypes(pokemon);
      })
    );
    setPokemonTypesData(_pokemonData);
  };

  const handleNextPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    let data2 = await getAllPokemon(nextSpeciesUrl);
    // 各ポケモンの詳細データを取得
    await loadPokemon(data.results, false);
    await loadPokemon(data2.results, true);
    setLoading(false);
    setNextUrl(data.next);
    setNextSpeciesUrl(data2.next);
    setPrevUrl(data.previous);
    setPrevSpeciesUrl(data2.previous);
    data.next ? setNextVisible(true) : setNextVisible(false);
    setPrevVisible(true);
    window.scrollTo(0, 0);
  };
  const handlePrevPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    let data2 = await getAllPokemon(prevSpeciesUrl);
    // 各ポケモンの詳細データを取得
    await loadPokemon(data.results, false);
    await loadPokemon(data2.results, true);
    setLoading(false);
    setNextUrl(data.next);
    setNextSpeciesUrl(data2.next);
    setPrevUrl(data.previous);
    setPrevSpeciesUrl(data2.previous);
    data.previous ? setPrevVisible(true) : setPrevVisible(false);
    setNextVisible(true);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中...</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return (
                  <Card
                    key={i}
                    pokemon={pokemon}
                    pokemon2={pokemonSpeciesData[i]}
                    types={pokemonTypesData[i]}
                  />
                );
              })}
            </div>
            <div className="btn">
              {prevVisible ? (
                <button onClick={handlePrevPage}>前へ</button>
              ) : null}
              {nextVisible ? (
                <button onClick={handleNextPage}>次へ</button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
