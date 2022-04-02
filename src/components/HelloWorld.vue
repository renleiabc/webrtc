<script setup>
import { ref } from 'vue';
import FileSaver from 'file-saver';
defineProps({
  msg: String
});

const count = ref(0);

const initMediaStream = async () => {
  const constraints = {
    audio: {
      echoCancellation: { exact: true }
    },
    video: {
      with: 1280,
      height: 720
    }
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  return stream;
};
const detectMimeType = () => {
  const mimeTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm'
  ];

  for (let mimeType of mimeTypes) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }

  return '';
};
const beginRecord = async (onStreamReady, onFinished) => {
  const stream = await initMediaStream();
  onStreamReady(stream);
  const options = { mimeType: detectMimeType() };
  const recordedBlobs = [];

  const mediaRecorder = new MediaRecorder(stream, options);
  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  };
  mediaRecorder.onstop = () => {
    onFinished(recordedBlobs);
    stopMediaStream(stream);
  };

  mediaRecorder.start();

  return mediaRecorder;
};
const combineBlobs = (recordedBlobs) => {
  return new Blob(recordedBlobs, { type: 'video/webm' });
};
const createBlobURL = (blob) => {
  const url = window.URL.createObjectURL(blob);
  return url;
};
const playRecordedBlobs = (videoElement, recordedBlobs) => {
  const blob = combineBlobs(recordedBlobs);
  const url = createBlobURL(blob);

  stopPlaying(videoElement);

  videoElement.controls = true;
  videoElement.src = url;
  videoElement.play();
};

const download = (recordedBlobs, fileName = 'RecordedVideo.webm') => {
  const blob = combineBlobs(recordedBlobs);
  return FileSaver.saveAs(blob, fileName);
};
const playStream = (videoElement, stream) => {
  stopPlaying(videoElement);

  videoElement.srcObject = stream;
  videoElement.play();
};
const stopMediaStream = async (stream) => {
  stream.getTracks().forEach((track) => track.stop());
};
const stopPlaying = (videoElement) => {
  videoElement.pause();
  videoElement.src = null;
  videoElement.srcObject = null;
};
// Record按钮处理程序：
const btnRecord_onClick = async () => {
  try {
    if (!recorder) {
      const mediaRecorder = await beginRecord(
        (stream) => playStream(recordingVideoEl.current, stream),
        (recordedBlobs) => setData(recordedBlobs)
      );
      setRecorder(mediaRecorder);
    } else {
      recorder.stop();
      stopPlaying(recordingVideoEl.current);

      setRecorder(undefined);
      setRecorded(true);
    }
  } catch (err) {
    console.error(err);
  }
};
// Play按钮处理程序：
const btnPlay_onClick = () => {
  try {
    if (!playing) {
      setPlaying(true);
      playRecordedBlobs(playingVideoEl.current, data);
    } else {
      stopPlaying(playingVideoEl.current);
      setPlaying(false);
    }
  } catch (err) {
    console.error(err);
  }
};
// Download按钮处理程序：
const btnDownload_onClick = () => {
  try {
    download(data);
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <div>sadasd</div>
  <button @click="btnRecord_onClick">Record</button>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
