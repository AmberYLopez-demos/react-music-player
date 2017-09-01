import React from 'react';
import MusicListItem from '../components/musicListItem';

let MusicList = React.createClass({
    render(){
        let listItem = null;
        listItem = this.props.musicList.map((item, index)=> {
            return <MusicListItem
                focus={item===this.props.currentMusicItem}
                key={index}
                musicItem={item}
            >{item.title}</MusicListItem>
        });
        return (
            <ul>
                {listItem}
            </ul>
        )
    }
});
export default MusicList;