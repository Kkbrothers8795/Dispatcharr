import React, { useState, useEffect } from 'react';

export default {
  Limiter: (n, list) => {
    if (!list || !list.length) {
      return;
    }

    var tail = list.splice(n);
    var head = list;
    var resolved = [];
    var processed = 0;

    return new Promise(function (resolve) {
      head.forEach(function (x) {
        var res = x();
        resolved.push(res);
        res.then(function (y) {
          runNext();
          return y;
        });
      });
      function runNext() {
        if (processed == tail.length) {
          resolve(Promise.all(resolved));
        } else {
          resolved.push(
            tail[processed]().then(function (x) {
              runNext();
              return x;
            })
          );
          processed++;
        }
      }
    });
  },
};

// Custom debounce hook
export function useDebounce(value, delay = 500, callback = null) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      if (callback) {
        callback();
      }
    }, delay);

    return () => clearTimeout(handler); // Cleanup timeout on unmount or value change
  }, [value, delay]);

  return debouncedValue;
}

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const getDescendantProp = (obj, path) =>
  path.split('.').reduce((acc, part) => acc && acc[part], obj);

export const copyToClipboard = async (value) => {
  if (navigator.clipboard) {
    // Modern method, using navigator.clipboard
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  // Fallback method for environments without clipboard support
  try {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('Failed to copy with fallback method: ', err);
    return false;
  }
};

export const setCustomProperty = (input, key, value, serialize = false) => {
  let obj;

  if (input == null) {
    // matches null or undefined
    obj = {};
  } else if (typeof input === 'string') {
    try {
      obj = JSON.parse(input);
    } catch (e) {
      obj = {};
    }
  } else if (typeof input === 'object' && !Array.isArray(input)) {
    obj = { ...input }; // shallow copy
  } else {
    obj = {};
  }

  obj[key] = value;

  if (serialize === true) {
    return JSON.stringify(obj);
  }

  return obj;
};
