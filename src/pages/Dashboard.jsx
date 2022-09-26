import React, { useState, useEffect, useContext } from 'react';
import { useFetching } from '../hooks/useFetching';
import '../styles/App.css';
import CamList from '../components/CamList';
import PostService from '../API/PostService';
import Loader from '../components/UI/Loader/Loader';
import { RefetchContext } from '../context';

function Dashboard() {

  const [cameras, setCamera] = useState([]);
  const { refetch, setRefetch } = useContext(RefetchContext)

  const [fetchCameras, isDataLoading, Error] = useFetching(async () => {
    const cams = await PostService.getCams();
    setCamera(cams);
  })

  useEffect(() => {
    fetchCameras();
  }, [refetch])

  return (
    <div className="App">
      <hr style={{margin:'15px 0'}}/>
      {Error && 
        <h1 style={{display: 'flex', justifyContent: 'center', marginTop: 50}}>An Error occured: "{Error}"</h1>
      }
      {isDataLoading
        ? <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}>
            <Loader/>
          </div>
        : <CamList cameras={cameras} title={'UVT Cameras'}/>
      }
    </div>
  );
}

export default Dashboard;
