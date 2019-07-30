'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * 主进程
 */
var main = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var isUpdate, git, templateName, customizePrompt;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return checkVersion();

          case 3:
            isUpdate = _context.sent;

            if (!isUpdate) {
              _context.next = 7;
              break;
            }

            _context.next = 7;
            return updateCli();

          case 7:
            _context.next = 9;
            return checkDir();

          case 9:
            _context.next = 11;
            return selectTemplate();

          case 11:
            git = _context.sent;
            _context.next = 14;
            return (0, _download2.default)(projectName, git);

          case 14:
            templateName = _context.sent;
            _context.next = 17;
            return getCustomizePrompt(templateName, "customize_prompt.js");

          case 17:
            customizePrompt = _context.sent;
            _context.next = 20;
            return render(projectName, templateName, customizePrompt);

          case 20:
            build();
            _context.next = 26;
            break;

          case 23:
            _context.prev = 23;
            _context.t0 = _context['catch'](0);

            console.log(_logSymbols2.default.error, _chalk2.default.red('\u521B\u5EFA\u5931\u8D25: ' + _context.t0));

          case 26:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 23]]);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

// 检查版本


var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _logSymbols = require('log-symbols');

var _logSymbols2 = _interopRequireDefault(_logSymbols);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _latestVersion = require('latest-version');

var _latestVersion2 = _interopRequireDefault(_latestVersion);

var _child_process = require('child_process');

var _rimraf = require('rimraf');

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _template = require('./config/template.json');

var _template2 = _interopRequireDefault(_template);

var _index = require('./config/index');

var _index2 = _interopRequireDefault(_index);

var _download = require('./lib/download');

var _download2 = _interopRequireDefault(_download);

var _generator = require('./lib/generator');

