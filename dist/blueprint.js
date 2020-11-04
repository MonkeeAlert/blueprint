/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/blueprint.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/blueprint.js":
/*!*****************************!*\
  !*** ./src/js/blueprint.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Blueprint; });
// todo in widget: 
// 1. canvas [x]
// 2. multistep zoom [x]
// 3. zoom with scroll on desktop
// 4. zoom with fingers on phone
// 5. zoom buttons: in, out, center
// 6. point event handler
// 7. all data must be received through json (bg, points, rows)
// 8. placeholder of point
class Blueprint {
  constructor(target, bg, points) {
    this.target = target;
    this.scheme = bg;
    this.scheme.sizes = {
      w: +bg.width,
      h: +bg.height
    };
    this.points = points;
    this.scales = this.setScales();
    this.isDragged = false;
    this.schemeCanvas = null; // this.CANVAS_SELECTOR = '.blueprint__canvas-wrapper';

    this.IS_MOBILE = window.innerWidth <= 1024;
    this.current = {
      x: 0,
      y: 0
    };
    this.initialize();
  }

  get center() {
    return {
      x: this.target.offsetWidth / 2,
      y: this.target.offsetHeight / 2
    };
  }

  initialize() {
    this.initializeSchemeLayout();
  }

  initializeSchemeLayout() {
    const {
      w,
      h
    } = this.scheme.sizes;
    this.schemeCanvas = this.buildCanvasLayout(this.createCanvas('background'), w, h);
    this.initializeSchemeDrag();
  }

  createCanvas(type) {
    const c = document.createElement('canvas');
    c.setAttribute('id', `blueprint-${type}`);
    c.setAttribute('class', `blueprint__canvas`);
    c.setAttribute('data-type', type);
    this.target.append(c);
    return c;
  }

  buildCanvasLayout(layout, width, height) {
    let ctx; // todo: refactor

    switch (layout.getAttribute('data-type')) {
      case 'background':
        ctx = layout.getContext('2d');
        layout.setAttribute('width', this.target.offsetWidth);
        layout.setAttribute('height', this.target.offsetHeight);
        const bg = new Image(width, height);
        bg.src = this.scheme.image;

        bg.onload = _ => {
          ctx.drawImage(bg, 0, 0, width, height, this.center.x - width * this.scales[0] / 2, this.center.y - height * this.scales[0] / 2, width * this.scales[0], height * this.scales[0]);
        };

        break;

      default:
        break;
    }

    return ctx;
  }

  setScales() {
    const {
      w,
      h
    } = this.scheme.sizes;
    const {
      offsetWidth,
      offsetHeight
    } = this.target;
    let bgWidth = w,
        bgHeight = h;
    let zw = offsetWidth / bgWidth,
        zh = offsetHeight / bgHeight;
    let z = Math.min(zw, zh);
    let minScales = [...new Array(5)].map((_, k) => Math.max(z, z * Math.pow(1.5, k))).filter(i => i < 1);
    let maxScales = [...new Array(5)].map((_, k) => Math.max(z, z * Math.pow(1.5, k))).filter(i => i > 1);
    return [...minScales, 1, ...maxScales];
  }

  initializeSchemeDrag() {
    let sx, sy;

    const startDrag = e => {
      if (e.target !== this.schemeCanvas.canvas) return;
      this.isDragged = true;
      const {
        left,
        top
      } = this.schemeCanvas.canvas.getBoundingClientRect();

      if (!this.IS_MOBILE) {
        sx = e.clientX - left;
        sy = e.clientY - top;
      } else {
        sx = e.changedTouches[0].clientX - left;
        sy = e.changedTouches[0].clientY - top;
      }
    };

    const drag = e => {
      if (this.isDragged) {
        const {
          left,
          top
        } = this.schemeCanvas.canvas.getBoundingClientRect();
        let dx, dy;

        if (!this.IS_MOBILE) {
          dx = e.clientX - left - sx;
          dy = e.clientY - top - sy;
        } else {
          dx = e.changedTouches[0].clientX - left - sx;
          dy = e.changedTouches[0].clientY - top - sy;
        }

        this.current.x += dx;
        this.current.y += dy;
        e.target.style = `transform: translate(${this.current.x}px, ${this.current.y}px)`;
      }
    };

    const endDrag = e => {
      if (this.isDragged) this.isDragged = false; // const { width, height, left, top } = this.schemeCanvas.canvas.getBoundingClientRect();
      // const { w, h } = this.scheme.sizes;
      // if(
      //   left + width > w || 
      //   left - width < w ||
      //   top + height > h ||
      //   top - height < h
      // ) {
      //   this.schemeCanvas.canvas.style = 'transform: translate(0px, 0px)';
      // }
    };

    this.target.addEventListener('mousedown', startDrag);
    this.target.addEventListener('mousemove', drag);
    this.target.addEventListener('mouseup', endDrag);
    this.target.addEventListener('mouseleave', endDrag);
    this.target.addEventListener('touchstart', startDrag);
    this.target.addEventListener('touchmove', drag);
    this.target.addEventListener('touchend', endDrag);
  }

} // initializePointsLayout() {
//   const { pointsRadius } = this.options;
//   const ctx = this.buildCanvasLayout(this.pointsLayout);
//   this.points.forEach(el => {
//     ctx.beginPath();
//     ctx.arc(el.x - pointsRadius, el.y - pointsRadius, pointsRadius, 0, Math.PI * 2);
//     console.log(el)
//     ctx.fillStyle = "#000";
//     ctx.fill();
//   });
// }
// create zoom
// createZoomBar() {
//   // ...
// }

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2JsdWVwcmludC5qcyJdLCJuYW1lcyI6WyJCbHVlcHJpbnQiLCJjb25zdHJ1Y3RvciIsInRhcmdldCIsImJnIiwicG9pbnRzIiwic2NoZW1lIiwic2l6ZXMiLCJ3Iiwid2lkdGgiLCJoIiwiaGVpZ2h0Iiwic2NhbGVzIiwic2V0U2NhbGVzIiwiaXNEcmFnZ2VkIiwic2NoZW1lQ2FudmFzIiwiSVNfTU9CSUxFIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImN1cnJlbnQiLCJ4IiwieSIsImluaXRpYWxpemUiLCJjZW50ZXIiLCJvZmZzZXRXaWR0aCIsIm9mZnNldEhlaWdodCIsImluaXRpYWxpemVTY2hlbWVMYXlvdXQiLCJidWlsZENhbnZhc0xheW91dCIsImNyZWF0ZUNhbnZhcyIsImluaXRpYWxpemVTY2hlbWVEcmFnIiwidHlwZSIsImMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmQiLCJsYXlvdXQiLCJjdHgiLCJnZXRBdHRyaWJ1dGUiLCJnZXRDb250ZXh0IiwiSW1hZ2UiLCJzcmMiLCJpbWFnZSIsIm9ubG9hZCIsIl8iLCJkcmF3SW1hZ2UiLCJiZ1dpZHRoIiwiYmdIZWlnaHQiLCJ6dyIsInpoIiwieiIsIk1hdGgiLCJtaW4iLCJtaW5TY2FsZXMiLCJBcnJheSIsIm1hcCIsImsiLCJtYXgiLCJwb3ciLCJmaWx0ZXIiLCJpIiwibWF4U2NhbGVzIiwic3giLCJzeSIsInN0YXJ0RHJhZyIsImUiLCJjYW52YXMiLCJsZWZ0IiwidG9wIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImNsaWVudFkiLCJjaGFuZ2VkVG91Y2hlcyIsImRyYWciLCJkeCIsImR5Iiwic3R5bGUiLCJlbmREcmFnIiwiYWRkRXZlbnRMaXN0ZW5lciJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNB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ZSI6ImJsdWVwcmludC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2pzL2JsdWVwcmludC5qc1wiKTtcbiIsIi8vIHRvZG8gaW4gd2lkZ2V0OiBcbi8vIDEuIGNhbnZhcyBbeF1cbi8vIDIuIG11bHRpc3RlcCB6b29tIFt4XVxuLy8gMy4gem9vbSB3aXRoIHNjcm9sbCBvbiBkZXNrdG9wXG4vLyA0LiB6b29tIHdpdGggZmluZ2VycyBvbiBwaG9uZVxuLy8gNS4gem9vbSBidXR0b25zOiBpbiwgb3V0LCBjZW50ZXJcbi8vIDYuIHBvaW50IGV2ZW50IGhhbmRsZXJcbi8vIDcuIGFsbCBkYXRhIG11c3QgYmUgcmVjZWl2ZWQgdGhyb3VnaCBqc29uIChiZywgcG9pbnRzLCByb3dzKVxuLy8gOC4gcGxhY2Vob2xkZXIgb2YgcG9pbnRcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmx1ZXByaW50IHtcbiAgY29uc3RydWN0b3IodGFyZ2V0LCBiZywgcG9pbnRzKSB7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgXG4gICAgdGhpcy5zY2hlbWUgPSBiZztcbiAgICB0aGlzLnNjaGVtZS5zaXplcyA9IHsgdzogK2JnLndpZHRoLCBoOiArYmcuaGVpZ2h0IH07XG4gICAgdGhpcy5wb2ludHMgPSBwb2ludHM7XG5cbiAgICB0aGlzLnNjYWxlcyA9IHRoaXMuc2V0U2NhbGVzKCk7XG4gICAgdGhpcy5pc0RyYWdnZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuc2NoZW1lQ2FudmFzID0gbnVsbDtcblxuICAgIC8vIHRoaXMuQ0FOVkFTX1NFTEVDVE9SID0gJy5ibHVlcHJpbnRfX2NhbnZhcy13cmFwcGVyJztcbiAgICB0aGlzLklTX01PQklMRSA9IHdpbmRvdy5pbm5lcldpZHRoIDw9IDEwMjQ7XG5cbiAgICB0aGlzLmN1cnJlbnQgPSB7IHg6IDAsIHk6IDAgfTtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIGdldCBjZW50ZXIoKSB7XG4gICAgcmV0dXJuIHsgeCA6IHRoaXMudGFyZ2V0Lm9mZnNldFdpZHRoIC8gMiwgeSA6IHRoaXMudGFyZ2V0Lm9mZnNldEhlaWdodCAvIDIgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmluaXRpYWxpemVTY2hlbWVMYXlvdXQoKTtcbiAgfVxuXG4gIGluaXRpYWxpemVTY2hlbWVMYXlvdXQoKSB7XG4gICAgY29uc3QgeyB3LCBoIH0gPSB0aGlzLnNjaGVtZS5zaXplcztcblxuICAgIHRoaXMuc2NoZW1lQ2FudmFzID0gdGhpcy5idWlsZENhbnZhc0xheW91dChcbiAgICAgIHRoaXMuY3JlYXRlQ2FudmFzKCdiYWNrZ3JvdW5kJyksIHcsIGhcbiAgICApO1xuXG4gICAgdGhpcy5pbml0aWFsaXplU2NoZW1lRHJhZygpO1xuICB9XG5cbiAgY3JlYXRlQ2FudmFzKHR5cGUpIHtcbiAgICBjb25zdCBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cbiAgICBjLnNldEF0dHJpYnV0ZSgnaWQnLCBgYmx1ZXByaW50LSR7dHlwZX1gKTtcbiAgICBjLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBgYmx1ZXByaW50X19jYW52YXNgKTtcbiAgICBjLnNldEF0dHJpYnV0ZSgnZGF0YS10eXBlJywgdHlwZSk7XG5cbiAgICB0aGlzLnRhcmdldC5hcHBlbmQoYyk7XG4gICAgXG4gICAgcmV0dXJuIGM7XG4gIH0gXG5cbiAgYnVpbGRDYW52YXNMYXlvdXQobGF5b3V0LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgbGV0IGN0eDtcblxuICAgIC8vIHRvZG86IHJlZmFjdG9yXG4gICAgc3dpdGNoKGxheW91dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpKSB7XG4gICAgICBjYXNlICdiYWNrZ3JvdW5kJzpcbiAgICAgICAgY3R4ID0gbGF5b3V0LmdldENvbnRleHQoJzJkJyk7XG4gICAgXG4gICAgICAgIGxheW91dC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgIHRoaXMudGFyZ2V0Lm9mZnNldFdpZHRoKTtcbiAgICAgICAgbGF5b3V0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy50YXJnZXQub2Zmc2V0SGVpZ2h0KTtcblxuICAgICAgICBjb25zdCBiZyA9IG5ldyBJbWFnZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgYmcuc3JjID0gdGhpcy5zY2hlbWUuaW1hZ2U7XG4gICAgICAgIFxuICAgICAgICBiZy5vbmxvYWQgPSBfID0+IHtcbiAgICAgICAgICBjdHguZHJhd0ltYWdlKFxuICAgICAgICAgICAgYmcsIFxuICAgICAgICAgICAgMCwgMCxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgICB0aGlzLmNlbnRlci54IC0gd2lkdGggKiB0aGlzLnNjYWxlc1swXSAvIDIsIHRoaXMuY2VudGVyLnkgLSBoZWlnaHQgKiB0aGlzLnNjYWxlc1swXSAvIDIsXG4gICAgICAgICAgICB3aWR0aCAqIHRoaXMuc2NhbGVzWzBdLCBoZWlnaHQgKiB0aGlzLnNjYWxlc1swXSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICBkZWZhdWx0OiBicmVhaztcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGN0eDtcbiAgfVxuICBcbiAgc2V0U2NhbGVzKCkge1xuICAgIGNvbnN0IHsgdywgaCB9ID0gdGhpcy5zY2hlbWUuc2l6ZXM7XG4gICAgY29uc3QgeyBvZmZzZXRXaWR0aCwgb2Zmc2V0SGVpZ2h0IH0gPSB0aGlzLnRhcmdldDtcblxuICAgIGxldCBiZ1dpZHRoICA9IHcsXG4gICAgICAgIGJnSGVpZ2h0ID0gaDtcbiAgICBcbiAgICBsZXQgencgPSBvZmZzZXRXaWR0aCAvIGJnV2lkdGgsXG4gICAgICAgIHpoID0gb2Zmc2V0SGVpZ2h0IC8gYmdIZWlnaHQ7XG5cbiAgICBsZXQgeiA9IE1hdGgubWluKHp3LCB6aCk7XG5cbiAgICBsZXQgbWluU2NhbGVzID0gWyAuLi5uZXcgQXJyYXkoNSkgXS5tYXAoKCBfLCBrKSA9PiBNYXRoLm1heCh6LCB6ICogKE1hdGgucG93KDEuNSwgaykpKSkuZmlsdGVyKGkgPT4gaSA8IDEpO1xuICAgIGxldCBtYXhTY2FsZXMgPSBbIC4uLm5ldyBBcnJheSg1KSBdLm1hcCgoIF8sIGspID0+IE1hdGgubWF4KHosIHogKiAoTWF0aC5wb3coMS41LCBrKSkpKS5maWx0ZXIoaSA9PiBpID4gMSk7XG4gICAgXG4gICAgcmV0dXJuIFsgLi4ubWluU2NhbGVzLCAxLCAuLi5tYXhTY2FsZXMgXTtcbiAgfVxuXG4gIGluaXRpYWxpemVTY2hlbWVEcmFnKCkge1xuICAgIGxldCBzeCwgc3k7XG5cbiAgICBjb25zdCBzdGFydERyYWcgPSBlID0+IHtcbiAgICAgIGlmKGUudGFyZ2V0ICE9PSB0aGlzLnNjaGVtZUNhbnZhcy5jYW52YXMpIHJldHVybjtcblxuICAgICAgdGhpcy5pc0RyYWdnZWQgPSB0cnVlO1xuICAgICAgY29uc3QgeyBsZWZ0LCB0b3AgfSA9IHRoaXMuc2NoZW1lQ2FudmFzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgaWYoIXRoaXMuSVNfTU9CSUxFKSB7XG4gICAgICAgIHN4ID0gZS5jbGllbnRYIC0gbGVmdDtcbiAgICAgICAgc3kgPSBlLmNsaWVudFkgLSB0b3A7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzeCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIGxlZnQ7XG4gICAgICAgIHN5ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gdG9wO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRyYWcgPSBlID0+IHtcbiAgICAgIGlmKHRoaXMuaXNEcmFnZ2VkKSB7XG4gICAgICAgIGNvbnN0IHsgbGVmdCwgdG9wIH0gPSB0aGlzLnNjaGVtZUNhbnZhcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGxldCBkeCwgZHk7XG5cbiAgICAgICAgaWYoIXRoaXMuSVNfTU9CSUxFKSB7XG4gICAgICAgICAgZHggPSAoZS5jbGllbnRYIC0gbGVmdCkgLSBzeDtcbiAgICAgICAgICBkeSA9IChlLmNsaWVudFkgLSB0b3ApIC0gc3k7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZHggPSAoZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gbGVmdCkgLSBzeDtcbiAgICAgICAgICBkeSA9IChlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSB0b3ApIC0gc3k7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnQueCArPSBkeDtcbiAgICAgICAgdGhpcy5jdXJyZW50LnkgKz0gZHk7XG5cbiAgICAgICAgZS50YXJnZXQuc3R5bGUgPSBgdHJhbnNmb3JtOiB0cmFuc2xhdGUoJHt0aGlzLmN1cnJlbnQueH1weCwgJHt0aGlzLmN1cnJlbnQueX1weClgO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGVuZERyYWcgPSBlID0+IHtcbiAgICAgIGlmKHRoaXMuaXNEcmFnZ2VkKSB0aGlzLmlzRHJhZ2dlZCA9IGZhbHNlO1xuICAgICAgXG4gICAgICAvLyBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIGxlZnQsIHRvcCB9ID0gdGhpcy5zY2hlbWVDYW52YXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgLy8gY29uc3QgeyB3LCBoIH0gPSB0aGlzLnNjaGVtZS5zaXplcztcbiAgICAgIC8vIGlmKFxuICAgICAgLy8gICBsZWZ0ICsgd2lkdGggPiB3IHx8IFxuICAgICAgLy8gICBsZWZ0IC0gd2lkdGggPCB3IHx8XG4gICAgICAvLyAgIHRvcCArIGhlaWdodCA+IGggfHxcbiAgICAgIC8vICAgdG9wIC0gaGVpZ2h0IDwgaFxuICAgICAgLy8gKSB7XG4gICAgICAvLyAgIHRoaXMuc2NoZW1lQ2FudmFzLmNhbnZhcy5zdHlsZSA9ICd0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwcHgsIDBweCknO1xuICAgICAgLy8gfVxuICAgIH07XG5cbiAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzdGFydERyYWcpO1xuICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRyYWcpO1xuICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlbmREcmFnKTtcbiAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZW5kRHJhZyk7XG4gICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHN0YXJ0RHJhZyk7XG4gICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZHJhZyk7XG4gICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBlbmREcmFnKTtcbiAgfVxufVxuXG5cbiAgLy8gaW5pdGlhbGl6ZVBvaW50c0xheW91dCgpIHtcbiAgLy8gICBjb25zdCB7IHBvaW50c1JhZGl1cyB9ID0gdGhpcy5vcHRpb25zO1xuICAvLyAgIGNvbnN0IGN0eCA9IHRoaXMuYnVpbGRDYW52YXNMYXlvdXQodGhpcy5wb2ludHNMYXlvdXQpO1xuXG4gIC8vICAgdGhpcy5wb2ludHMuZm9yRWFjaChlbCA9PiB7XG4gIC8vICAgICBjdHguYmVnaW5QYXRoKCk7XG4gIC8vICAgICBjdHguYXJjKGVsLnggLSBwb2ludHNSYWRpdXMsIGVsLnkgLSBwb2ludHNSYWRpdXMsIHBvaW50c1JhZGl1cywgMCwgTWF0aC5QSSAqIDIpO1xuICAvLyAgICAgY29uc29sZS5sb2coZWwpXG4gIC8vICAgICBjdHguZmlsbFN0eWxlID0gXCIjMDAwXCI7XG4gIC8vICAgICBjdHguZmlsbCgpO1xuICAvLyAgIH0pO1xuXG4gIC8vIH1cblxuICAvLyBjcmVhdGUgem9vbVxuICAvLyBjcmVhdGVab29tQmFyKCkge1xuICAvLyAgIC8vIC4uLlxuICAvLyB9Il0sInNvdXJjZVJvb3QiOiIifQ==