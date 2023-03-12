import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChangeEvent } from 'react';
import "./AddItem.css";
import addItem from './Additem.api';

const headers = {
  "Content-Type": "multipart/form-data"
};

function AddItem() {
  const [details, setDetails] = useState({ name: "", price: "" });
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const navigate = useNavigate();


  const submitHandler = async () => {
    if (selectedImage != null) {
      const formData = new FormData();
      formData.append("image", selectedImage);
      addItem(formData, details.price, details.name).then((response) => {
        if (response == 0) {
          alert("succes");
          navigate('/');
        }
      });

    }
  };

  const imageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };



  return (
    <div className='bodyAdd'>
      <h1> add item</h1>
      <form onSubmit={submitHandler} encType='multipart/form-data' >
        <div className="form-group">
          <label>Name</label>
          <input className='form-control' required type="text" placeholder="name" name="name" onChange={e => setDetails({ ...details, name: e.target.value })} value={details.name} />
        </div>

        <div className="form-group">
          <label>price</label>
          <input className='form-control' required type="number" placeholder="price" name="price" onChange={e => setDetails({ ...details, price: e.target.value })} value={details.price} />
        </div>
        <div className="form-group file-area">
          <label>Images </label>

          <div className="file-dummy"></div>
          <input type="file" required name="image" onChange={imageChange} />

        </div>
        <div className="form-group">

          <input type="submit" value="upload" />

        </div>

      </form>


      <div >
        {selectedImage && <img className='imgAddForm'
          src={URL.createObjectURL(selectedImage)} />}
      </div>
    </div>
  );
}

export default AddItem;