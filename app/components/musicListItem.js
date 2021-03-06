import React from 'react';
import './musicListItem.less';
import Pubsub from 'pubsub-js';

let MusicListItem = React.createClass({
    playMusic(musicItem){
        Pubsub.publish('PLAY_MUSIC',musicItem)
    },
    deleteMusic(musicItem){
        Pubsub.publish('DELETE_MUSIC',musicItem)

    },
    render(){
        let musicItem = this.props.musicItem;
        return (
            <li onClick={this.playMusic.bind(this, musicItem)}
                className={`components-listitem row ${this.props.focus ? 'focus' : ''}`}>
                <p><strong>{musicItem.title}</strong> - {musicItem.artist}</p>
                <p onClick={this.deleteMusic.bind(this, musicItem)} className="-col-auto delete">
                </p>
            </li>
        )

    },
    componentWillUnmout() {
        //播放
        PubSub.unsubscribe('PLAY_MUSIC');
        //删除
        PubSub.unsubscribe('DELETE_MUSIC');
    },
});
export default MusicListItem;