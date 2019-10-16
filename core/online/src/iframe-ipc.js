class IframeIPC {
  constructor() {
    this.listeners = [];

    window.addEventListener('message', evt => {
      if (evt.data && evt.data.channel) {
        this.trigger(evt.data.channel, evt, evt.data.payload);
      }
    });
  }

  findParent() {
    if (window.parent) {
      this.mode = 'child';
      this.connection = window.parent;
    }
  }

  selector(selector = 'iframe') {
    this.mode = 'parent';
    this.iframe = null;
    this.parent = null;

    window.addEventListener('load', () => {
      const iframe = document.querySelector(selector);

      if (!iframe) {
        throw new Error("can't find iframe element");
      }

      this.connection = iframe.contentWindow;
    });
  }

  send(channel, payload) {
    console.log('send', channel, payload, this.mode);
    if (this.connection) {
      this.connection.postMessage({ channel, payload });
    } else {
      console.warn('could not send message', channel, payload);
    }
  }

  trigger(channel, evt, payload) {
    console.log('trigger', channel, this.listeners, this.mode);
    this.listeners = this.listeners
      .map(l => {
        if (l.channel === channel) {
          l.fn(evt, payload);
          return l.once ? { ...l, remove: true } : l;
        } else {
          return l;
        }
      })
      .filter(l => !l.remove);
  }

  on(channel, fn) {
    this.listeners.push({
      channel,
      fn,
      once: false,
    });
  }

  once(channel, fn) {
    this.listeners.push({
      channel,
      fn,
      once: true,
    });
  }

  removeListener(channel, fn) {
    // todo
  }

  removeAllListeners(channel) {}
}

export default IframeIPC;