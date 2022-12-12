import axios from "axios";
import React, { useState } from "react";

export default function Pokemon({ nama, deskripsi, image, id }) {
  const serverHost = "http://localhost:5000";
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [editNama, setNama] = useState("");
  const [editDeskripsi, setDeskripsi] = useState("");

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const handleClickModalEdit = () => {
    setIsOpenModalEdit(!isOpen);
  };
  const deletePokemon = (e) => {
    axios.delete(`${serverHost}/pokemon/delete/${nama}`).then((res) => {
      console.log(res);
    });
    window.location.reload();
  };
  function handleUpdate(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("nama", editNama);
    formData.append("deskripsi", editDeskripsi);
    axios
      .put(`${serverHost}/pokemon/${nama}`, {
        nama: editNama,
        deskripsi: editDeskripsi,
      })
      .then((res) => {
        console.log(res);
        setIsOpen(!isOpen);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  let modal = "";
  let modalEdit = "";
  if (isOpen) {
    modal = (
      <div className="modal">
        <div className="modal-inner">
          <div className="modal-header"></div>
          <div className="modal-introduction">
            <h2>{nama}</h2>
            <p>{deskripsi}</p>
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
  if (isOpenModalEdit) {
    modalEdit = (
      <div className="modal">
        <div className="modal-inner">
          <div className="modal-header"></div>
          <div className="modal-introduction">
            <form
              onSubmit={(event) => {
                handleUpdate(event);
              }}
            >
              <p>Nama</p>
              <input
                name="nama"
                placeholder={nama}
                type={"text"}
                value={editNama}
                onChange={(event) => {
                  setNama(event.target.value);
                }}
              />

              <p>Deskripsi</p>
              <textarea
                name="deskripsi"
                placeholder={deskripsi}
                value={editDeskripsi}
                onChange={(event) => {
                  setDeskripsi(event.target.value);
                }}
              />
              <input
                style={{ marginTop: "10px" }}
                type={"submit"}
                value={"Simpan"}
              />
            </form>
            <button
              onClick={() => {
                setIsOpenModalEdit(!isOpenModalEdit);
              }}
              style={{ marginTop: "10px" }}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pokemon-card">
        <div className="pokemon-item">
          <p>{nama}</p>
          <img src={image} alt="Pokemon List" />
        </div>
        <button onClick={() => handleClick()}>Detail Pokemon</button>
        <button onClick={() => handleClickModalEdit()}>Edit Pokemon</button>
        {modal}
        {modalEdit}
      </div>
    </>
  );
}
