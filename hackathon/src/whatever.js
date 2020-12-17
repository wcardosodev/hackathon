import React, { useEffect } from 'react';
import * as THREE from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';

import './css/video-with-overlay.css';
import MatchVideo from './media/video/liv_atl_clip.mp4';

import line_breaking_pass_to_goal from './data/line_breaking_pass_to_goal.json';

const MyComponent = () => {
  // Setup Renderer
  const width = 1280;
  const height = 720;
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(width, height);

  // Setup scene
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    1,
    1000
  );
  scene.add(camera);
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);

  useEffect(() => {
    document
      .getElementById('video-with-overlay')
      .appendChild(renderer.domElement)
      .setAttribute('id', 'canvas-overlay');
  });

  const events = line_breaking_pass_to_goal.map((event) => event);

  const resetPointsInScene = () => {
    for (let i = scene.children.length - 1; i >= 0; i--) {
      const obj = scene.children[i];
      scene.remove(obj);
    }
  };

  const createPointsInScene = (points) => {
    const material = new MeshLineMaterial({ color: '#d82931', lineWidth: 6 });
    const line = new MeshLine();
    line.setPoints(points);
    const mesh = new THREE.Mesh(line, material);

    scene.add(mesh);
    renderer.render(scene, camera);
  };

  const createEventPlayerRing = ({
    freeze_frame_screen_x,
    freeze_frame_screen_y,
  }) => {
    const outerRingGeometry = new THREE.RingGeometry(65, 75, 32);
    const outerRingMaterial = new THREE.MeshBasicMaterial({
      color: '#040482', // 040482 // d82931
      side: THREE.DoubleSide,
    });
    const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
    outerRing.position.set(freeze_frame_screen_x, freeze_frame_screen_y, 0);
    outerRing.rotateX(90);

    const innerCircleGeometry = new THREE.CircleGeometry(64, 32);
    const innerCircleMaterial = new THREE.MeshBasicMaterial({
      color: '#333333',
      opacity: 0.01,
    });
    const innerCircle = new THREE.Mesh(
      innerCircleGeometry,
      innerCircleMaterial
    );
    innerCircle.position.set(freeze_frame_screen_x, freeze_frame_screen_y, 0);
    innerCircle.rotateX(89);

    scene.add(outerRing);
    scene.add(innerCircle);

    renderer.render(scene, camera);
  };

  const loadEvent = (event_uuid) => {
    // Reset scene
    resetPointsInScene();

    const event = events.filter((event) => event.event_uuid === event_uuid)[0];

    const video = document.getElementById('video');
    if (video === null) return;
    try {
      video.currentTime = event.event_time_in_seconds; // event.time
      video.play(); // plays then pauses due to needing to rerender image
      video.pause();
    } catch (err) {
      console.log('i am error');
    }

    const defendingPlayersLineOne = event.players.filter(
      (player) => player.defensive_line_id === 1.0
    );

    const defendingPositions = defendingPlayersLineOne
      .map(({ freeze_frame_screen_x, freeze_frame_screen_y }) => {
        return {
          x_pos: freeze_frame_screen_x,
          y_pos: freeze_frame_screen_y,
          z_pos: 0,
        };
      })
      .sort((a, b) => {
        if (a.y_pos > b.y_pos) return 1;
        if (a.y_pos < b.y_pos) return -1;
        return 0;
      });

    const defending_line = defendingPositions.map(
      (player) => new THREE.Vector3(player.x_pos, player.y_pos, 0)
    );

    // Create defending points
    createPointsInScene(defending_line);

    // Create event player
    const eventPlayer = event.players.filter(
      (player) => player.freeze_frame_role === 'event'
    )[0];

    createEventPlayerRing(eventPlayer);
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <div id="video-with-overlay">
            <video
              id="video"
              controls
              muted
              src={MatchVideo}
              type="video/mp4"
            />
          </div>
        </div>
        <div className="container margin-top-lg">
          <div className="panel">
            <h2 className="panel-heading">Events</h2>
            {events.map((event, index) => {
              return (
                <div
                  key={event.event_uuid}
                  className="panel-block"
                  onClick={() => loadEvent(event.event_uuid)}
                >
                  <div className="panel-block">
                    <span style={{ fontWeight: 700 }}>{`Event ${
                      index + 1
                    }:`}</span>{' '}
                    <span style={{ paddingLeft: 5 }}>{`${
                      Math.round(event.event_time_in_seconds * 100) / 100
                    } seconds`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default MyComponent;
