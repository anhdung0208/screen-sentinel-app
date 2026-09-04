import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

export function useScreenCapture() {
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = stream;
      video.play().catch((err) => console.warn('Video play auto-resume:', err));
    }
  }, [stream]);

  const startCapture = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always', frameRate: { ideal: 30, max: 60 } },
        audio: false,
      });

      setStream(mediaStream);
      setIsCapturing(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }

      mediaStream.getVideoTracks()[0].onended = () => {
        stopCapture();
      };
      toast.success('Đã kết nối màn hình thành công!');
    } catch (err) {
      toast.error('Không thể chia sẻ màn hình: ' + err.message);
    }
  };

  const stopCapture = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setIsCapturing(false);
    toast('Đã dừng chia sẻ màn hình');
  };

  return { stream, isCapturing, videoRef, startCapture, stopCapture };
}
