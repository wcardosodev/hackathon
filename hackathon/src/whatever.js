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

    // const innerCircleGeometry = new THREE.CircleGeometry(64, 32);
    // const innerCircleMaterial = new THREE.MeshBasicMaterial({
    //   color: '#333333',
    //   opacity: 0.01,
    // });
    // const innerCircle = new THREE.Mesh(
    //   innerCircleGeometry,
    //   innerCircleMaterial
    // );
    // innerCircle.position.set(freeze_frame_screen_x, freeze_frame_screen_y, 0);
    // innerCircle.rotateX(89);

    scene.add(outerRing);
    // scene.add(innerCircle);
  };

  const createCompactnessOverlay = (closestPlayer, farPlayer) => {
    const distApart = farPlayer.x_pos - closestPlayer.x_pos;
    const distApartX = closestPlayer.x_pos + farPlayer.x_pos;
    const distApartY = closestPlayer.y_pos + farPlayer.y_pos;

    // yellow dots are attackers
    // red are defenders
    const geometry = new THREE.PlaneGeometry(200, 4000, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 'black',
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(distApartX - 100, 0, 0);
    plane.rotateZ(90);
    scene.add(plane);
  };

  const getPlayerCoordsObject = (player) => {
    const { freeze_frame_screen_x, freeze_frame_screen_y } = player;
    return {
      x_pos: freeze_frame_screen_x,
      y_pos: freeze_frame_screen_y,
      z_pos: 0,
    };
  };

  const sortXPos = (arr) => {
    if (arr === undefined) return [];
    return arr.sort((a, b) => {
      if (a.x_pos > b.x_pos) return 1;
      if (a.x_pos < b.x_pos) return -1;
      return 0;
    });
  };

  const sortYPos = (arr) => {
    return arr.sort((a, b) => {
      if (a.y_pos > b.y_pos) return 1;
      if (a.y_pos < b.y_pos) return -1;
      return 0;
    });
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

    const defendingPlayers = {
      line_one: event.players.filter(
        (player) => player.defensive_line_id === 1.0
      ),
      line_two: event.players.filter(
        (player) => player.defensive_line_id === 2.0
      ),
      line_three: event.players.filter(
        (player) => player.defensive_line_id === 3.0
      ),
      line_four: event.players.filter(
        (player) => player.defensive_line_id === 4.0
      ),
      line_five: event.players.filter(
        (player) => player.defensive_line_id === 5.0
      ),
    };

    const defendingPositions = {
      line_one: sortYPos(
        defendingPlayers.line_one.map((player) => getPlayerCoordsObject(player))
      ),
      line_two: sortYPos(
        defendingPlayers.line_two.map((player) => getPlayerCoordsObject(player))
      ),
      line_three: sortYPos(
        defendingPlayers.line_three.map((player) =>
          getPlayerCoordsObject(player)
        )
      ),
      line_four: sortYPos(
        defendingPlayers.line_four.map((player) =>
          getPlayerCoordsObject(player)
        )
      ),
      line_five: sortYPos(
        defendingPlayers.line_five.map((player) =>
          getPlayerCoordsObject(player)
        )
      ),
    };

    const defending_lines = {
      line_one: defendingPositions.line_one.map(
        (player) => new THREE.Vector3(player.x_pos, player.y_pos, 0)
      ),
      line_two: defendingPositions.line_two.map(
        (player) => new THREE.Vector3(player.x_pos, player.y_pos, 0)
      ),
      line_three: defendingPositions.line_three.map(
        (player) => new THREE.Vector3(player.x_pos, player.y_pos, 0)
      ),
      line_four: defendingPositions.line_four.map(
        (player) => new THREE.Vector3(player.x_pos, player.y_pos, 0)
      ),
      line_five: defendingPositions.line_five.map(
        (player) => new THREE.Vector3(player.x_pos, player.y_pos, 0)
      ),
    };

    const defenderClosestToKeeper = sortXPos(defendingPositions.line_one)[0];
    let defenderFurthestAway;

    if (defendingPositions.line_five.length > 0) {
      console.log(5);
      const length = sortXPos(defendingPositions.line_five).length;
      defenderFurthestAway = sortXPos(defendingPositions.line_five)[length - 1];
    } else if (defendingPositions.line_four.length > 0) {
      console.log(4);
      const length = sortXPos(defendingPositions.line_four).length;
      defenderFurthestAway = sortXPos(defendingPositions.line_four)[length - 1];
    } else if (defendingPositions.line_three.length > 0) {
      console.log(3);
      const length = sortXPos(defendingPositions.line_three).length;
      defenderFurthestAway = sortXPos(defendingPositions.line_three)[
        length - 1
      ];
    } else if (defendingPositions.line_two.length > 0) {
      console.log(2);
      const length = sortXPos(defendingPositions.line_two).length;
      defenderFurthestAway = sortXPos(defendingPositions.line_two)[length - 1];
    } else if (defendingPositions.line_one.length > 0) {
      console.log(1);
      const length = sortXPos(defendingPositions.line_one).length;
      defenderFurthestAway = sortXPos(defendingPositions.line_one)[length - 1];
    }

    // createCompactnessOverlay(defenderClosestToKeeper, defenderFurthestAway);

    // Create defending points
    createPointsInScene(defending_lines.line_one);
    createPointsInScene(defending_lines.line_two);

    // Create event player
    const eventPlayer = event.players.filter(
      (player) => player.freeze_frame_role === 'event'
    )[0];

    createEventPlayerRing(eventPlayer);

    renderer.render(scene, camera);
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
