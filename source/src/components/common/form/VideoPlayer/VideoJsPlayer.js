import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import './VideoJsPlayer.styles.scss'; // styles
import 'video.js/dist/video-js.css'; // videoJs Default Styles
import 'videojs-contrib-quality-levels'; // videoJs Quality levels **
// import hls from 'videojs-hls-quality-selector'; // videojs Quality Selector **
import 'videojs-thumbnail-sprite'; // videoJs Thumbnail Plugin
import 'videojs-contrib-ads'; // videoJs ads
import '@videojs/themes/dist/sea/index.css';
import image from '@assets/images/bannermobile.png';
const VideoJsPlayer = (props) => {
    const { source, handleActionNext, height, isMobile } = props;
    const options = {
        preload: 'auto',
        controls: true,
        autoplay: true,
        loop: false,
        // playbackRates: isMobile ? false : [0.5, 1, 1.5, 2, 2.5],
        html5: {
            vhs: {
                overrideNative: true,
            },
            nativeVideoTracks: false,
            nativeAudioTracks: false,
            nativeTextTracks: false,
        },
        poster: image,
        controlBar: {
            remainingTimeDisplay: {
                displayNegative: false,
            },
        },
    };
    const [videoSource, setVideoSource] = useState(source);
    const [isClicked, setIsClicked] = useState(false);
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const { onReady, teaserStartTime, teaserDuration } = props;
    useEffect(() => {
        setVideoSource(source);
    }, [source]);

    React.useEffect(() => {
        // make sure Video.js player is only initialized once
        if (!playerRef.current) {
            const videoElement = videoRef.current;
            if (!videoElement) return;
            const player = (playerRef.current = videojs(videoElement, options, () => {
                onReady && onReady(player);
            }));

            // Cài đặt Media Session API
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new window.MediaMetadata({
                    title: 'Tiêu đề video',
                    artist: 'Tên nghệ sĩ hoặc kênh',
                    album: 'Tên album hoặc tập',
                    artwork: [
                        { src: image, sizes: '96x96', type: 'image/png' },
                        // Thêm các kích cỡ khác nếu cần
                    ],
                });

                // Cài đặt sự kiện cho các nút điều khiển (tùy chọn)
                navigator.mediaSession.setActionHandler('play', () => player.play());
                navigator.mediaSession.setActionHandler('pause', () => player.pause());
                // Thêm các handler khác cho nexttrack, previoustrack, seekbackward, v.v...
            }

            // handle the quality Levels of Video
            player.qualityLevels();
            // player.hlsQualitySelector = hls;
            // player.hlsQualitySelector({
            //     displayCurrentQuality: false,
            // });

            // handle the Thumbnail of Video
            // player.thumbnailSprite({
            //     sprites: [
            //         {
            //             url: 'https://static.cdn.asset.filimo.com/filimo-video/85779-thumb-t01.jpg',
            //             start: 0,
            //             duration: 1000,
            //             interval: 10,
            //             width: 106,
            //             height: 60,
            //         },
            //     ],
            // });

            // handle Ads of Video
            player.ads();
            player.on('contentchange', () => {
                player.trigger('adsready');
            });
            player.on('readyforpreroll', function () {
                player.ads.startLinearAdMode();

                // play your linear ad content
                // in this example, we use a static mp4
                player.src(videoSource);
                // send event when ad is playing to remove loading spinner
                player.one('adplaying', function () {
                    player.trigger('ads-ad-started');
                });

                // resume content when all your linear ads have finished
                player.on('adended', function () {
                    player.ads.endLinearAdMode();
                });
            });
            player.trigger('adsready');

            // handle The keyboard Keys
            player.on('keydown', (e) => {
                const playerVolume = player.volume();
                const playerCurrentTime = player.currentTime();
                switch (e.code) {
                                case 'Space':
                                    if (player.paused()) {
                                        player.play();
                                    } else {
                                        player.pause();
                                    }
                                    break;
                                case 'ArrowRight':
                                    player.currentTime(playerCurrentTime + 10);
                                    break;
                                case 'ArrowLeft':
                                    player.currentTime(playerCurrentTime - 10);
                                    break;
                                case 'ArrowUp':
                                    player.volume(playerVolume + 0.1);
                                    break;
                                case 'ArrowDown':
                                    player.volume(playerVolume - 0.1);
                                    break;
                                case 'KeyM':
                                    player.volume(0);
                                    break;
                                default:
                                    return;
                }
            });
        }
    }, [options]);

    React.useEffect(() => {
        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    return (
        <div className="player" style={{ height }}>
            <div data-vjs-player>
                <video autoPlay playsInline ref={videoRef} className="video-js vjs-theme-sea">
                    <source src={videoSource} type="application/x-mpegURL" />
                </video>
            </div>
        </div>
    );
};

export default VideoJsPlayer;
