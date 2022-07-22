import React from 'react';
import CameraItem from './CameraItem';

const CamList = ({cameras, title}) => {


    return (
        <div>
            <h1 style={{textAlign: 'center'}}>
                {title}
            </h1>
            {cameras
            .sort((a, b) => a.id > b.id ? 1 : -1)
            .map((camera) =>
              <CameraItem camera={camera} key={camera.id}/>
            )}
        </div>
    );
};

export default CamList;