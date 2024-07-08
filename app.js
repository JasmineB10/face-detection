const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/face-api-models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/face-api-models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/face-api-models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/face-api-models')
]).then(startVideo);


function startVideo()
{navigator.mediaDevices.getUserMedia({video:true})
.then((stream) => {
    video.srcObject = stream;
})
.catch((err) => {
    console.log("Error in accessing webcam " , err);
})}

video.addEventListener('playing', () => {
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const detectionsForSize = faceapi.resizeResults(detections, {height:350, width: 600});
        ctx.clearRect(0,0,canvas.width,canvas.height);

        faceapi.draw.drawDetections(canvas, detectionsForSize);
        faceapi.draw.drawFaceLandmarks(canvas, detectionsForSize);
        faceapi.draw.drawFaceExpressions(canvas, detectionsForSize);
    },100);
})