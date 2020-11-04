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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/main.js");
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

/***/ }),

/***/ "./src/js/data.json":
/*!**************************!*\
  !*** ./src/js/data.json ***!
  \**************************/
/*! exports provided: bg, points, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"bg\":{\"url\":\"http://127.0.0.1:5500/src/img/test.png\",\"sizes\":{\"width\":1366,\"height\":768}},\"points\":[{\"x\":0,\"y\":0,\"row\":0},{\"x\":30,\"y\":0,\"row\":0},{\"x\":60,\"y\":0,\"row\":0},{\"x\":90,\"y\":0,\"row\":0},{\"x\":120,\"y\":0,\"row\":0},{\"x\":150,\"y\":0,\"row\":0},{\"x\":180,\"y\":0,\"row\":0},{\"x\":210,\"y\":0,\"row\":0},{\"x\":240,\"y\":0,\"row\":0},{\"x\":270,\"y\":0,\"row\":0},{\"x\":300,\"y\":0,\"row\":0},{\"x\":330,\"y\":0,\"row\":0},{\"x\":360,\"y\":0,\"row\":0},{\"x\":390,\"y\":0,\"row\":0},{\"x\":420,\"y\":0,\"row\":0},{\"x\":450,\"y\":0,\"row\":0},{\"x\":480,\"y\":0,\"row\":0},{\"x\":510,\"y\":0,\"row\":0},{\"x\":540,\"y\":0,\"row\":0},{\"x\":570,\"y\":0,\"row\":0},{\"x\":600,\"y\":0,\"row\":0},{\"x\":630,\"y\":0,\"row\":0},{\"x\":660,\"y\":0,\"row\":0},{\"x\":690,\"y\":0,\"row\":0},{\"x\":720,\"y\":0,\"row\":0},{\"x\":0,\"y\":30,\"row\":1},{\"x\":30,\"y\":30,\"row\":1},{\"x\":60,\"y\":30,\"row\":1},{\"x\":90,\"y\":30,\"row\":1},{\"x\":120,\"y\":30,\"row\":1},{\"x\":150,\"y\":30,\"row\":1},{\"x\":180,\"y\":30,\"row\":1},{\"x\":210,\"y\":30,\"row\":1},{\"x\":240,\"y\":30,\"row\":1},{\"x\":270,\"y\":30,\"row\":1},{\"x\":300,\"y\":30,\"row\":1},{\"x\":330,\"y\":30,\"row\":1},{\"x\":360,\"y\":30,\"row\":1},{\"x\":390,\"y\":30,\"row\":1},{\"x\":420,\"y\":30,\"row\":1},{\"x\":450,\"y\":30,\"row\":1},{\"x\":480,\"y\":30,\"row\":1},{\"x\":510,\"y\":30,\"row\":1},{\"x\":540,\"y\":30,\"row\":1},{\"x\":570,\"y\":30,\"row\":1},{\"x\":600,\"y\":30,\"row\":1},{\"x\":630,\"y\":30,\"row\":1},{\"x\":660,\"y\":30,\"row\":1},{\"x\":690,\"y\":30,\"row\":1},{\"x\":720,\"y\":30,\"row\":1},{\"x\":0,\"y\":60,\"row\":2},{\"x\":30,\"y\":60,\"row\":2},{\"x\":60,\"y\":60,\"row\":2},{\"x\":90,\"y\":60,\"row\":2},{\"x\":120,\"y\":60,\"row\":2},{\"x\":150,\"y\":60,\"row\":2},{\"x\":180,\"y\":60,\"row\":2},{\"x\":210,\"y\":60,\"row\":2},{\"x\":240,\"y\":60,\"row\":2},{\"x\":270,\"y\":60,\"row\":2},{\"x\":300,\"y\":60,\"row\":2},{\"x\":330,\"y\":60,\"row\":2},{\"x\":360,\"y\":60,\"row\":2},{\"x\":390,\"y\":60,\"row\":2},{\"x\":420,\"y\":60,\"row\":2},{\"x\":450,\"y\":60,\"row\":2},{\"x\":480,\"y\":60,\"row\":2},{\"x\":510,\"y\":60,\"row\":2},{\"x\":540,\"y\":60,\"row\":2},{\"x\":570,\"y\":60,\"row\":2},{\"x\":600,\"y\":60,\"row\":2},{\"x\":630,\"y\":60,\"row\":2},{\"x\":660,\"y\":60,\"row\":2},{\"x\":690,\"y\":60,\"row\":2},{\"x\":720,\"y\":60,\"row\":2},{\"x\":0,\"y\":90,\"row\":3},{\"x\":30,\"y\":90,\"row\":3},{\"x\":60,\"y\":90,\"row\":3},{\"x\":90,\"y\":90,\"row\":3},{\"x\":120,\"y\":90,\"row\":3},{\"x\":150,\"y\":90,\"row\":3},{\"x\":180,\"y\":90,\"row\":3},{\"x\":210,\"y\":90,\"row\":3},{\"x\":240,\"y\":90,\"row\":3},{\"x\":270,\"y\":90,\"row\":3},{\"x\":300,\"y\":90,\"row\":3},{\"x\":330,\"y\":90,\"row\":3},{\"x\":360,\"y\":90,\"row\":3},{\"x\":390,\"y\":90,\"row\":3},{\"x\":420,\"y\":90,\"row\":3},{\"x\":450,\"y\":90,\"row\":3},{\"x\":480,\"y\":90,\"row\":3},{\"x\":510,\"y\":90,\"row\":3},{\"x\":540,\"y\":90,\"row\":3},{\"x\":570,\"y\":90,\"row\":3},{\"x\":600,\"y\":90,\"row\":3},{\"x\":630,\"y\":90,\"row\":3},{\"x\":660,\"y\":90,\"row\":3},{\"x\":690,\"y\":90,\"row\":3},{\"x\":720,\"y\":90,\"row\":3},{\"x\":0,\"y\":120,\"row\":4},{\"x\":30,\"y\":120,\"row\":4},{\"x\":60,\"y\":120,\"row\":4},{\"x\":90,\"y\":120,\"row\":4},{\"x\":120,\"y\":120,\"row\":4},{\"x\":150,\"y\":120,\"row\":4},{\"x\":180,\"y\":120,\"row\":4},{\"x\":210,\"y\":120,\"row\":4},{\"x\":240,\"y\":120,\"row\":4},{\"x\":270,\"y\":120,\"row\":4},{\"x\":300,\"y\":120,\"row\":4},{\"x\":330,\"y\":120,\"row\":4},{\"x\":360,\"y\":120,\"row\":4},{\"x\":390,\"y\":120,\"row\":4},{\"x\":420,\"y\":120,\"row\":4},{\"x\":450,\"y\":120,\"row\":4},{\"x\":480,\"y\":120,\"row\":4},{\"x\":510,\"y\":120,\"row\":4},{\"x\":540,\"y\":120,\"row\":4},{\"x\":570,\"y\":120,\"row\":4},{\"x\":600,\"y\":120,\"row\":4},{\"x\":630,\"y\":120,\"row\":4},{\"x\":660,\"y\":120,\"row\":4},{\"x\":690,\"y\":120,\"row\":4},{\"x\":720,\"y\":120,\"row\":4},{\"x\":0,\"y\":150,\"row\":5},{\"x\":30,\"y\":150,\"row\":5},{\"x\":60,\"y\":150,\"row\":5},{\"x\":90,\"y\":150,\"row\":5},{\"x\":120,\"y\":150,\"row\":5},{\"x\":150,\"y\":150,\"row\":5},{\"x\":180,\"y\":150,\"row\":5},{\"x\":210,\"y\":150,\"row\":5},{\"x\":240,\"y\":150,\"row\":5},{\"x\":270,\"y\":150,\"row\":5},{\"x\":300,\"y\":150,\"row\":5},{\"x\":330,\"y\":150,\"row\":5},{\"x\":360,\"y\":150,\"row\":5},{\"x\":390,\"y\":150,\"row\":5},{\"x\":420,\"y\":150,\"row\":5},{\"x\":450,\"y\":150,\"row\":5},{\"x\":480,\"y\":150,\"row\":5},{\"x\":510,\"y\":150,\"row\":5},{\"x\":540,\"y\":150,\"row\":5},{\"x\":570,\"y\":150,\"row\":5},{\"x\":600,\"y\":150,\"row\":5},{\"x\":630,\"y\":150,\"row\":5},{\"x\":660,\"y\":150,\"row\":5},{\"x\":690,\"y\":150,\"row\":5},{\"x\":720,\"y\":150,\"row\":5},{\"x\":0,\"y\":180,\"row\":6},{\"x\":30,\"y\":180,\"row\":6},{\"x\":60,\"y\":180,\"row\":6},{\"x\":90,\"y\":180,\"row\":6},{\"x\":120,\"y\":180,\"row\":6},{\"x\":150,\"y\":180,\"row\":6},{\"x\":180,\"y\":180,\"row\":6},{\"x\":210,\"y\":180,\"row\":6},{\"x\":240,\"y\":180,\"row\":6},{\"x\":270,\"y\":180,\"row\":6},{\"x\":300,\"y\":180,\"row\":6},{\"x\":330,\"y\":180,\"row\":6},{\"x\":360,\"y\":180,\"row\":6},{\"x\":390,\"y\":180,\"row\":6},{\"x\":420,\"y\":180,\"row\":6},{\"x\":450,\"y\":180,\"row\":6},{\"x\":480,\"y\":180,\"row\":6},{\"x\":510,\"y\":180,\"row\":6},{\"x\":540,\"y\":180,\"row\":6},{\"x\":570,\"y\":180,\"row\":6},{\"x\":600,\"y\":180,\"row\":6},{\"x\":630,\"y\":180,\"row\":6},{\"x\":660,\"y\":180,\"row\":6},{\"x\":690,\"y\":180,\"row\":6},{\"x\":720,\"y\":180,\"row\":6},{\"x\":0,\"y\":210,\"row\":7},{\"x\":30,\"y\":210,\"row\":7},{\"x\":60,\"y\":210,\"row\":7},{\"x\":90,\"y\":210,\"row\":7},{\"x\":120,\"y\":210,\"row\":7},{\"x\":150,\"y\":210,\"row\":7},{\"x\":180,\"y\":210,\"row\":7},{\"x\":210,\"y\":210,\"row\":7},{\"x\":240,\"y\":210,\"row\":7},{\"x\":270,\"y\":210,\"row\":7},{\"x\":300,\"y\":210,\"row\":7},{\"x\":330,\"y\":210,\"row\":7},{\"x\":360,\"y\":210,\"row\":7},{\"x\":390,\"y\":210,\"row\":7},{\"x\":420,\"y\":210,\"row\":7},{\"x\":450,\"y\":210,\"row\":7},{\"x\":480,\"y\":210,\"row\":7},{\"x\":510,\"y\":210,\"row\":7},{\"x\":540,\"y\":210,\"row\":7},{\"x\":570,\"y\":210,\"row\":7},{\"x\":600,\"y\":210,\"row\":7},{\"x\":630,\"y\":210,\"row\":7},{\"x\":660,\"y\":210,\"row\":7},{\"x\":690,\"y\":210,\"row\":7},{\"x\":720,\"y\":210,\"row\":7},{\"x\":0,\"y\":240,\"row\":8},{\"x\":30,\"y\":240,\"row\":8},{\"x\":60,\"y\":240,\"row\":8},{\"x\":90,\"y\":240,\"row\":8},{\"x\":120,\"y\":240,\"row\":8},{\"x\":150,\"y\":240,\"row\":8},{\"x\":180,\"y\":240,\"row\":8},{\"x\":210,\"y\":240,\"row\":8},{\"x\":240,\"y\":240,\"row\":8},{\"x\":270,\"y\":240,\"row\":8},{\"x\":300,\"y\":240,\"row\":8},{\"x\":330,\"y\":240,\"row\":8},{\"x\":360,\"y\":240,\"row\":8},{\"x\":390,\"y\":240,\"row\":8},{\"x\":420,\"y\":240,\"row\":8},{\"x\":450,\"y\":240,\"row\":8},{\"x\":480,\"y\":240,\"row\":8},{\"x\":510,\"y\":240,\"row\":8},{\"x\":540,\"y\":240,\"row\":8},{\"x\":570,\"y\":240,\"row\":8},{\"x\":600,\"y\":240,\"row\":8},{\"x\":630,\"y\":240,\"row\":8},{\"x\":660,\"y\":240,\"row\":8},{\"x\":690,\"y\":240,\"row\":8},{\"x\":720,\"y\":240,\"row\":8},{\"x\":0,\"y\":270,\"row\":9},{\"x\":30,\"y\":270,\"row\":9},{\"x\":60,\"y\":270,\"row\":9},{\"x\":90,\"y\":270,\"row\":9},{\"x\":120,\"y\":270,\"row\":9},{\"x\":150,\"y\":270,\"row\":9},{\"x\":180,\"y\":270,\"row\":9},{\"x\":210,\"y\":270,\"row\":9},{\"x\":240,\"y\":270,\"row\":9},{\"x\":270,\"y\":270,\"row\":9},{\"x\":300,\"y\":270,\"row\":9},{\"x\":330,\"y\":270,\"row\":9},{\"x\":360,\"y\":270,\"row\":9},{\"x\":390,\"y\":270,\"row\":9},{\"x\":420,\"y\":270,\"row\":9},{\"x\":450,\"y\":270,\"row\":9},{\"x\":480,\"y\":270,\"row\":9},{\"x\":510,\"y\":270,\"row\":9},{\"x\":540,\"y\":270,\"row\":9},{\"x\":570,\"y\":270,\"row\":9},{\"x\":600,\"y\":270,\"row\":9},{\"x\":630,\"y\":270,\"row\":9},{\"x\":660,\"y\":270,\"row\":9},{\"x\":690,\"y\":270,\"row\":9},{\"x\":720,\"y\":270,\"row\":9}]}");

/***/ }),

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/main.scss */ "./src/scss/main.scss");
/* harmony import */ var _scss_main_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_scss_main_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _data_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data.json */ "./src/js/data.json");
var _data_json__WEBPACK_IMPORTED_MODULE_1___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./data.json */ "./src/js/data.json", 1);
/* harmony import */ var _blueprint__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./blueprint */ "./src/js/blueprint.js");




