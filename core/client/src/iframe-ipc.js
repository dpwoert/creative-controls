export class IframeIPC {
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

    const iframe = document.querySelector(selector);

    if (!iframe) {
      throw new Error("can't find iframe element");
    }

    this.connection = iframe.contentWindow;
    this.send('editor-ready', true);

    // wait until ready
    iframe.addEventListener('load', () => {
      this.connection = iframe.contentWindow;
      this.send('editor-ready', true);
    });
  }

  send(channel, payload) {
    try {
      if (this.connection) {
        if (channel === 'intercom') {
          this.connection.postMessage({ ...payload }, '*');
        } else if (channel === 'change-url') {
          window.location.hash = payload;
        } else {
          this.connection.postMessage({ channel, payload }, '*');
        }
      } else {
        console.warn(
          'not connected to editor or frame',
          channel,
          payload,
          this.mode
        );
      }
    } catch (e) {
      console.error('could not send message', channel, payload, this.mode);
      console.error(e);
    }
  }

  trigger(channel, evt, payload) {
    this.listeners = this.listeners
      .map(l => {
        if (l.channel === channel) {
          l.fn(evt, payload);
          return l.once ? { ...l, remove: true } : l;
        }
        return l;
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
    this.listeners = this.listeners.filter(
      l => !(l.fn === fn && l.channel === channel)
    );
  }

  removeAllListeners(channel) {
    this.listeners = this.listeners.filter(l => l.channel !== channel);
  }

  destroy() {
    this.listeners = [];
    this.connection = null;
  }
}