var _generator2 = _interopRequireDefault(_generator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_commander2.default.usage("<project-name>").parse(process.argv);

// 根据输入的获取项目名称
var projectName = _commander2.default.args[0];
if (!projectName) {
  // 如果没有输入就执行help命令
  _commander2.default.help();
}

// 获取当前的工作目录
var rootName = _path2.default.basename(process.cwd());

// 项目初始化
main();function checkVersion() {
  var _this = this;

  return new Promise(function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(resolve, reject) {
      var spinner, cliVersion, localVersion, cliVersionArr, localVersionArr, isNew;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log('\r');
              spinner = (0, _ora2.default)('检查zone-cli版本中');

              spinner.start();
              _context2.next = 5;
              return (0, _latestVersion2.default)("zone-cli");

            case 5:
              cliVersion = _context2.sent;
              localVersion = require('../package.json').version;
              // console.log(`本地版本${localVersion}, 最新版本${cliVersion}`)

              cliVersionArr = cliVersion.split('.');
              localVersionArr = localVersion.split('.');
              isNew = cliVersionArr.some(function (item, index) {
                return Number(item) > Number(localVersionArr[index]);
              });

              if (!isNew) {
                spinner.succeed();
                console.log('\r\nzone-cli\u662F\u6700\u65B0\u7684\r\n');
              }
              resolve(isNew);

            case 12:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());
}

// 更新脚手架
function updateCli() {
  var _this2 = this;

  return new Promise(function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(resolve) {
      var promptArr, _ref4, npmType, spinner, status;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              console.log(_logSymbols2.default.warning, _chalk2.default.green('\u6709\u65B0\u7248\u672C,\u8BF7\u66F4\u65B0'));
              promptArr = _index2.default.updateNPMPrompt;
              _context3.next = 4;
              return _inquirer2.default.prompt(promptArr);

            case 4:
              _ref4 = _context3.sent;
              npmType = _ref4.npmType;
              spinner = (0, _ora2.default)('更新zone-cli中 ');
              status = void 0;
              _context3.t0 = npmType;
              _context3.next = _context3.t0 === "npm" ? 11 : _context3.t0 === "cnpm" ? 14 : _context3.t0 === "yarn" ? 17 : 20;
              break;

            case 11:
              spinner.start();
              status = (0, _child_process.spawn)(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ["install", "zone-cli", "-g"]);
              return _context3.abrupt('break', 20);

            case 14:
              spinner.start();
              status = (0, _child_process.spawn)(/^win/.test(process.platform) ? 'cnpm.cmd' : 'cnpm', ["install", "zone-cli", "-g"]);
              return _context3.abrupt('break', 20);

            case 17:
              spinner.start();
              status = (0, _child_process.spawn)(/^win/.test(process.platform) ? 'yarn.cmd' : 'yarn', ["add", "zone-cli", "-g"]);
              return _context3.abrupt('break', 20);

            case 20:
              status.stdout.on("data", function (data) {
                console.log(data.toString());
              });
              status.on("close", function () {
                spinner.succeed();
                console.log(_logSymbols2.default.success, _chalk2.default.green("更新成功"));
                resolve();
              });

            case 22:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this2);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
}

// 检查目录是否存在
function checkDir() {
  return new Promise(function (resolve, reject) {
    if (!_fs2.default.existsSync(projectName)) {
      _fs2.default.mkdirSync(projectName);
      resolve();
    } else {
      var config = {
        type: 'confirm',
        message: '已经存在目录了,是否要删除该目录?',
        name: "watch"
      };
      _inquirer2.default.prompt(config).then(function (res) {
        if (res.watch) {
          (0, _rimraf.sync)(projectName);
          _fs2.default.mkdirSync(projectName);
          console.log('\r');
          resolve();
        } else {
          // 项目已经存在
          // console.log(logSymbols.error, chalk.red(`项目${projectName}已经存在`))
          reject('\u9879\u76EE' + projectName + '\u5DF2\u7ECF\u5B58\u5728');
        }
      });
    }
  });
}

// 选择模板
function selectTemplate() {
  return new Promise(function (resolve, reject) {
    var choices = Object.values(_template2.default).map(function (item) {
      return {
        name: item.name,
        value: item.value
      };
    });
    var config = {
      type: 'list',
      message: '请选择创建的项目类型\n',
      name: 'select',
      choices: [].concat(_toConsumableArray(choices))
    };
    _inquirer2.default.prompt(config).then(function (res) {
      var select = res.select;
      var _templateConfig$selec = _template2.default[select],
          value = _templateConfig$selec.value,
          git = _templateConfig$selec.git;

      resolve(git);
    });
  });
}

// 读取配置文件
function getCustomizePrompt(templateName, fileName) {
  return new Promise(function (resolve) {
    var filePath = _path2.default.join(process.cwd(), templateName, fileName);
    if (_fs2.default.existsSync(filePath)) {
      // console.log('读取模板配置文件')
      var file = require(filePath);
      resolve(file);
    } else {
      // console.log('该文件没有配置文件')
      resolve([]);
    }
  });
}

// 渲染模板
function render(projectName, templateName, customizePrompt) {
  var _this3 = this;

  return new Promise(function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(resolve, reject) {
      var context, promptArr, answer, generatorParam;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              context = {
                name: projectName,
                root: projectName,
                downloadTemp: templateName
              };
              promptArr = _index2.default.getDefaultPrompt(context);

              promptArr.push.apply(promptArr, _toConsumableArray(customizePrompt));
              _context4.next = 6;
              return _inquirer2.default.prompt(promptArr);

            case 6:
              answer = _context4.sent;
              generatorParam = {
                metadata: _extends({}, answer),
                src: context.downloadTemp,
                dest: context.root
              };
              _context4.next = 10;
              return (0, _generator2.default)(generatorParam);

            case 10:
              resolve();
              _context4.next = 16;
              break;

            case 13:
              _context4.prev = 13;
              _context4.t0 = _context4['catch'](0);

              reject(_context4.t0);

            case 16:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this3, [[0, 13]]);
    }));

    return function (_x4, _x5) {
      return _ref5.apply(this, arguments);
    };
  }());
}

// 提示
function build() {
  console.log('\r');
  console.log(_logSymbols2.default.success, _chalk2.default.green('\u6267\u884C cd ' + projectName));
  console.log(_logSymbols2.default.success, _chalk2.default.green('\u5B89\u88C5\u4F9D\u8D56 \u4E09\u9009\u4E00'));
  console.log(_logSymbols2.default.success, _chalk2.default.green('npm install'));
  console.log(_logSymbols2.default.success, _chalk2.default.green('cnpm install'));
  console.log(_logSymbols2.default.success, _chalk2.default.green('yard install'), '\n');
}