import React, { useState, useEffect } from 'react';
import * as THREE from 'three';

import { LoadButton } from './Button';
import './css/video-with-overlay.css';
import MatchVideo from './media/video/first_vid.mp4';

import freeze_frame_events from './data/freeze_frame.json';

const MyComponent = () => {
  // Setup Renderer
  const width = 1280;
  const height = 720;
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(width, height);

  const // Setup scene
  scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
  scene.add( camera );
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);

  useEffect(() => {
    document
      .getElementById('video-with-overlay')
      .appendChild(renderer.domElement)
      .setAttribute('id', 'canvas-overlay');
  });

  // null defensive line, means none been found
  // 0.0 is the keeper, 1.0 is closest line to keeper, 2.0 is next line etc
  // const event_teams = {
  //   home_team: freeze_frame_events.filter(
  //     (event) => event.freeze_frame_team_id === 231.0
  //   ),
  //   away_team: freeze_frame_events.filter(
  //     (event) => event.freeze_frame_team_id === 24.0
  //   ),
  // };

  const defensive_line_one = {
    defending_team: freeze_frame_events.filter(
      (event) =>
        event.freeze_frame_team_id === 231.0 && event.defensive_line_id === 1.0
    ),
    attacking_team: freeze_frame_events.filter(
      (event) =>
        event.freeze_frame_team_id === 24.0 && event.defensive_line_id === 1.0
    ),
  };

  const createPointsInScene = (points) => {
    const material = new THREE.LineBasicMaterial({ color: 'white' });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);

    scene.add(line);
    renderer.render(scene, camera);
  };

  const loadEvent = ({ event_time, event_defending_line }) => {
    // goes to video at time of event
    const video = document.getElementById('video');
    if (video === null) return;
    try {
      video.currentTime = event_time; // event.time
      video.play(); // plays then pauses due to needing to rerender image
      video.pause();
    } catch (err) {
      console.log('i am error');
    }

    const defending_line = event_defending_line.map(
      (player) =>
        new THREE.Vector3(player.freeze_frame_x, player.freeze_frame_y, 0)
    );

    console.log(defending_line);
    // then adds new vector line
    createPointsInScene(defending_line);
  };

  const main_event = {
    event_time: 4,
    event_defending_line: defensive_line_one.defending_team,
  };

  return (
    <>
      <section className="section">
        <div className="container">
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
          <div className="container margin-top-md">
            <LoadButton class="loadButton" fn={() => loadEvent(main_event)} text="Load Button" />
          </div>
          <div className="container margin-top-lg">
            <div className="panel">
              <h2 className="panel-heading">Events</h2>
              {
                //event list to select
                freeze_frame_events.map((event, index) => {
                  return(
                    <a key={index} href className="panel-block is-active">
                      <div className="panel-block">
                        <span className="panel-icon">
                          <i className="fas fa-book" aria-hidden="true"></i>
                        </span>
                        {event.event_uuid}
                      </div>
                    </a>
                  )
                })
              }
            </div>
          </div>
      </section>
    </>
  );
};

export default MyComponent;
