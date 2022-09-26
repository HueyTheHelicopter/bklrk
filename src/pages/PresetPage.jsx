import React, { useState, useEffect, useContext } from 'react';
import { useFetching } from '../hooks/useFetching';
import '../styles/App.css';
import PresetList from '../components/PresetList';
import PostService from '../API/PostService';
import Loader from '../components/UI/Loader/Loader';
import { RefetchContext } from '../context';

function Presets() {

const [msg, setMsg] = useState("");
const [presets, setPresets] = useState([]);
const { refetch, setRefetch } = useContext(RefetchContext)


const [fetchPresets, isDataLoading, Error] = useFetching(async () => {
    const response = await PostService.getPresets();
    
      response.length === 0 ?
        setMsg("You have no presets")
        : setMsg(null); setRefetch(false)

    setPresets(response);
  })

  useEffect(() => {
    fetchPresets();
  }, [refetch])

  return (
    <div className="App">
      <hr style={{margin:'15px 0'}}/>
      {(Error || msg) && 
        <h1 style={{display: 'flex', justifyContent: 'center', marginTop: 50}}>An Error occured: "{(Error || msg)}"</h1>
      }
      {isDataLoading
        ? <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}>
            <Loader/>
          </div>
        :
          <PresetList presets={presets} title={"Presets"}/>
      }
    </div>
  );
}

export default Presets;