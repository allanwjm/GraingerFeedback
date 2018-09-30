import $ from 'jquery';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Slider from 'react-slick';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as fa from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'animate.css/animate.min.css';
import './css/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import logoGm from './img/logo-grainger-museum.png';
import logoSg from './img/logo-science-gallery.png';

import musicCeiling from './music/ceiling-of-clouds.mp3';
import musicInTransition from './music/in-transition.mp3';
import musicMoments from './music/moments-of-congruence.mp3';
import musicCeilingSoft from './music/ceiling-of-clouds-soft.mp3';
import musicInTransitionSoft from './music/in-transition-soft.mp3';
import musicMomentsSoft from './music/moments-of-congruence-soft.mp3';

import chris1 from './record/chris-q1.mp3';
import chris2 from './record/chris-q2.mp3';
import chris3 from './record/chris-q3.mp3';
import zinia1 from './record/zinia-q1.mp3';
import zinia2 from './record/zinia-q2.mp3';
import zinia3 from './record/zinia-q3.mp3';
import wayne1 from './record/wayne-q1.mp3';
import wayne2 from './record/wayne-q2.mp3';
import wayne3 from './record/wayne-q3.mp3';

const STATUS_UPDATE_INTERVAL = 200;
const BULLET_FETCH_INTERVAL = 3000;
const BULLET_UPDATE_INTERVAL = 500;
const BULLET_QUEUE_INTERVAL = 200;
const KEYWORD_SLIDE_INTERVAL = 1350;

const BULLET_DISPLAY_TIME = 4000;

let UUID = require('uuid-js');

