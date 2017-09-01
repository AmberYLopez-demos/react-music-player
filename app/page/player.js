import React from 'react';
import './player.less';
import Progress from '../components/progress';
import {Link} from 'react-router';
import Pubsub from 'pubsub-js';


let duration = null;//当前音频总时间
let allMusicState = ['repeat-cycle', 'repeat-random', 'repeat-once'];
let i = 0;
let Player = React.createClass({
    getInitialState(){
        return {
            progress: 0,//进度
            volume: 0,//音量
            isPlay: true,//是否播放
            leftTime: '',//剩余时间
            musicState: allMusicState[0]//当前歌曲播放状态
        }
    },
    //上一曲
    playPrev(){
        Pubsub.publish('PLAY_PREV');
    },
    //下一曲
    playNext(){
        Pubsub.publish('PLAY_NEXT');
    },
    //单曲循环
    playRepeatOnce(){
        Pubsub.publish('PLAY_REPEAT');
    },
    //循环播放
    playRepeat(){
        Pubsub.publish('PLAY_CYCLE');
    },
    //随机播放
    playRandom(){
        Pubsub.publish('PLAY_RANDOM');
    },
    formatTime(time){
        time = Math.floor(time);
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);

        seconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutes}:${seconds}`;
    },
    componentDidMount(){
        $("#player").bind($.jPlayer.event.timeupdate, (e) => {
            duration = e.jPlayer.status.duration;
            this.setState({
                volume: e.jPlayer.options.volume * 100,
                progress: e.jPlayer.status.currentPercentAbsolute,//播放占的百分比
                leftTime: this.formatTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
            });
        });
        $('#player').bind($.jPlayer.event.ended, (e)=> {
            let musicPlayState = this.state.musicState;
            if (musicPlayState === 'repeat-once') {
                //单曲
                Pubsub.publish('PLAY_REPEAT', this.props.currentMusicItem);
            } else if (musicPlayState === 'repeat-random') {
                //获取列表
                let index = Math.round(Math.random() * 5);
                console.log(index);
                Pubsub.publish('PLAY_RANDOM',this.props.musicList[index]);

            } else {
                Pubsub.publish('PLAY_CYCLE');

            }

        });
    },
    componentWillUnmout() {
        $("#player").unbind($.jPlayer.event.timeupdate);
        //单曲循环
        PubSub.unsubscribe('PLAY_REPEAT');
        //循环播放
        PubSub.unsubscribe('PLAY_CYCLE');
        //随机播放
        PubSub.unsubscribe('PLAY_RANDOM');
        //上一曲
        PubSub.unsubscribe('PLAY_PREV');
        //下一曲
        PubSub.unsubscribe('PLAY_NEXT');
    },
    progressChangeHandler(progress){
        $('#player').jPlayer('play', duration * progress);
    },
    progressVolumeHandler(progress){
        $('#player').jPlayer('volume', progress);

    },
    //控制音乐播放暂停
    play(){
        if (this.state.isPlay) {
            $('#player').jPlayer('pause');
        } else {
            $('#player').jPlayer('play');

        }
        this.setState({
            isPlay: !this.state.isPlay
        })
    },
    //更改音乐播放状态
    changeMusicState(){
        let index = (i + 1) % 3;
        this.setState({
            musicState: allMusicState[index]
        });
        i++;
        return index;
    },
    render() {
        return (
            <div className="player-page">
                <h1 className="caption"><Link to="/list">我的私人音乐坊 &gt;</Link></h1>
                <div className="mt20 row">
                    <div className="controll-wrapper">
                        <h2 className="music-title">{this.props.currentMusicItem.title}</h2>
                        <h3 className="music-artist mt10">{this.props.currentMusicItem.article}</h3>
                        <div className="row mt20">
                            <div className="left-time -col-auto">{this.state.leftTime}</div>
                            <div className="volume-container">
                                <i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                                <div className="volume-wrapper">
                                    <Progress
                                        progress={this.state.volume}
                                        onProgressChange={this.progressVolumeHandler}
                                        barColor="#aaa"/>
                                </div>
                            </div>
                        </div>
                        <div style={{height: 10, lineHeight: '10px', marginTop: '10px'}}>
                            <Progress
                                progress={this.state.progress}
                                onProgressChange={this.progressChangeHandler}>
                            </Progress>
                        </div>
                        <div className="mt35 row">
                            <div>
                                <i className="icon prev" onClick={this.playPrev}></i>
                                <i className={`icon ml20 ${this.state.isPlay ? "pause" : "play"}`}
                                   onClick={this.play}
                                ></i>
                                <i className="icon next ml20" onClick={this.playNext}></i>
                            </div>
                            <div className="-col-auto">
                                <i className={`icon ${this.state.musicState}`} onClick={this.changeMusicState}></i>
                            </div>
                        </div>
                    </div>
                    <div className="-col-auto cover">
                        <img className ={this.state.isPlay?'play':''} src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.article}/>
                    </div>
                </div>
            </div>
        )
    }
});
export default Player;