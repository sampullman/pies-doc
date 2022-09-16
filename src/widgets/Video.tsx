import React, { useRef } from 'react'
import useLazyLoad from '../hooks/UseLazyLoad'

export interface IVideo {
  src: string
  autoPlay?: boolean
}

const Video = ({ src, autoPlay }: IVideo) => {
  const videoRef = useRef<HTMLVideoElement>()

  const onVisible = () => {
    // The download starts as soon as the source.src is assigned.
    const source = document.createElement('source')
    // source.onload = () => {
    //   loaded.value = true
    // }
    source.src = src
  }

  const { visible } = useLazyLoad({
    wrapper: videoRef,
    onVisible,
  })

  return (
    <video ref={videoRef} width="100%" controls autoPlay={autoPlay}>
      {visible && <source type="video/mp4" src={src} />}
    </video>
  )
}

export default Video