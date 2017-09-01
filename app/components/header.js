/**
 * Created by amberylopez on 8/11/17.
 */
import React from 'react';
import  './header.css';

class Header extends React.Component{
    render(){
        return(
            <div className="components-header row">
                <img src="/static/images/logo.png" width="40px" className="-col-auto"/>
                <h1 className="caption">React Music Player</h1>
            </div>
        )
    }
}
export  default Header;
