import React from 'react';

import {updatePlayState} from './with-play-state';
import Bar from './bar';

class PlayControls {

  static name = 'play-controls';

  static initStore(){
    return {
      play: false
    };
  }

  constructor(client, store){
    this.client = client;
    this.store = store;
    this.client.addListener('play', (evt, payload) => this.play());
    this.client.addListener('stop', (evt, payload) => this.stop());
  }

  play(){
    this.store.set('play', true);
  }

  stop(){
    this.store.set('play', false);
  }

  changeState(play){
    this.client.sendMessage('change-play-state', play);
  }

  header(position){
    if(position === 'left'){

      const BarWithStore = this.store.withStore(Bar, this.store);
      return (
        <BarWithStore
          changeState={(p) => this.changeState(p)}
          refresh={() => this.client.refresh()}
          key="play-controls"
        />
      );
    }
  }

}

export default PlayControls;
