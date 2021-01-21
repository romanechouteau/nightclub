/**
 * entry.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */

import { Recording, detectClap } from './clapRecording'
const fetch = require('node-fetch')

// const { JSDOM } = require( "jsdom" );
// const { window } = new JSDOM( "" );
// const $ = require( "jquery" )( window )
import $ from "jquery"

import { WebGLRenderer, PerspectiveCamera, Scene, Vector3, AudioListener, Audio, AudioLoader } from 'three'
import SeedScene from './objects/Scene.js'

import './assets/styles.scss';

const scene = new Scene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({antialias: true});
const seedScene = new SeedScene();

console.log(process.env)

// scene
scene.add(seedScene);

// camera
camera.position.set(6,3,-8);
camera.lookAt(new Vector3(0,0,0));

// renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true
renderer.setClearColor(0x000000, 1);

// render loop
const onAnimationFrameHandler = (timeStamp) => {
  renderer.render(scene, camera);
  seedScene.update && seedScene.update(timeStamp);
  window.requestAnimationFrame(onAnimationFrameHandler);
}
window.requestAnimationFrame(onAnimationFrameHandler);

// resize
const windowResizeHanlder = () => {
  const { innerHeight, innerWidth } = window;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
windowResizeHanlder();
window.addEventListener('resize', windowResizeHanlder);

// Save
const save = []

// Claps
const callToClap = document.createElement('div')
callToClap.className = 'callToClap'
callToClap.textContent = 'Clap to a rythm to make him dance'

const button = document.createElement('button')
button.innerText = 'Start'

const clapDisplay = document.createElement('div')
clapDisplay.className = 'clapDisplay'
clapDisplay.textContent = 'Clap'

const calcBpm = document.createElement('div')
calcBpm.className = 'calcBpm'
calcBpm.textContent = 'Calculating BPM...'

const bpmDisplay = document.createElement('div')
bpmDisplay.className = 'bpmDisplay'

const actionBar = document.createElement('div')
actionBar.className = 'actionBar'
const actionBarLeft = document.createElement('div')
actionBarLeft.className = 'actionBarLeft'
const actionBarRight = document.createElement('div')
actionBarRight.className = 'actionBarRight'
// const results = document.createElement('div')
// results.className = 'results'
// results.textContent = 'Results'
const share = document.createElement('a')
share.className = 'share'
share.textContent = 'Share'
share.target = '_blank'
share.href = `https://twitter.com/intent/tweet?text=I%20made%20the%20little%20guy%20dance%20-&url=${process.env.PUBLIC_URL}`
// actionBarRight.appendChild(results)
actionBarRight.appendChild(share)
actionBar.appendChild(actionBarLeft)
actionBar.appendChild(actionBarRight)

// const formResults = document.createElement('form')
// formResults.method = 'POST'
// formResults.action = 'http://localhost:3001/playlist/new'
// const saveInput =  document.createElement('input')
// saveInput.type = 'hidden'
// saveInput.name = 'saveData'
// formResults.appendChild(saveInput)

button.addEventListener('click', buttonClick)
// results.addEventListener('click', () => {
//   saveInput.value = JSON.stringify(save)
//   formResults.submit()
// })

function buttonClick() {
  getSong()
  button.removeEventListener('click', buttonClick)
  button.style.display = 'none'
  section.style.backgroundColor = 'transparent'
  $('.actionBar').css("display", "flex").hide().fadeIn()
}

async function getSong() {
  $('.bpmDisplay').fadeOut(400, () => $('.callToClap').fadeIn())
  const bpm = await new Promise((resolve) => {
    const claps = []
    new Recording(function(data, time){
      if(detectClap(data)){
        $('.callToClap').fadeOut(200, () => $('.clapDisplay').fadeIn(200, () => $('.clapDisplay').fadeOut(200)))
        claps.push(time)
        if (claps.length === 8) {
          $('.clapDisplay').fadeOut(200, () => $('.calcBpm').fadeIn())
          let delays = claps.map((value,index) => {
            if (index > 0) {
              return value - claps[index - 1]
            } else {
              return 0
            }})
          let moyenne = delays.reduce((prev, value) => prev + value) / (delays.length - 1)
          let bpm = Math.round(60 / moyenne)
          if (bpm < 40) {bpm = 40}
          else if (bpm > 220) {bpm = 220}
          resolve(bpm)
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    })
  })

  const songsJson = await fetch(`https://api.getsongbpm.com/tempo/?api_key=${process.env.API_KEY}&bpm=${bpm}`).then(res => res.json())
  const index = Math.floor(Math.random() * songsJson.tempo.length)
  let song = await fetch(`https://api.deezer.com/search?q=artist:"${encodeURIComponent(songsJson.tempo[0].artist.name)}"%20track:"${encodeURIComponent(songsJson.tempo[index].song_title)}"`)
  .then(res => res.json())
  .then(async (res) => {
    if (res.data.length === 0) {
      let i = 0
      let thisSong = null
      while (i < songsJson.tempo.length && res.data.length === 0) {
        thisSong = await fetch(`https://api.deezer.com/search?q=artist:"${encodeURIComponent(songsJson.tempo[i].artist.name)}"%20track:"${encodeURIComponent(songsJson.tempo[i].song_title)}"`).then(res => res.json())
        if (thisSong.data.length > 0) {
          break
        }
        i++
      }
      return thisSong.data[0] || null
    } else {
      return res.data[0]
    }
  })
  share.href = `https://twitter.com/intent/tweet?text=I%20made%20the%20little%20guy%20dance%20at%20${bpm}%20BPM%20on%20${song.title_short}%20by%20${song.artist.name}%20-&url=${process.env.PUBLIC_URL}`
  save.push({bpm, song: `${song.title_short} by ${song.artist.name}`})
  const listener = new AudioListener()
  camera.add(listener)
  const sound = new Audio( listener )
  const audioLoader = new AudioLoader()
  console.log(song)
  audioLoader.load( song.preview, function( buffer ) {
    bpmDisplay.textContent = `${bpm} BPM`
    $('.calcBpm').fadeOut(400, () => $('.bpmDisplay').fadeIn())
    sound.setBuffer( buffer )
    sound.setVolume( 0.5 )
    sound.play()
    seedScene.dance(bpm)
    sound.source.onended = function() {
      share.href = `https://twitter.com/intent/tweet?text=I%20made%20the%20little%20guy%20dance%20-&url=${process.env.PUBLIC_URL}`
      seedScene.stopDance()
      getSong()
      this.isPlaying = false;
  };
  })
}

const section = document.createElement('section')
section.append(callToClap)
section.append(clapDisplay)
section.append(calcBpm)
section.append(bpmDisplay)
section.append(button)
section.append(actionBar)
// section.append(formResults)


// dom
document.body.style.margin = 0;
document.body.appendChild( renderer.domElement );
document.body.appendChild( section );
