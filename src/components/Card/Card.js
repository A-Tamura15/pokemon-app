import React from "react";
import "../../styles/styles.css";

function Card({ pokemon, pokemon2, types }) {
  // console.log(pokemon);
  // console.log(pokemon2);
  console.log(types);
  return (
    <div className="card">
      <div className="cardImg">
        <img
          src={pokemon.sprites.front_default}
          alt=""
        />
      </div>
      <div className="cardNo">No.{pokemon2.id.toString().padStart(4, "0")}</div>
      <h3 className="cardName">{pokemon2.names[0].name}</h3>
      <div className="cardTypes">
        <div>タイプ</div>
        <span>
        {types.map((type) => {
          return (
            <div key={type.names[0].name} className={`${type.name} type`}>
              <span className="typeName">{type.names[0].name}</span>
            </div>
          );
        })}
        </span>
      </div>
      <div className="cardInfo">
        <div className="cardData">
          <p className="title">分類：{pokemon2.genera[0].genus}</p>
          <p className="title">高さ：{(pokemon.height / 10).toFixed(1)}m</p>
          <p className="title">重さ：{(pokemon.weight / 10).toFixed(1)}kg</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
