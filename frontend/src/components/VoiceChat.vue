<template>
  <div>
    <button @click="startCall">Start Call</button>
    <button @click="hangUp">Hang Up</button>
    <audio ref="remoteAudio" autoplay></audio>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import io from 'socket.io-client'

const socket = io('http://localhost:3000')
const remoteAudio = ref(null)
let localStream
let peerConnection

const config = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
}

socket.on('offer', async (offer) => {
  peerConnection = createPeer()
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
  socket.emit('answer', answer)
})

socket.on('answer', async (answer) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
})

socket.on('ice-candidate', (candidate) => {
  if (peerConnection) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  }
})

function createPeer() {
  const pc = new RTCPeerConnection(config)

  pc.ontrack = (event) => {
    remoteAudio.value.srcObject = event.streams[0]
  }

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', event.candidate)
    }
  }

  localStream.getTracks().forEach(track => pc.addTrack(track, localStream))
  return pc
}

async function startCall() {
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  peerConnection = createPeer()

  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  socket.emit('offer', offer)
}

function hangUp() {
  peerConnection?.close()
  peerConnection = null
}
</script>
