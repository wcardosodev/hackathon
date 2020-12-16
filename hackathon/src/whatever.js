import React, { useState, useEffect } from 'react';
import * as THREE from 'three';

import './css/video-with-overlay.css';
import MatchVideo from './media/video/first_vid.mp4';

const MyComponent = () => {
  const [defensiveLinePts, setDefensiveLinePts] = useState([]);

  const data = {
    events: [{}],
    player_positions: [{}],
  };

  useEffect(() => {
    const width = 1280;
    const height = 720;
    const aspect = width / height;
    const viewAngle = 45; // Higher = closer, essentially zoom
    const near = 0.1;
    const far = 1000;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    document
      .getElementById('video-with-overlay')
      .appendChild(renderer.domElement)
      .setAttribute('id', 'canvas-overlay');

    const camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    const material = new THREE.LineBasicMaterial({ color: 'white' });

    // 0, 0, 0 is center of the scene, for Vector3s
    const points = [];
    points.push(new THREE.Vector3(-73.5, -5, 0));
    points.push(new THREE.Vector3(0, -41.5, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(0, 41.5, 0));
    points.push(new THREE.Vector3(73.5, 5, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);

    scene.add(line);

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    renderer.render(scene, camera);
  });

  // document.getElementById('video').addEventListener(
  //   'loadedmetadata',
  //   function () {
  //     this.currentTime = 50;
  //   },
  //   false
  // );

  const loadEvent = (eventObj) => {
    // events as list
    // click on event

    // goes to video at time of event
    const video = document.getElementById('video');
    video.currentTime = eventObj.event_time; // event.time
    video.play(); // plays then pauses due to needing to rerender image
    video.pause();

    // then adds new vector line
    // setDefensiveLinePts()
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="column is-three-quarters">
            <div id="video-with-overlay">
              <video
                id="video"
                controls
                // autoPlay
                muted
                src={MatchVideo}
                type="video/mp4"
              />
            </div>
          </div>
          <div className="column is-one-quarter">
            <button
              className="loadButton"
              onClick={() => loadEvent({ event_time: 75 })}
            >
              Load Event
            </button>
            {
              //event list to select
            }
          </div>
        </div>
      </section>
    </>
  );
};

export default MyComponent;

// {
//   events: [
//     {
//       event_id: 123,
//       ...otherproperties
//     }
//   ],
//   player_positions_based_on_events: [
//     {
//       event_id: 123,
//       players: [
//         {
//           player_id: 1,
//           x_pos: 23,
//           y_pos: 25
//         },
//         {
//           player_id: 2,
//           x_pos: 32,
//           y_pos: 23
//         }
//       ]
//     }
//   ]
// }