$.fn.extend({
    animateCss: function (animationName, callback) {
        let animationEnd = (function (el) {
            let animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (let t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            if (typeof callback === 'function') callback();
        });

        return this;
    },
});

function newUUID() {
    return UUID.create().toString();
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function formatTime(sec) {
    let h = Math.floor(sec / 3600 % 24);
    let m = Math.floor(sec / 60 % 60);
    let s = Math.floor(sec % 60);
    if (m < 10) m = '0' + m;
    if (s < 10) s = '0' + s;
    if (h > 0) {
        return h + ':' + m + ':' + s;
    } else {
        return m + ':' + s;
    }
}

function secondsOfDay() {
    let d = new Date();
    return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds() + d.getMilliseconds() / 1000;
}

function dummyStatus() {
    let s = secondsOfDay();
    const dur1 = 330.710219;
    const dur2 = 304.056;
    const dur3 = 328.032;
    let current = s % (dur1 + dur2 + dur3);
    if (current < dur1) {
        return {
            musicId: 1,
            paused: false,
            currentTime: current,
            duration: dur1,
        };
    } else if (current < dur1 + dur2) {
        return {
            musicId: 2,
            paused: false,
            currentTime: current - dur1,
            duration: dur2,
        };
    } else {
        return {
            musicId: 3,
            paused: false,
            currentTime: current - dur1 - dur2,
            duration: dur3,
        };
    }
}

function stopAudiosByClassName(className, self) {
    Array.from(document.getElementsByClassName(className)).forEach(audio => {
        if (audio !== self) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}

const DATA = {
    api: {
        get: {
            status: '/get/status',
            lexicon: '/get/lexicon',
            keywords: '/get/keywords',
            bullets: '/get/bullets',
        },
        post: {
            newBullet: '/post/new-bullet',
        }
    },
    colors: [
        {text: 'White', code: '#ffffff', background: 'transparent', inputColor: '#000000'},
        {text: 'Pink', code: '#e83e8c', background: '#ffffff', inputColor: '#e83e8c'},
        {text: 'Red', code: '#dc3545', background: '#ffffff', inputColor: '#dc3545'},
        {text: 'Orange', code: '#fd7e14', background: '#ffffff', inputColor: '#fd7e14'},
        {text: 'Yellow', code: '#ffc107', background: '#ffffff', inputColor: '#ffc107'},
        {text: 'Green', code: '#28a745', background: '#ffffff', inputColor: '#28a745'},
        {text: 'Cyan', code: '#17a2b8', background: '#ffffff', inputColor: '#17a2b8'},
        {text: 'Blue', code: '#007bff', background: '#ffffff', inputColor: '#007bff'},
        {text: 'Purple', code: '#6f42c1', background: '#ffffff', inputColor: '#6f42c1'}],
    story: {
        questions: [
            'Perfection means to me…',
            'How I created the music…',
            'How my music suits the Grainger courtyard…',
        ],
        answer: {
            chris: [
                ["I wanted this piece of music to reflect the inside and outside nature of the Grainger museum courtyard space, with clear sounds represented by the saxophone and guitar being very present in the courtyard, and the swirling around of wind and other noise from outside represented by the harmonium. I also tried to put lots of 'space' in the music, to imitate the open sky space of the courtyard itself. It's also set at a very slow pace of approximately 57 bpm, which I chose as it's my own relaxed, resting heartbeat, to correspond with the feeling of stillness when we are quiet and are aware and sensitive to the sound and feeling of our own being."],
                ["I used saxophone, acoustic guitar, and harmonium, and selected these because they were some of Percy Grainger's favourite instruments. I also love the way that the saxophone and guitar blend together when playing synchronised parts, and the saxophone and harmonium blend together well too. The harmonium is a fantastic instrument, and I can understand why Grainger liked it so much - it has such a grounded, earthy tone, but you can also hear the wind and elements of air in the sound too. I put the piece of music together by scoring it first, then recording the parts separately."],
                ["For the recording, I added some reverb and effects to the harmonium to give it more of an ethereal, swirling sound, and also mixed it more in the background to the guitar and saxophone parts, which carry the bulk of the rhythmic and melodic material. I intended for the harmonium to effectively swirl around the courtyard space, with the guitar and saxophone appearing as slightly more isolated individual parts. It was also my intention for the listener's experience to change depending on where they stood or sat in the courtyard, with certain parts of the piece appearing more clearer depending on one's position."],
            ],
            zinia: [
                ["In Transition draws inspiration from the Grainger Museum Courtyard and uses the open roof as representation of a spacecraft with a window to the “universe”. I wanted to represent stillness through a lone passenger’s confinement and willingness to return to their bare essential at the reward of reaching Planet Perfection. At the same time, I wondered how still is stillness when part of the world is advancing, while the rest remains. I feel there is an air of longing, beauty and finally a sense of being grounded, perhaps involuntarily, as one proceeds through a transition. "],
                ["The instrumentation of this piece includes, synthesizers, cello, flute, piccolo, piano and samples of a mark tree, bowed crotales and timpani. At the time I was writing this piece for Grainger Museum, the Synthesizers: Sound of the Future exhibition was on. Synthesizers formed the foundation of my piece and the use of it with glissandi worked remarkably well for an utopian/dystopian concept. The flute and piccolo represents the passenger and the cello represents earth’s civilisation. I also manipulated string samples to mimic sounds of droning mechanics. I drafted my piece on piano and synthesizer first, before recording samples and developing notation and fixed media simultaneously. "],
                ["I was very fortunate to have Josh Wilkinson on-board to help me realise the acoustic vision of In Transition. He is a true artist when it comes to spatial-audio. ",
                    "Josh Wilkinson - “I mixed Zinia's composition into a 3D virtual space using B-Format Ambisonic techniques. The virtual space was designed to mimic the inside of a space capsule and the dimensions of the Grainger Museum Courtyard. This allowed every sound in the composition to be placed and moved within the space according to the narrative of the piece. Engines rumble underneath, strings and woodwind click and flutter overhead as you break through the atmosphere into weightless omnipresent space.” "],
            ],
            wayne: [
                ["When I visited the courtyard at the Grainger Museum, I noticed that I had a growing sense of internal stillness. It seemed to me that the space imbibed a subtle calm. I wanted to convey this in the music. But rather than interpret the brief literally, by leaving silent spaces in the music, I focused instead on filling listeners with an internal feeling of stillness or calm. Therefore, I used guided meditation and non-traditional scoring techniques to help musicians maintain a sense of stillness while playing and recording the music, and I hope these feelings come through to the listener."],
                ["The instruments include voice (mezzo-soprano), electric violin and a laptop triggering a range of sounds including (manipulated) English horn samples, bowed metal, tapped metal (using a hard mallet) and autoharp (plucked).",
                    "The composition process revolved around two ideas. The first idea was to use a vocal part sung from the perspective of the courtyard itself. The second idea was to construct nested loops based on the English horn samples until I had a rich texture that became the basic structure for the piece.  Into this texture the vocal melody was woven, followed by the violin and sampled sounds."],
                ["When imagining people visiting the courtyard, I had hoped that they would notice the subtle sense of calm and stillness that the space imbibed. I wanted the music to support these feelings, and not compete with them. I used a number of sounds that were slowly morphing and panning, and I hoped that this would encourage visitors to move around the space, curiously listening or tracking the shifting sounds. Finally, because the text for the vocals was written from the perspective of the courtyard silently observing the visitors and seasons passing, I hoped this would encourage a deeper curiosity about the physical space itself, as it goes through its existence."],
            ],
        },
    },
    musics: [
        {title: '', src: null},
        {title: 'Ceiling of clouds', src: musicCeiling},
        {title: 'In Transition', src: musicInTransition},
        {title: 'Moments of congruence', src: musicMoments},
    ],
    animates: [
        {
            name: 'Bounce',
            inClass: "bounceIn",
            outClass: "bounceOut",
        }, {
            name: 'Bounce Down',
            inClass: "bounceInDown",
            outClass: "bounceOutDown",
        }, {
            name: 'Bounce Right',
            inClass: "bounceInRight",
            outClass: "bounceOutLeft",
        }, {
            name: 'Fade',
            inClass: "fadeIn",
            outClass: "fadeOut",
        }, {
            name: 'Flip',
            inClass: "flipInX",
            outClass: "flipOutX",
        }, {
            name: 'Zoom',
            inClass: "zoomIn",
            outClass: "zoomOut",
        }, {
            name: 'Zoom Up',
            inClass: "zoomInUp",
            outClass: "zoomOutDown",
        }],
    speeds: [
        {name: 'Faster', className: 'faster'},
        {name: 'Fast', className: 'fast'},
        {name: 'Normal', className: ''},
        {name: 'Slow', className: 'slow'},
        {name: 'Slower', className: 'slower'},
    ]
};

class ComposerStory extends Component {
    constructor(props) {
        super(props);
        this.state = {playing: false};
    }

    audioOnPlaying(e) {
        stopAudiosByClassName('composer-story-audio', e.target);
        /*
        Array.from(document.getElementsByClassName('player-audio')).forEach(audio => {
          if (!audio.paused) {
            let pos = audio.currentTime;
            audio.src = audio.dataset['softSrc'];
            audio.currentTime = pos;
            audio.play();
          }
        });
        */
        this.setState({playing: true});
    }

    audioOnPause(e) {
        let playing = false;
        Array.from(document.getElementsByClassName('composer-story-audio')).forEach(audio => {
            playing = playing || !audio.paused;
        });
        /*
        if (!playing) {
          Array.from(document.getElementsByClassName('player-audio')).forEach(audio => {
            let play = !audio.paused;
            let pos = audio.currentTime;
            audio.src = audio.dataset['normalSrc'];
            audio.currentTime = pos;
            if (play) {
              audio.play();
            }
          });
        }
        */
        this.setState({playing: false});
    }

    render() {
        return (
            <div className={this.state.playing ? 'composer-story active' : 'composer-story'}>
                <h5 className="composer-story-question">{this.props.question}</h5>
                {this.props.record ?
                    <audio className="composer-story-audio" preload="auto"
                           onPlaying={(e) => this.audioOnPlaying(e)}
                           onPause={(e) => this.audioOnPause(e)}
                           src={this.props.record} controls="controls"/> : ''}
                {this.props.answer.map(text => <p key={text.slice(0, 10)} className="composer-story-text">{text}</p>)}
            </div>
        );
    }
}

class ComposerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {index: 0};
    }

    render() {
        return (
            <div className="d-flex">
                <div id="tab-buttons">
          <span
              className={"button" + (this.state.index === 0 ? " active" : "") + (this.props.musicId === 1 ? " playing" : "")}
              onClick={() => this.setState({index: 0})}>
            <b className="button-music-title">Ceiling of Clouds</b>
            <span className="button-composer-name">by Chris Pickering</span>
            <span className="now-playing"><FontAwesomeIcon icon={fa.faVolumeUp}/></span>
          </span>
                    <span
                        className={"button" + (this.state.index === 1 ? " active" : "") + (this.props.musicId === 2 ? " playing" : "")}
                        onClick={() => this.setState({index: 1})}>
            <b className="button-music-title">In Transition</b>
            <span className="button-composer-name">by Zinia Chan</span>
            <span className="now-playing"><FontAwesomeIcon icon={fa.faVolumeUp}/></span>
          </span>
                    <span
                        className={"button" + (this.state.index === 2 ? " active" : "") + (this.props.musicId === 3 ? " playing" : "")}
                        onClick={() => this.setState({index: 2})}>
            <b className="button-music-title">Moments of Congruence</b>
            <span className="button-composer-name">by Wayne Kington</span>
            <span className="now-playing"><FontAwesomeIcon icon={fa.faVolumeUp}/></span>
          </span>
                </div>
                <div className="tab-div-wrapper">
                    <div className={this.state.index === 0 ? "tab-div" : "d-none"}>
                        <h2 className="music-title">CEILING OF CLOUDS</h2>
                        <h4 className="composer-name">by Chris Pickering</h4>
                        <ComposerStory question={DATA.story.questions[0]} answer={DATA.story.answer.chris[0]}
                                       record={chris1}/>
                        <ComposerStory question={DATA.story.questions[1]} answer={DATA.story.answer.chris[1]}
                                       record={chris2}/>
                        <ComposerStory question={DATA.story.questions[2]} answer={DATA.story.answer.chris[2]}
                                       record={chris3}/>
                    </div>
                    <div className={this.state.index === 1 ? "tab-div" : "d-none"}>
                        <h2 className="music-title">IN TRANSITION</h2>
                        <h4 className="composer-name">by Zinia Chan</h4>
                        <ComposerStory question={DATA.story.questions[0]} answer={DATA.story.answer.zinia[0]}
                                       record={zinia1}/>
                        <ComposerStory question={DATA.story.questions[1]} answer={DATA.story.answer.zinia[1]}
                                       record={zinia2}/>
                        <ComposerStory question={DATA.story.questions[2]} answer={DATA.story.answer.zinia[2]}
                                       record={zinia3}/>
                    </div>
                    <div className={this.state.index === 2 ? "tab-div" : "d-none"}>
                        <h2 className="music-title">MOMENTS OF CONGRUENCE</h2>
                        <h4 className="composer-name">by Wayne Kington</h4>
                        <ComposerStory question={DATA.story.questions[0]} answer={DATA.story.answer.wayne[0]}
                                       record={wayne1}/>
                        <ComposerStory question={DATA.story.questions[1]} answer={DATA.story.answer.wayne[1]}
                                       record={wayne2}/>
                        <ComposerStory question={DATA.story.questions[2]} answer={DATA.story.answer.wayne[2]}
                                       record={wayne3}/>
                    </div>
                </div>
            </div>
        );
    }
}

class TabletApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            liveEnabled: false,
            liveMusicId: 0,
            livePosition: 0,
            liveDuration: 1,
            musicPaused: false,
            musicId: 0,
            musicDuration: 1,
            musicPosition: 0,
            lexicon: [],
            keywords: [],
            color: DATA.colors[0],
            showPlayerPannel: false,
            playingLocally: false,
            lostConnection: false,
            animate: DATA.animates[2],
            speed: DATA.speeds[1],
            playerMode: window.location.search.includes('player'),
        };
        this.uuid = newUUID();
        this.bullets = [];
        this.bulletsQueue = [];
        this.worker = {};
        this.ref = {
            keywordSlider: React.createRef(),
            customInput: React.createRef(),
            audioLive: React.createRef(),
        };
    }

    request(api, callback, interval, condition) {
        if (interval) {
            this.request(api, callback);
            return setInterval(() => this.request(api, callback, undefined, condition), interval);
        } else {
            if (!this.state.lostConnection) {
                if (condition === undefined || condition()) {
                    fetch(api)
                        .then(res => res.json())
                        .then(data => callback(data))
                        .catch((e) => {
                            console.warn(e);
                            this.setState({lostConnection: true})
                        });
                }
            }
        }
    }

    componentDidMount() {
        this.worker.state = setInterval(() => {
            let data = dummyStatus();
            if (!this.state.playingLocally) {
                this.setState({
                    musicId: data.musicId,
                    musicPaused: data.paused,
                    musicPosition: data.currentTime,
                    musicDuration: data.duration,
                    liveMusicId: data.musicId,
                    livePosition: data.currentTime,
                    liveDuration: data.duration,
                });
            } else {
                this.setState({
                    liveMusicId: data.musicId,
                    livePosition: data.currentTime,
                    liveDuration: data.duration,
                });
            }
            if (this.state.liveEnabled) {
                let audioLive = this.ref.audioLive.current;
                if (!audioLive.src.includes(DATA.musics[this.state.liveMusicId].src)) {
                    audioLive.src = DATA.musics[this.state.liveMusicId].src;
                }
                if (Math.abs(audioLive.currentTime - this.state.livePosition) > 5) {
                    audioLive.currentTime = this.state.livePosition;
                }
                if (this.state.playingLocally) {
                    audioLive.pause();
                } else if (audioLive.paused) {
                    audioLive.play();
                }
            }
        }, STATUS_UPDATE_INTERVAL);
        this.worker.local = setInterval(() => {
            if (this.state.playingLocally) {
                Array.from(document.getElementsByClassName('player-audio')).forEach(audio => {
                    if (!audio.paused) {
                        this.setState({
                            musicPaused: false,
                            musicId: Number(audio.dataset.music),
                            musicPosition: audio.currentTime,
                            musicDuration: audio.duration,
                        });
                    }
                });
            }
        }, STATUS_UPDATE_INTERVAL);
        if (!this.state.playerMode) {
            this.request(DATA.api.get.lexicon, data => {
                let keywords = [];
                this.setState({lexicon: data.lexicon});
                data.lexicon.forEach(word => keywords.push({key: word, text: word, cooldown: false}));
                shuffle(keywords);
                this.setState({keywords: keywords});
            });
            this.worker.fetchBullet = setInterval(() => {
                if (!this.state.musicPaused) {
                    let params = {
                        musicid: this.state.musicId,
                        position: this.state.musicPosition,
                        uuid: this.uuid,
                    };
                    fetch(DATA.api.get.bullets + '?' + $.param(params))
                        .then(res => res.json())
                        .then(data => {
                            this.bullets = this.bullets.concat(data.bullets);
                        }).catch((e) => {
                        console.warn(e);
                        this.setState({lostConnection: true})
                    });
                }
            }, BULLET_FETCH_INTERVAL);
            this.worker.updateBullet = setInterval(() => {
                if (!this.state.musicPaused) {
                    let newBullets = [];
                    let newShownBullets = [];
                    for (let i = 0; i < this.bullets.length; i++) {
                        let bullet = this.bullets[i];
                        if (bullet.musicId === this.state.musicId && bullet.position <= this.state.musicPosition) {
                            newShownBullets.push(bullet);
                        } else {
                            newBullets.push(bullet);
                        }
                    }
                    if (newBullets.length < this.bullets.length) {
                        this.bullets = newBullets;
                        this.bulletsQueue = this.bulletsQueue.concat(newShownBullets);
                    }
                }
            }, BULLET_UPDATE_INTERVAL);
            this.worker.queueBullet = setInterval(() => {
                if (this.bulletsQueue.length > 0) {
                    let getAnimateIn = () => this.state.animate.inClass + ' ' + this.state.speed.className;
                    let getAnimateOut = () => this.state.animate.outClass + ' ' + this.state.speed.className;
                    let bullet = this.bulletsQueue.shift();
                    let $bullet = $('<span class="bullet"></span>')
                        .text(bullet.text)
                        .css('color', bullet.color)
                        .css('bottom', (Math.random() * 70 + 15) + '%')
                        .css('left', (Math.random() * 70 + 15) + '%');
                    $bullet.animateCss(getAnimateIn(), function () {
                        setTimeout(() => {
                            $bullet.animateCss(getAnimateOut(), function () {
                                $bullet.remove();
                            });
                        }, BULLET_DISPLAY_TIME)
                    });
                    $bullet.appendTo($('#bullet-area'));
                }
            }, BULLET_QUEUE_INTERVAL);
            this.worker.slider = setInterval(() => {
                if (this.ref.keywordSlider.current) {
                    this.ref.keywordSlider.current.slickNext();
                }
            }, KEYWORD_SLIDE_INTERVAL);
        } else {
            console.log('This is player mode! Only for playing music in the courtyard!');
            $('#enable-live').click();
        }
    }

    componentWillUnmount() {
        Object.keys(this.worker).forEach(key => clearInterval(this.worker[key]));
    }

    newBullet(text, source) {
        let bullet = {
            musicId: this.state.musicId,
            position: this.state.musicPosition,
            text: text,
            color: this.state.color.code,
            source: source,
            creator: this.uuid,
        };
        this.bulletsQueue.push(bullet);
        if (!this.state.musicPaused) {
            $.post(DATA.api.post.newBullet, bullet);
        }
    }

    customInputEnter(event) {
        if (event.key === 'Enter') {
            let input = this.ref.customInput.current;
            if (input.value.length > 0) {
                this.newBullet(input.value, 1);
            }
            input.blur();
            input.value = '';
        }
    }

    clickKeyword(word) {
        if (!word.cooldown) {
            word.cooldown = true;
            this.setState({keywords: this.state.keywords});
            this.newBullet(word.text, 0);
            setTimeout(() => {
                word.cooldown = false;
                this.setState({keywords: this.state.keywords});
            }, 10 * 1000);
        }
    }

    togglePlayerPanel() {
        this.setState({showPlayerPannel: !this.state.showPlayerPannel});
    }

    audioOnPlaying(e) {
        this.setState({playingLocally: true});
        stopAudiosByClassName('player-audio', e.target);
    }

    audioOnPause(e) {
        let playing = false;
        Array.from(document.getElementsByClassName('player-audio')).forEach(audio => {
            playing = playing || !audio.paused;
        });
        if (!playing) {
            this.setState({playingLocally: false});
        }
    }

    render() {
        let keywordSliderOption = {
            adaptiveHeight: true,
            arrows: false,
            dots: false,
            autoplay: false,
            centerMode: true,
            infinite: true,
            draggable: false,
            touchMove: false,
            swipe: false,
            slidesToScroll: 1,
            variableWidth: true,
            speed: 250,
            pauseOnHover: false,
        };
        return (
            <div>
                <header>
                    <img id="logo-sg" src={logoSg} alt="Science Gallery"/>
                    <img id="logo-gm" src={logoGm} alt="Grainger Museum"/>
                    <span id="logo-sp">Stillness | Perfection</span>
                </header>
                <div id="progress-bar-wrapper" className="progress">
                    <div id="progress-bar" className="progress-bar progress-bar-striped animate"
                         style={{width: this.state.musicPaused ? 0 : (100.0 * this.state.musicPosition / this.state.musicDuration) + '%'}}/>
                </div>
                <Tabs>
                    <TabList id="page-tablist">
                        <Tab className="button">THE MUSIC</Tab>
                        <Tab className="button">THE STORY</Tab>
                        <li className="button" onClick={this.togglePlayerPanel.bind(this)}><FontAwesomeIcon
                            icon={fa.faHeadphonesAlt}/></li>
                    </TabList>
                    <TabPanel forceRender={true}>
                        <div id="page-the-music" className="page"
                             onClick={() => this.setState({showPlayerPannel: false})}>
                            {this.state.musicPaused ?
                                <div id="title-area">
                                    <h5 className="title-now-playing d-block">There is no Music
                                        Playing... <FontAwesomeIcon icon={fa.faBed}/></h5>
                                </div> :
                                <div id="title-area">
                                    <h5 className="title-now-playing">
                                        {this.state.playingLocally ?
                                            <span>Playing with Headphones: <FontAwesomeIcon icon={fa.faHeadphonesAlt}/></span> :
                                            <span>Now Playing in the Courtyard: </span>}
                                        <span>{formatTime(this.state.musicPosition)} / {formatTime(this.state.musicDuration)}</span>
                                    </h5>
                                    <h1 className="title-music-name">{DATA.musics[this.state.musicId].title}</h1>
                                </div>}
                            <div className="content">
                                <div id="bullet-area">
                  <span className="message">
                    Here is what others said before...
                  </span>
                                    <div id="effect-dropdown">
                                        <div className="d-flex align-items-center">
                                            <span>Animate effect:</span>
                                            <div className="dropup">
                        <span className="button effect-dropdown-button" data-toggle="dropdown">
                          {this.state.animate.name}</span>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    {DATA.animates.map(animate =>
                                                        <a key={animate.name} href="javascript:void(0);"
                                                           className={this.state.animate === animate ? "dropdown-item active" : "dropdown-item"}
                                                           onClick={() => this.setState({animate: animate})}>{animate.name}</a>)}
                                                </div>
                                            </div>
                                            <span>Speed:</span>
                                            <div className="dropup">
                        <span className="button effect-dropdown-button" data-toggle="dropdown">
                          {this.state.speed.name}</span>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    {DATA.speeds.map(speed =>
                                                        <a key={speed.name} href="javascript:void(0);"
                                                           className={this.state.speed === speed ? "dropdown-item active" : "dropdown-item"}
                                                           onClick={() => this.setState({speed: speed})}>{speed.name}</a>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="feedback-area" style={{display: this.state.playerMode ? 'none' : 'block'}}>
                                    <h4 className="subtitle">WHAT DO YOU HEAR? CHOOSE A WORD ...</h4>
                                    <div id="keyword-slider-wrapper">
                                        <Slider ref={this.ref.keywordSlider} {...keywordSliderOption}>
                                            {this.state.keywords.map(w =>
                                                <div key={w.key} className="keyword-item-wrapper">
                          <span className={w.cooldown ? 'keyword-item cooldown' : 'keyword-item button'}
                                onClick={() => this.clickKeyword(w)}
                                style={{
                                    color: this.state.color.code,
                                    borderColor: this.state.color.code,
                                    backgroundColor: this.state.color.background,
                                }}>{w.text}</span>
                                                </div>)}
                                        </Slider>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center"
                                         style={{padding: '0 2vw'}}>
                                        <div className="d-flex">
                      <span className="button page-button" style={{paddingRight: '.65vh'}}
                            onClick={() => this.ref.keywordSlider.current.slickPrev()}>
                        <FontAwesomeIcon icon={fa.faCaretLeft}/>                      </span>
                                            <span className="button page-button" style={{paddingLeft: '.65vh'}}
                                                  onClick={() => this.ref.keywordSlider.current.slickNext()}>
                        <FontAwesomeIcon icon={fa.faCaretRight}/></span>
                                        </div>
                                        <span id="input-message" style={{display: "none"}}>Press "Return" to send</span>
                                        <div id="color-selector">
                                            {DATA.colors.map(color =>
                                                <a key={color.code} style={{background: color.code}}
                                                   className={color === this.state.color ? 'item active' : 'item'}
                                                   onClick={() => this.setState({color: color})}>{color.text}</a>)}
                                        </div>
                                    </div>
                                    <div id="custom-word-wrapper">
                                        <input ref={this.ref.customInput}
                                               id="custom-word" type="text"
                                               style={{color: this.state.color.inputColor}}
                                               onKeyPress={this.customInputEnter.bind(this)}
                                               onFocus={() => $('#input-message').show()}
                                               onBlur={() => $('#input-message').hide()}
                                               placeholder="... or type your own"/>
                                        <span id="custom-word-button" className="button"
                                              onClick={() => this.ref.customInput.current.focus()}>
                      <FontAwesomeIcon icon={fa.faKeyboard}/>
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel forceRender={true}>
                        <div id="page-the-story" className="page"
                             onClick={() => this.setState({showPlayerPannel: false})}>
                            <ComposerPage musicId={this.state.musicId}/>
                        </div>
                    </TabPanel>
                </Tabs>
                <div id="player-pannel"
                     style={{right: this.state.playerMode || this.state.showPlayerPannel ? 0 : '-32vw'}}>
                    <span id="player-close-button" className="button"
                          onClick={this.togglePlayerPanel.bind(this)}>
                        <FontAwesomeIcon icon={fa.faChevronRight}/></span>
                    <div className="d-flex flex-column align-items-center">
                        <FontAwesomeIcon icon={fa.faHeadphonesAlt} style={{fontSize: '12vh'}}/>
                        <div className="d-flex justify-content-center flex-column" style={{paddingTop: '5vh'}}>
                            {!this.state.liveEnabled ?
                                <span id="enable-live" className="button" style={{padding: '2vh auto'}} onClick={() => {
                                    this.ref.audioLive.current.play();
                                    this.setState({liveEnabled: true});
                                }}>Enable live music</span> : ""}
                            <div className="player-music-block"
                                 style={{
                                     borderBottom: "rgba(255,255,255,0.1) solid 1px",
                                     display: this.state.liveEnabled ? 'block' : 'none'
                                 }}>
                                <h3 style={{fontSize: '2.75vh', marginBottom: '1vh'}}>What is in the courtyard</h3>
                                <h4 className="music-name">{DATA.musics[this.state.liveMusicId].title}</h4>
                                <audio className="player-audio" preload="auto" ref={this.ref.audioLive}
                                       src={musicMomentsSoft}/>
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped animate"
                                         style={{
                                             width: this.state.musicPaused ? 0 : (100.0 * this.state.livePosition / this.state.liveDuration) + '%',
                                             backgroundColor: "#ee7ba0",
                                         }}/>
                                </div>
                                <div className="text-right">
                                    <span>{formatTime(this.state.livePosition)} / {formatTime(this.state.liveDuration)}</span>
                                </div>
                            </div>
                            <h3 style={{fontSize: '2.75vh', marginTop: '1vh', marginBottom: '1vh'}}>Or choose one
                                here!</h3>
                            <div className="player-music-block">
                                <h4 className="music-name">Ceiling of Clouds</h4>
                                <audio className="player-audio" preload="auto" data-music="1"
                                       onPlaying={(e) => this.audioOnPlaying(e)}
                                       onPause={(e) => this.audioOnPause(e)} controls="controls"
                                       src={musicCeiling} data-soft-src={musicCeilingSoft}
                                       data-normal-src={musicCeiling}/>
                            </div>
                            <div className="player-music-block">
                                <h4 className="music-name">In Transition</h4>
                                <audio className="player-audio" preload="auto" data-music="2"
                                       onPlaying={(e) => this.audioOnPlaying(e)}
                                       onPause={(e) => this.audioOnPause(e)} controls="controls"
                                       src={musicInTransition} data-soft-src={musicInTransitionSoft}
                                       data-normal-src={musicInTransition}/>
                            </div>
                            <div className="player-music-block">
                                <h4 className="music-name">Moments of Congruence</h4>
                                <audio className="player-audio" preload="auto" data-music="3"
                                       onPlaying={(e) => this.audioOnPlaying(e)}
                                       onPause={(e) => this.audioOnPause(e)} controls="controls"
                                       src={musicMoments} data-soft-src={musicMomentsSoft}
                                       data-normal-src={musicMoments}/>
                            </div>
                            {this.state.playingLocally ? <span className="button p-2" onClick={
                                () => Array.from(document.getElementsByClassName('player-audio')).forEach(audio => audio.pause())}>Stop</span> : ""}
                        </div>
                    </div>
                </div>
                <div id="lost-connection" style={{display: this.state.lostConnection ? 'flex' : 'none'}}>
                    <FontAwesomeIcon icon={fa.faUnlink}/>
                    <h1>LOST CONNECTION</h1>
                    <p>Oops, Network crashed!<br/>Please report to us, Thanks!</p>
                    <button id="refresh-button"
                            className="btn btn-outline-light btn-lg rounded-0"
                            onClick={() => window.location.reload()}>Try reconnect
                    </button>
                </div>
                <div id="turn-landscape">
                    <FontAwesomeIcon icon={fa.faSyncAlt}/>
                    <h1>ROTATE THE SCREEN</h1>
                    <p>Please rotate the screen to landscape!</p>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <TabletApp/>
    , document.getElementById('root'));
registerServiceWorker();
