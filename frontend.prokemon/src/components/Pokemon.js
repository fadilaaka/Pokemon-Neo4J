import axios from "axios";
import React, { useState } from "react";

export default function Pokemon({ name, introduction, image, id }) {
  const serverHost = "http://localhost:5000";
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const deletePokemon = (e) => {
    axios.delete(`${serverHost}/pokemon/delete/${name}`).then((res) => {
      console.log(res);
    });
    window.location.reload();
  };
  let modal = "";
  if (isOpen) {
    modal = (
      <div className="modal">
        <div className="modal-inner">
          <div className="modal-header"></div>
          <div className="modal-introduction">
            <h2>{name}</h2>
            <p>{introduction}</p>
          </div>
          <button onClick={() => handleClick()} className="modal-close-btn">
            Tutup
          </button>
          <button
            onClick={(e) => deletePokemon(e)}
            className="modal-close-btn"
            style={{ backgroundColor: "red" }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
  return (
    <div onClick={() => handleClick()} className="pokemon-card">
      <div className="pokemon-item">
        <p>{name}</p>
        <img src={image} alt="Pokemon List" />
      </div>
      {modal}
    </div>
  );
}
