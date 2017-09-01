/**
 * Created by amberylopez on 8/9/17.
 */
import React from 'react';
import {render} from 'react-dom';
import Header from './components/header.js';
import Player from './page/player.js';
import MusicList from './page/musicList.js';
import {MUSIC_LIST} from './config/musicList.js';
import {Router, IndexRoute, Link, Route, hashHistory} from 'react-router';

let App = React.createClass({
    getInitialState(){
        return {
            musicList: MUSIC_LIST,
            currentMusicItem: MUSIC_LIST[0]
        };
    },
    playMusic(musicItem){
        $('#player').jPlayer('setMedia', {
            mp3: musicItem.file
        }).jPlayer('play');
        this.setState({
            currentMusicItem: musicItem
        })
    },
    playNext(type = "next"){
        let index = this.findMusicIndex(this.state.currentMusicItem);
        let newIndex = null;
        let musicListLength = this.state.musicList.length;
        if (type === 'next') {
            newIndex = (index + 1) % musicListLength;
        } else {
            newIndex = (index - 1 + musicListLength) % musicListLength;
        }
        this.playMusic(this.state.musicList[newIndex]);
    },
    //寻找当前播放歌曲的位置
    findMusicIndex(musicItem){
        return this.state.musicList.indexOf(musicItem);
    },

    componentDidMount(){
        $("#player").jPlayer({
            // jplayer的初始化
            supplied: "mp3",
            wmode: "window",
        });
        this.playMusic(this.state.currentMusicItem);
        $('#player').bind($.jPlayer.event.ended, (e)=> {
            // this.playNext();
        });

        //播放音乐
        PubSub.subscribe('PLAY_MUSIC', (msg, musicItem)=> {
            this.playMusic(musicItem);
        });
        //删除音乐
        PubSub.subscribe('DELETE_MUSIC', (msg, musicItem)=> {
            this.setState({
                musicList: this.state.musicList.filter(item=> {
                    return item !== musicItem;
                })
            })
        });
        //上一曲
        PubSub.subscribe('PLAY_PREV', (msg, musicItem)=> {
            this.playNext('prev');
        });
       //下一曲
        PubSub.subscribe('PLAY_NEXT', (msg, musicItem)=> {
            this.playNext('next');
        });
        //单曲循环
        PubSub.subscribe('PLAY_REPEAT', (msg, musicItem)=> {
            this.playMusic(musicItem);
        });
        //循环播放
        PubSub.subscribe('PLAY_CYCLE', (msg, musicItem)=> {
            this.playNext();
        });
        //随机播放
        PubSub.subscribe('PLAY_RANDOM', (msg, musicItem)=> {
            this.playMusic(musicItem);
        });
    },
    componentWillUnMount(){
        // 事件解绑
        PubSub.unsubscribe('PLAY_MUSIC');
        PubSub.unsubscribe('DELETE_MUSIC');
        ('#player').unbind($.jPlayer.event.ended);
        PubSub.unsubscribe('PLAY_PREV');
        PubSub.unsubscribe('PLAY_NEXT');
        PubSub.unsubscribe('PLAY_REPEAT');
        PubSub.unsubscribe('PLAY_CYCLE');
        PubSub.unsubscribe('PLAY_RANDOM');


    },
    render() {
        return (
            <div>
                <Header />
                {/*<Player*/}
                {/*currentMusicItem={this.state.currentMusicItem}*/}
                {/*/>*/}
                {/*<MusicList*/}
                {/*musicList={this.state.musicList}*/}
                {/*currentMusicItem={this.state.currentMusicItem}*/}
                {/*>*/}

                {/*</MusicList>*/}
                {React.cloneElement(this.props.children, this.state)}
            </div>
        )
    }
});
let Root = React.createClass({
    render(){
        return (
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Player}/>
                    <Route path="/list" component={MusicList}/>
                </Route>
            </Router>
        )
    }

});

export default Root;













