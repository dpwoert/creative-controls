export class Control {
  constructor(reference, key) {
    if (reference[key] === null || reference[key] === undefined) {
      throw new Error('Control has no value');
    }

    this.type = 'text';
    this.reference = reference;
    this.key = key;
    this.labelValue = key;
    this.options = {};
    this.initialValue = this.reference[this.key];
    this.noHydrate = false;

    this.hooks = {
      change: null,
    };

    return this;
  }

  /** Receive an updated value from the client */
  setValue(value) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.keys(value).forEach(key => {
        this.reference[this.key][key] = value[key];
      });
    } else {
      this.reference[this.key] = value;
    }

    // run hook
    if (this.hooks.change) {
      this.hooks.change(value);
    }
  }

  /** returns current value of controls */
  getValue() {
    return this.reference[this.key];
  }

  /** Value has been updated outside of the controls */
  /* eslint-disable-next-line */
  update() {
    // TODO read & send value
  }

  /** Reset to initial value */
  reset() {
    this.setValue(this.initialValue);
  }

  /** Sets the label for this control */
  label(label) {
    this.labelValue = label;
    return this;
  }

  /** Add to folder */
  addTo(parent) {
    parent.add(this);
    return this;
  }

  on(evt, fn) {
    this.hooks[evt] = fn;
    return this;
  }

  toJSON(basePath) {
    const path = `${basePath}.${this.key}`;
    return {
      path,
      isControl: true,
      type: this.type,
      key: this.key,
      label: this.labelValue,
      options: this.options,
      value: this.getValue(),
      initialValue: this.initialValue,
      noHydrate: this.noHydrate,
    };
  }

  setStateAsDefault() {
    this.initialValue = this.getValue();
  }
}

export class TextControl extends Control {
  values(values) {
    this.type = 'text';
    this.options.values = values;
    return this;
  }

  labels(labels) {
    this.options.labels = labels;
    return this;
  }
}

export class NumberControl extends Control {
  constructor(reference, key) {
    super(reference, key);
    this.type = 'number';
    this.options = {
      range: null,
      stepSize: 0,
    };
    return this;
  }

  range(start, end) {
    this.options.range = [start, end];
    return this;
  }

  stepSize(size) {
    this.options.stepSize = size;
    return this;
  }
}

export class ColorControl extends Control {
  constructor(reference, key) {
    super(reference, key);
    this.type = 'color';
    this.options = {
      alpha: false,
      range: 255,
    };

    // set initial value when object
    const value = reference[key];
    const validKeys = ['r', 'g', 'b', 'a', 'red', 'green', 'blue', 'alpha'];
    if (typeof value === 'object' && !Array.isArray(value)) {
      const initial = {};
      Object.keys(value).forEach(k => {
        if (validKeys.indexOf(k) > -1) {
          initial[k] = value[k];
        }
      });

      this.initialValue = initial;
    }

    return this;
  }

  alpha(alpha) {
    this.options.alpha = !!alpha;
    return this;
  }

  range(range) {
    this.options.range = range;
    return this;
  }
}

export class BooleanControl extends Control {
  constructor(reference, key) {
    super(reference, key);
    this.type = 'boolean';
    return this;
  }
}

export class ButtonControl extends Control {
  constructor(reference, key) {
    super(reference, key);
    this.type = 'button';
    this.initialValue = '';
    this.noHydrate = true;
    return this;
  }

  setValue() {
    this.reference[this.key]();
  }

  getValue() {
    return this.initialValue;
  }
}