window.onload = _ => {
  // get data
  const data = _data_json__WEBPACK_IMPORTED_MODULE_1__;
  const {
    bg,
    points
  } = data; // initialize Blueprint

  const blueprint = new _blueprint__WEBPACK_IMPORTED_MODULE_2__["default"](document.getElementById('test-wrapper'), {
    image: bg.url,
    width: bg.sizes.width,
    height: bg.sizes.height
  }, {
    points: points,
    pointRadius: 10
  });
};

/***/ }),

/***/ "./src/scss/main.scss":
/*!****************************!*\
  !*** ./src/scss/main.scss ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2JsdWVwcmludC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2Nzcy9tYWluLnNjc3MiXSwibmFtZXMiOlsiQmx1ZXByaW50IiwiY29uc3RydWN0b3IiLCJ0YXJnZXQiLCJiZyIsInBvaW50cyIsInNjaGVtZSIsInNpemVzIiwidyIsIndpZHRoIiwiaCIsImhlaWdodCIsInNjYWxlcyIsInNldFNjYWxlcyIsImlzRHJhZ2dlZCIsInNjaGVtZUNhbnZhcyIsIklTX01PQklMRSIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJjdXJyZW50IiwieCIsInkiLCJpbml0aWFsaXplIiwiY2VudGVyIiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJpbml0aWFsaXplU2NoZW1lTGF5b3V0IiwiYnVpbGRDYW52YXNMYXlvdXQiLCJjcmVhdGVDYW52YXMiLCJpbml0aWFsaXplU2NoZW1lRHJhZyIsInR5cGUiLCJjIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwiYXBwZW5kIiwibGF5b3V0IiwiY3R4IiwiZ2V0QXR0cmlidXRlIiwiZ2V0Q29udGV4dCIsIkltYWdlIiwic3JjIiwiaW1hZ2UiLCJvbmxvYWQiLCJfIiwiZHJhd0ltYWdlIiwiYmdXaWR0aCIsImJnSGVpZ2h0IiwienciLCJ6aCIsInoiLCJNYXRoIiwibWluIiwibWluU2NhbGVzIiwiQXJyYXkiLCJtYXAiLCJrIiwibWF4IiwicG93IiwiZmlsdGVyIiwiaSIsIm1heFNjYWxlcyIsInN4Iiwic3kiLCJzdGFydERyYWciLCJlIiwiY2FudmFzIiwibGVmdCIsInRvcCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwiY2hhbmdlZFRvdWNoZXMiLCJkcmFnIiwiZHgiLCJkeSIsInN0eWxlIiwiZW5kRHJhZyIsImFkZEV2ZW50TGlzdGVuZXIiLCJkYXRhIiwiRGF0YSIsImJsdWVwcmludCIsImdldEVsZW1lbnRCeUlkIiwidXJsIiwicG9pbnRSYWRpdXMiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVlLE1BQU1BLFNBQU4sQ0FBZ0I7QUFDN0JDLGFBQVcsQ0FBQ0MsTUFBRCxFQUFTQyxFQUFULEVBQWFDLE1BQWIsRUFBcUI7QUFDOUIsU0FBS0YsTUFBTCxHQUFjQSxNQUFkO0FBRUEsU0FBS0csTUFBTCxHQUFjRixFQUFkO0FBQ0EsU0FBS0UsTUFBTCxDQUFZQyxLQUFaLEdBQW9CO0FBQUVDLE9BQUMsRUFBRSxDQUFDSixFQUFFLENBQUNLLEtBQVQ7QUFBZ0JDLE9BQUMsRUFBRSxDQUFDTixFQUFFLENBQUNPO0FBQXZCLEtBQXBCO0FBQ0EsU0FBS04sTUFB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QVosQ0FBNkIsVUFBN0IsRUFBeUNELE9BQXpDO0FBQ0Q7O0FBaEs0QixDLENBb0s3QjtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0EsSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvTEY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBOztBQUVBNUQsTUFBTSxDQUFDMEIsTUFBUCxHQUFnQkMsQ0FBQyxJQUFJO0FBQ25CO0FBQ0EsUUFBTW1DLElBQUksR0FBR0MsdUNBQWI7QUFDQSxRQUFNO0FBQUU1RSxNQUFGO0FBQU1DO0FBQU4sTUFBaUIwRSxJQUF2QixDQUhtQixDQUtuQjs7QUFDQSxRQUFNRSxTQUFTLEdBQUcsSUFBSWhGLGtEQUFKLENBQ2hCK0IsUUFBUSxDQUFDa0QsY0FBVCxDQUF3QixjQUF4QixDQURnQixFQUVoQjtBQUNFeEMsU0FBSyxFQUFJdEMsRUFBRSxDQUFDK0UsR0FEZDtBQUVFMUUsU0FBSyxFQUFJTCxFQUFFLENBQUNHLEtBQUgsQ0FBU0UsS0FGcEI7QUFHRUUsVUFBTSxFQUFHUCxFQUFFLENBQUNHLEtBQUgsQ0FBU0k7QUFIcEIsR0FGZ0IsRUFPaEI7QUFDRU4sVUFBTSxFQUFRQSxNQURoQjtBQUVFK0UsZUFBVyxFQUFHO0FBRmhCLEdBUGdCLENBQWxCO0FBWUQsQ0FsQkQsQzs7Ozs7Ozs7Ozs7QUNKQSx1QyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvanMvbWFpbi5qc1wiKTtcbiIsIi8vIHRvZG8gaW4gd2lkZ2V0OiBcbi8vIDEuIGNhbnZhcyBbeF1cbi8vIDIuIG11bHRpc3RlcCB6b29tIFt4XVxuLy8gMy4gem9vbSB3aXRoIHNjcm9sbCBvbiBkZXNrdG9wXG4vLyA0LiB6b29tIHdpdGggZmluZ2VycyBvbiBwaG9uZVxuLy8gNS4gem9vbSBidXR0b25zOiBpbiwgb3V0LCBjZW50ZXJcbi8vIDYuIHBvaW50IGV2ZW50IGhhbmRsZXJcbi8vIDcuIGFsbCBkYXRhIG11c3QgYmUgcmVjZWl2ZWQgdGhyb3VnaCBqc29uIChiZywgcG9pbnRzLCByb3dzKVxuLy8gOC4gcGxhY2Vob2xkZXIgb2YgcG9pbnRcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmx1ZXByaW50IHtcbiAgY29uc3RydWN0b3IodGFyZ2V0LCBiZywgcG9pbnRzKSB7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgXG4gICAgdGhpcy5zY2hlbWUgPSBiZztcbiAgICB0aGlzLnNjaGVtZS5zaXplcyA9IHsgdzogK2JnLndpZHRoLCBoOiArYmcuaGVpZ2h0IH07XG4gICAgdGhpcy5wb2ludHMgPSBwb2ludHM7XG5cbiAgICB0aGlzLnNjYWxlcyA9IHRoaXMuc2V0U2NhbGVzKCk7XG4gICAgdGhpcy5pc0RyYWdnZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuc2NoZW1lQ2FudmFzID0gbnVsbDtcblxuICAgIC8vIHRoaXMuQ0FOVkFTX1NFTEVDVE9SID0gJy5ibHVlcHJpbnRfX2NhbnZhcy13cmFwcGVyJztcbiAgICB0aGlzLklTX01PQklMRSA9IHdpbmRvdy5pbm5lcldpZHRoIDw9IDEwMjQ7XG5cbiAgICB0aGlzLmN1cnJlbnQgPSB7IHg6IDAsIHk6IDAgfTtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIGdldCBjZW50ZXIoKSB7XG4gICAgcmV0dXJuIHsgeCA6IHRoaXMudGFyZ2V0Lm9mZnNldFdpZHRoIC8gMiwgeSA6IHRoaXMudGFyZ2V0Lm9mZnNldEhlaWdodCAvIDIgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmluaXRpYWxpemVTY2hlbWVMYXlvdXQoKTtcbiAgfVxuXG4gIGluaXRpYWxpemVTY2hlbWVMYXlvdXQoKSB7XG4gICAgY29uc3QgeyB3LCBoIH0gPSB0aGlzLnNjaGVtZS5zaXplcztcblxuICAgIHRoaXMuc2NoZW1lQ2FudmFzID0gdGhpcy5idWlsZENhbnZhc0xheW91dChcbiAgICAgIHRoaXMuY3JlYXRlQ2FudmFzKCdiYWNrZ3JvdW5kJyksIHcsIGhcbiAgICApO1xuXG4gICAgdGhpcy5pbml0aWFsaXplU2NoZW1lRHJhZygpO1xuICB9XG5cbiAgY3JlYXRlQ2FudmFzKHR5cGUpIHtcbiAgICBjb25zdCBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cbiAgICBjLnNldEF0dHJpYnV0ZSgnaWQnLCBgYmx1ZXByaW50LSR7dHlwZX1gKTtcbiAgICBjLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBgYmx1ZXByaW50X19jYW52YXNgKTtcbiAgICBjLnNldEF0dHJpYnV0ZSgnZGF0YS10eXBlJywgdHlwZSk7XG5cbiAgICB0aGlzLnRhcmdldC5hcHBlbmQoYyk7XG4gICAgXG4gICAgcmV0dXJuIGM7XG4gIH0gXG5cbiAgYnVpbGRDYW52YXNMYXlvdXQobGF5b3V0LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgbGV0IGN0eDtcblxuICAgIC8vIHRvZG86IHJlZmFjdG9yXG4gICAgc3dpdGNoKGxheW91dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpKSB7XG4gICAgICBjYXNlICdiYWNrZ3JvdW5kJzpcbiAgICAgICAgY3R4ID0gbGF5b3V0LmdldENvbnRleHQoJzJkJyk7XG4gICAgXG4gICAgICAgIGxheW91dC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgIHRoaXMudGFyZ2V0Lm9mZnNldFdpZHRoKTtcbiAgICAgICAgbGF5b3V0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgdGhpcy50YXJnZXQub2Zmc2V0SGVpZ2h0KTtcblxuICAgICAgICBjb25zdCBiZyA9IG5ldyBJbWFnZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgYmcuc3JjID0gdGhpcy5zY2hlbWUuaW1hZ2U7XG4gICAgICAgIFxuICAgICAgICBiZy5vbmxvYWQgPSBfID0+IHtcbiAgICAgICAgICBjdHguZHJhd0ltYWdlKFxuICAgICAgICAgICAgYmcsIFxuICAgICAgICAgICAgMCwgMCxcbiAgICAgICAgICAgIHdpZHRoLCBoZWlnaHQsXG4gICAgICAgICAgICB0aGlzLmNlbnRlci54IC0gd2lkdGggKiB0aGlzLnNjYWxlc1swXSAvIDIsIHRoaXMuY2VudGVyLnkgLSBoZWlnaHQgKiB0aGlzLnNjYWxlc1swXSAvIDIsXG4gICAgICAgICAgICB3aWR0aCAqIHRoaXMuc2NhbGVzWzBdLCBoZWlnaHQgKiB0aGlzLnNjYWxlc1swXSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICBkZWZhdWx0OiBicmVhaztcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGN0eDtcbiAgfVxuICBcbiAgc2V0U2NhbGVzKCkge1xuICAgIGNvbnN0IHsgdywgaCB9ID0gdGhpcy5zY2hlbWUuc2l6ZXM7XG4gICAgY29uc3QgeyBvZmZzZXRXaWR0aCwgb2Zmc2V0SGVpZ2h0IH0gPSB0aGlzLnRhcmdldDtcblxuICAgIGxldCBiZ1dpZHRoICA9IHcsXG4gICAgICAgIGJnSGVpZ2h0ID0gaDtcbiAgICBcbiAgICBsZXQgencgPSBvZmZzZXRXaWR0aCAvIGJnV2lkdGgsXG4gICAgICAgIHpoID0gb2Zmc2V0SGVpZ2h0IC8gYmdIZWlnaHQ7XG5cbiAgICBsZXQgeiA9IE1hdGgubWluKHp3LCB6aCk7XG5cbiAgICBsZXQgbWluU2NhbGVzID0gWyAuLi5uZXcgQXJyYXkoNSkgXS5tYXAoKCBfLCBrKSA9PiBNYXRoLm1heCh6LCB6ICogKE1hdGgucG93KDEuNSwgaykpKSkuZmlsdGVyKGkgPT4gaSA8IDEpO1xuICAgIGxldCBtYXhTY2FsZXMgPSBbIC4uLm5ldyBBcnJheSg1KSBdLm1hcCgoIF8sIGspID0+IE1hdGgubWF4KHosIHogKiAoTWF0aC5wb3coMS41LCBrKSkpKS5maWx0ZXIoaSA9PiBpID4gMSk7XG4gICAgXG4gICAgcmV0dXJuIFsgLi4ubWluU2NhbGVzLCAxLCAuLi5tYXhTY2FsZXMgXTtcbiAgfVxuXG4gIGluaXRpYWxpemVTY2hlbWVEcmFnKCkge1xuICAgIGxldCBzeCwgc3k7XG5cbiAgICBjb25zdCBzdGFydERyYWcgPSBlID0+IHtcbiAgICAgIGlmKGUudGFyZ2V0ICE9PSB0aGlzLnNjaGVtZUNhbnZhcy5jYW52YXMpIHJldHVybjtcblxuICAgICAgdGhpcy5pc0RyYWdnZWQgPSB0cnVlO1xuICAgICAgY29uc3QgeyBsZWZ0LCB0b3AgfSA9IHRoaXMuc2NoZW1lQ2FudmFzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgaWYoIXRoaXMuSVNfTU9CSUxFKSB7XG4gICAgICAgIHN4ID0gZS5jbGllbnRYIC0gbGVmdDtcbiAgICAgICAgc3kgPSBlLmNsaWVudFkgLSB0b3A7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzeCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIGxlZnQ7XG4gICAgICAgIHN5ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gdG9wO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRyYWcgPSBlID0+IHtcbiAgICAgIGlmKHRoaXMuaXNEcmFnZ2VkKSB7XG4gICAgICAgIGNvbnN0IHsgbGVmdCwgdG9wIH0gPSB0aGlzLnNjaGVtZUNhbnZhcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGxldCBkeCwgZHk7XG5cbiAgICAgICAgaWYoIXRoaXMuSVNfTU9CSUxFKSB7XG4gICAgICAgICAgZHggPSAoZS5jbGllbnRYIC0gbGVmdCkgLSBzeDtcbiAgICAgICAgICBkeSA9IChlLmNsaWVudFkgLSB0b3ApIC0gc3k7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZHggPSAoZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gbGVmdCkgLSBzeDtcbiAgICAgICAgICBkeSA9IChlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSB0b3ApIC0gc3k7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnQueCArPSBkeDtcbiAgICAgICAgdGhpcy5jdXJyZW50LnkgKz0gZHk7XG5cbiAgICAgICAgZS50YXJnZXQuc3R5bGUgPSBgdHJhbnNmb3JtOiB0cmFuc2xhdGUoJHt0aGlzLmN1cnJlbnQueH1weCwgJHt0aGlzLmN1cnJlbnQueX1weClgO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGVuZERyYWcgPSBlID0+IHtcbiAgICAgIGlmKHRoaXMuaXNEcmFnZ2VkKSB0aGlzLmlzRHJhZ2dlZCA9IGZhbHNlO1xuICAgICAgXG4gICAgICAvLyBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIGxlZnQsIHRvcCB9ID0gdGhpcy5zY2hlbWVDYW52YXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgLy8gY29uc3QgeyB3LCBoIH0gPSB0aGlzLnNjaGVtZS5zaXplcztcbiAgICAgIC8vIGlmKFxuICAgICAgLy8gICBsZWZ0ICsgd2lkdGggPiB3IHx8IFxuICAgICAgLy8gICBsZWZ0IC0gd2lkdGggPCB3IHx8XG4gICAgICAvLyAgIHRvcCArIGhlaWdodCA+IGggfHxcbiAgICAgIC8vICAgdG9wIC0gaGVpZ2h0IDwgaFxuICAgICAgLy8gKSB7XG4gICAgICAvLyAgIHRoaXMuc2NoZW1lQ2FudmFzLmNhbnZhcy5zdHlsZSA9ICd0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwcHgsIDBweCknO1xuICAgICAgLy8gfVxuICAgIH07XG5cbiAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzdGFydERyYWcpO1xuICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRyYWcpO1xuICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlbmREcmFnKTtcbiAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZW5kRHJhZyk7XG4gICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHN0YXJ0RHJhZyk7XG4gICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZHJhZyk7XG4gICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBlbmREcmFnKTtcbiAgfVxufVxuXG5cbiAgLy8gaW5pdGlhbGl6ZVBvaW50c0xheW91dCgpIHtcbiAgLy8gICBjb25zdCB7IHBvaW50c1JhZGl1cyB9ID0gdGhpcy5vcHRpb25zO1xuICAvLyAgIGNvbnN0IGN0eCA9IHRoaXMuYnVpbGRDYW52YXNMYXlvdXQodGhpcy5wb2ludHNMYXlvdXQpO1xuXG4gIC8vICAgdGhpcy5wb2ludHMuZm9yRWFjaChlbCA9PiB7XG4gIC8vICAgICBjdHguYmVnaW5QYXRoKCk7XG4gIC8vICAgICBjdHguYXJjKGVsLnggLSBwb2ludHNSYWRpdXMsIGVsLnkgLSBwb2ludHNSYWRpdXMsIHBvaW50c1JhZGl1cywgMCwgTWF0aC5QSSAqIDIpO1xuICAvLyAgICAgY29uc29sZS5sb2coZWwpXG4gIC8vICAgICBjdHguZmlsbFN0eWxlID0gXCIjMDAwXCI7XG4gIC8vICAgICBjdHguZmlsbCgpO1xuICAvLyAgIH0pO1xuXG4gIC8vIH1cblxuICAvLyBjcmVhdGUgem9vbVxuICAvLyBjcmVhdGVab29tQmFyKCkge1xuICAvLyAgIC8vIC4uLlxuICAvLyB9IiwiaW1wb3J0IFwiLi4vc2Nzcy9tYWluLnNjc3NcIjtcbmltcG9ydCBEYXRhIGZyb20gXCIuL2RhdGEuanNvblwiO1xuaW1wb3J0IEJsdWVwcmludCBmcm9tICcuL2JsdWVwcmludCc7XG5cbndpbmRvdy5vbmxvYWQgPSBfID0+IHtcbiAgLy8gZ2V0IGRhdGFcbiAgY29uc3QgZGF0YSA9IERhdGE7XG4gIGNvbnN0IHsgYmcsIHBvaW50cyB9ID0gZGF0YTtcblxuICAvLyBpbml0aWFsaXplIEJsdWVwcmludFxuICBjb25zdCBibHVlcHJpbnQgPSBuZXcgQmx1ZXByaW50KFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXN0LXdyYXBwZXInKSxcbiAgICB7XG4gICAgICBpbWFnZSAgOiBiZy51cmwsXG4gICAgICB3aWR0aCAgOiBiZy5zaXplcy53aWR0aCxcbiAgICAgIGhlaWdodCA6IGJnLnNpemVzLmhlaWdodCAgXG4gICAgfSxcbiAgICB7XG4gICAgICBwb2ludHMgICAgICA6IHBvaW50cywgXG4gICAgICBwb2ludFJhZGl1cyA6IDEwXG4gICAgfVxuICApO1xufSIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiJdLCJzb3VyY2VSb290IjoiIn0=