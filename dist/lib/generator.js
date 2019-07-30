'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _metalsmith = require('metalsmith');

var _metalsmith2 = _interopRequireDefault(_metalsmith);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _rimraf = require('rimraf');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FILE_IGNORE = '.fileignore';

exports.default = function (config) {
  var metadata = config.metadata,
      src = config.src,
      dest = config.dest;

  if (!src) {
    return Promise.reject(new Error('\u65E0\u6548\u7684source\uFF1A' + src));
  }

  // 官方模板
  return new Promise(function (resolve, reject) {
    var metalsmith = (0, _metalsmith2.default)(process.cwd()).metadata(metadata).clean(false).source(src).destination(dest);

    var ignoreFile = _path2.default.resolve(process.cwd(), src, FILE_IGNORE);
    if (_fs2.default.existsSync(ignoreFile)) {
      // 定义一个用于移除模板中被忽略文件的metalsmith插件
      metalsmith.use(function (files, metalsmith, done) {
        var meta = metalsmith.metadata();
        // 先对ignore文件进行渲染，然后按行切割ignore文件的内容，拿到被忽略清单
        var ignores = _ejs2.default.render(_fs2.default.readFileSync(ignoreFile).toString(), meta).split("\n").filter(function (item) {
          return !!item.length;
        });

        Object.keys(files).forEach(function (fileName) {
          // 移除被忽略的文件
          ignores.forEach(function (ignorePattern) {
            if ((0, _minimatch2.default)(fileName, ignorePattern)) {
              delete files[fileName];
            }
          });
        });
        done();
      });
    }

    metalsmith.use(function (files, metalsmith, done) {
      var meta = metalsmith.metadata();
      // 编译模板
      Object.keys(files).forEach(function (fileName) {
        try {
          var t = files[fileName].contents.toString();
          if (/(<%.*%>)/g.test(t)) {
            files[fileName].contents = new Buffer.from(_ejs2.default.render(t, meta));
          }
        } catch (err) {
          console.log("fileName------------", fileName);
          console.log("er -------------", err);
        }
      });
      done();
    }).build(function (err) {
      (0, _rimraf.sync)(src);
      (0, _rimraf.sync)(dest + '/customize_prompt.js');
      err ? reject(err) : resolve();
    });
  });
};