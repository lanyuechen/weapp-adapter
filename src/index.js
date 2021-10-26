import * as _window2 from './window';
import document from './document';

const _window = { ..._window2 };

GameGlobal.global = GameGlobal.global || GameGlobal;

function inject() {
  _window.document = document;

  _window.addEventListener = _window.document.addEventListener;
  _window.removeEventListener = _window.document.removeEventListener;
  _window.dispatchEvent = _window.document.dispatchEvent;

  const { platform } = wx.getSystemInfoSync();

  // 开发者工具无法重定义 window
  if (platform !== 'devtools') {
    _window.wx = wx;
    for (const key in _window) {
      GameGlobal[key] = _window[key];
    }
    GameGlobal.window = GameGlobal.self = GameGlobal.top = GameGlobal.parent = GameGlobal;
  } else {
    for (const key in _window) {
      const descriptor = Object.getOwnPropertyDescriptor(GameGlobal, key);

      if (!descriptor || descriptor.configurable === true) {
        Object.defineProperty(window, key, {
          value: _window[key],
        });
      }
    }

    for (const key in _window.document) {
      const descriptor = Object.getOwnPropertyDescriptor(GameGlobal.document, key);

      if (!descriptor || descriptor.configurable === true) {
        Object.defineProperty(GameGlobal.document, key, {
          value: _window.document[key],
        });
      }
    }
    window.parent = window;
    window.wx = wx;
  }
}

if (!GameGlobal.__isAdapterInjected) {
  GameGlobal.__isAdapterInjected = true;
  inject();
}
