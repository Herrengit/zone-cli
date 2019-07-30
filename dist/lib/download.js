'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadGitRepo = require('download-git-repo');

var _downloadGitRepo2 = _interopRequireDefault(_downloadGitRepo);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (projectName, url) {
  var loading = (0, _ora2.default)('\u6B63\u5728\u4E0B\u8F7D\u9879\u76EE\u6A21\u677F');
  projectName = _path2.default.join('./download-temp');
  loading.start();
  return new Promise(function (resolve, reject) {
    (0, _downloadGitRepo2.default)('direct:' + url, projectName, { clone: true }, function (err) {
      if (err) {
        loading.fail();
        reject(err);
      } else {
        loading.succeed();
        resolve(projectName);
      }
    });
  });
};