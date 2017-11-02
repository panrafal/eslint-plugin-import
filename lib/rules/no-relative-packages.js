'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _readPkgUp = require('read-pkg-up');

var _readPkgUp2 = _interopRequireDefault(_readPkgUp);

var _resolve = require('eslint-module-utils/resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _importType = require('../core/importType');

var _importType2 = _interopRequireDefault(_importType);

var _staticRequire = require('../core/staticRequire');

var _staticRequire2 = _interopRequireDefault(_staticRequire);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  meta: {
    docs: {}
  },

  create: function noRelativePackages(context) {

    function findNamedPackage(filePath) {
      const found = _readPkgUp2.default.sync({ cwd: filePath, normalize: false });
      // console.log(found)
      if (found.pkg && !found.pkg.name) {
        return findNamedPackage(_path2.default.join(found.path, '../..'));
      }
      return found;
    }

    function checkImportForRelativePackage(importPath, node) {
      const potentialViolationTypes = ['parent', 'index', 'sibling'];
      if (potentialViolationTypes.indexOf((0, _importType2.default)(importPath, context)) === -1) {
        return;
      }

      const resolvedImport = (0, _resolve2.default)(importPath, context);
      const resolvedContext = context.getFilename();

      if (!resolvedImport || !resolvedContext) {
        return;
      }

      const importPkg = findNamedPackage(resolvedImport);
      const contextPkg = findNamedPackage(resolvedContext);

      if (importPkg.pkg && contextPkg.pkg && importPkg.pkg.name !== contextPkg.pkg.name) {
        const importBaseName = _path2.default.basename(importPath);
        const properPath = _path2.default.relative(_path2.default.dirname(importPkg.path), resolvedImport);
        const properImport = _path2.default.join(importPkg.pkg.name, _path2.default.dirname(properPath), importBaseName === importPkg.pkg.name ? '' : importBaseName);
        context.report({
          node,
          message: 'Relative import from another package is not allowed. ' + `Use "${properImport}" instead of "${importPath}"`
        });
      }
    }

    return {
      ImportDeclaration(node) {
        checkImportForRelativePackage(node.source.value, node.source);
      },
      CallExpression(node) {
        if ((0, _staticRequire2.default)(node)) {
          var _node$arguments = _slicedToArray(node.arguments, 1);

          const firstArgument = _node$arguments[0];

          checkImportForRelativePackage(firstArgument.value, firstArgument);
        }
      }
    };
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL25vLXJlbGF0aXZlLXBhY2thZ2VzLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsImNyZWF0ZSIsIm5vUmVsYXRpdmVQYWNrYWdlcyIsImNvbnRleHQiLCJmaW5kTmFtZWRQYWNrYWdlIiwiZmlsZVBhdGgiLCJmb3VuZCIsInN5bmMiLCJjd2QiLCJub3JtYWxpemUiLCJwa2ciLCJuYW1lIiwiam9pbiIsInBhdGgiLCJjaGVja0ltcG9ydEZvclJlbGF0aXZlUGFja2FnZSIsImltcG9ydFBhdGgiLCJub2RlIiwicG90ZW50aWFsVmlvbGF0aW9uVHlwZXMiLCJpbmRleE9mIiwicmVzb2x2ZWRJbXBvcnQiLCJyZXNvbHZlZENvbnRleHQiLCJnZXRGaWxlbmFtZSIsImltcG9ydFBrZyIsImNvbnRleHRQa2ciLCJpbXBvcnRCYXNlTmFtZSIsImJhc2VuYW1lIiwicHJvcGVyUGF0aCIsInJlbGF0aXZlIiwiZGlybmFtZSIsInByb3BlckltcG9ydCIsInJlcG9ydCIsIm1lc3NhZ2UiLCJJbXBvcnREZWNsYXJhdGlvbiIsInNvdXJjZSIsInZhbHVlIiwiQ2FsbEV4cHJlc3Npb24iLCJhcmd1bWVudHMiLCJmaXJzdEFyZ3VtZW50Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUFBLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKQyxVQUFNO0FBREYsR0FEUzs7QUFLZkMsVUFBUSxTQUFTQyxrQkFBVCxDQUE0QkMsT0FBNUIsRUFBcUM7O0FBRTNDLGFBQVNDLGdCQUFULENBQTBCQyxRQUExQixFQUFvQztBQUNsQyxZQUFNQyxRQUFRLG9CQUFVQyxJQUFWLENBQWUsRUFBQ0MsS0FBS0gsUUFBTixFQUFnQkksV0FBVyxLQUEzQixFQUFmLENBQWQ7QUFDQTtBQUNBLFVBQUlILE1BQU1JLEdBQU4sSUFBYSxDQUFDSixNQUFNSSxHQUFOLENBQVVDLElBQTVCLEVBQWtDO0FBQ2hDLGVBQU9QLGlCQUFpQixlQUFLUSxJQUFMLENBQVVOLE1BQU1PLElBQWhCLEVBQXNCLE9BQXRCLENBQWpCLENBQVA7QUFDRDtBQUNELGFBQU9QLEtBQVA7QUFDRDs7QUFFRCxhQUFTUSw2QkFBVCxDQUF1Q0MsVUFBdkMsRUFBbURDLElBQW5ELEVBQXlEO0FBQ3ZELFlBQU1DLDBCQUEwQixDQUFDLFFBQUQsRUFBVyxPQUFYLEVBQW9CLFNBQXBCLENBQWhDO0FBQ0EsVUFBSUEsd0JBQXdCQyxPQUF4QixDQUFnQywwQkFBV0gsVUFBWCxFQUF1QlosT0FBdkIsQ0FBaEMsTUFBcUUsQ0FBQyxDQUExRSxFQUE2RTtBQUMzRTtBQUNEOztBQUVELFlBQU1nQixpQkFBaUIsdUJBQVFKLFVBQVIsRUFBb0JaLE9BQXBCLENBQXZCO0FBQ0EsWUFBTWlCLGtCQUFrQmpCLFFBQVFrQixXQUFSLEVBQXhCOztBQUVBLFVBQUksQ0FBQ0YsY0FBRCxJQUFtQixDQUFDQyxlQUF4QixFQUF5QztBQUN2QztBQUNEOztBQUVELFlBQU1FLFlBQVlsQixpQkFBaUJlLGNBQWpCLENBQWxCO0FBQ0EsWUFBTUksYUFBYW5CLGlCQUFpQmdCLGVBQWpCLENBQW5COztBQUVBLFVBQUlFLFVBQVVaLEdBQVYsSUFBaUJhLFdBQVdiLEdBQTVCLElBQW1DWSxVQUFVWixHQUFWLENBQWNDLElBQWQsS0FBdUJZLFdBQVdiLEdBQVgsQ0FBZUMsSUFBN0UsRUFBbUY7QUFDakYsY0FBTWEsaUJBQWlCLGVBQUtDLFFBQUwsQ0FBY1YsVUFBZCxDQUF2QjtBQUNBLGNBQU1XLGFBQWEsZUFBS0MsUUFBTCxDQUFjLGVBQUtDLE9BQUwsQ0FBYU4sVUFBVVQsSUFBdkIsQ0FBZCxFQUE0Q00sY0FBNUMsQ0FBbkI7QUFDQSxjQUFNVSxlQUFlLGVBQUtqQixJQUFMLENBQ25CVSxVQUFVWixHQUFWLENBQWNDLElBREssRUFFbkIsZUFBS2lCLE9BQUwsQ0FBYUYsVUFBYixDQUZtQixFQUduQkYsbUJBQW1CRixVQUFVWixHQUFWLENBQWNDLElBQWpDLEdBQXdDLEVBQXhDLEdBQTZDYSxjQUgxQixDQUFyQjtBQUtBckIsZ0JBQVEyQixNQUFSLENBQWU7QUFDYmQsY0FEYTtBQUViZSxtQkFBUywwREFDTixRQUFPRixZQUFhLGlCQUFnQmQsVUFBVztBQUhyQyxTQUFmO0FBS0Q7QUFDRjs7QUFFRCxXQUFPO0FBQ0xpQix3QkFBa0JoQixJQUFsQixFQUF3QjtBQUN0QkYsc0NBQThCRSxLQUFLaUIsTUFBTCxDQUFZQyxLQUExQyxFQUFpRGxCLEtBQUtpQixNQUF0RDtBQUNELE9BSEk7QUFJTEUscUJBQWVuQixJQUFmLEVBQXFCO0FBQ25CLFlBQUksNkJBQWdCQSxJQUFoQixDQUFKLEVBQTJCO0FBQUEsK0NBQ0NBLEtBQUtvQixTQUROOztBQUFBLGdCQUNqQkMsYUFEaUI7O0FBRXpCdkIsd0NBQThCdUIsY0FBY0gsS0FBNUMsRUFBbURHLGFBQW5EO0FBQ0Q7QUFDRjtBQVRJLEtBQVA7QUFXRDtBQTNEYyxDQUFqQiIsImZpbGUiOiJydWxlcy9uby1yZWxhdGl2ZS1wYWNrYWdlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgcmVhZFBrZ1VwIGZyb20gJ3JlYWQtcGtnLXVwJ1xuXG5pbXBvcnQgcmVzb2x2ZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Jlc29sdmUnXG5pbXBvcnQgaW1wb3J0VHlwZSBmcm9tICcuLi9jb3JlL2ltcG9ydFR5cGUnXG5pbXBvcnQgaXNTdGF0aWNSZXF1aXJlIGZyb20gJy4uL2NvcmUvc3RhdGljUmVxdWlyZSdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICBkb2NzOiB7fSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIG5vUmVsYXRpdmVQYWNrYWdlcyhjb250ZXh0KSB7XG5cbiAgICBmdW5jdGlvbiBmaW5kTmFtZWRQYWNrYWdlKGZpbGVQYXRoKSB7XG4gICAgICBjb25zdCBmb3VuZCA9IHJlYWRQa2dVcC5zeW5jKHtjd2Q6IGZpbGVQYXRoLCBub3JtYWxpemU6IGZhbHNlfSlcbiAgICAgIC8vIGNvbnNvbGUubG9nKGZvdW5kKVxuICAgICAgaWYgKGZvdW5kLnBrZyAmJiAhZm91bmQucGtnLm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZpbmROYW1lZFBhY2thZ2UocGF0aC5qb2luKGZvdW5kLnBhdGgsICcuLi8uLicpKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZvdW5kXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tJbXBvcnRGb3JSZWxhdGl2ZVBhY2thZ2UoaW1wb3J0UGF0aCwgbm9kZSkge1xuICAgICAgY29uc3QgcG90ZW50aWFsVmlvbGF0aW9uVHlwZXMgPSBbJ3BhcmVudCcsICdpbmRleCcsICdzaWJsaW5nJ11cbiAgICAgIGlmIChwb3RlbnRpYWxWaW9sYXRpb25UeXBlcy5pbmRleE9mKGltcG9ydFR5cGUoaW1wb3J0UGF0aCwgY29udGV4dCkpID09PSAtMSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzb2x2ZWRJbXBvcnQgPSByZXNvbHZlKGltcG9ydFBhdGgsIGNvbnRleHQpXG4gICAgICBjb25zdCByZXNvbHZlZENvbnRleHQgPSBjb250ZXh0LmdldEZpbGVuYW1lKClcblxuICAgICAgaWYgKCFyZXNvbHZlZEltcG9ydCB8fCAhcmVzb2x2ZWRDb250ZXh0KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBpbXBvcnRQa2cgPSBmaW5kTmFtZWRQYWNrYWdlKHJlc29sdmVkSW1wb3J0KVxuICAgICAgY29uc3QgY29udGV4dFBrZyA9IGZpbmROYW1lZFBhY2thZ2UocmVzb2x2ZWRDb250ZXh0KVxuXG4gICAgICBpZiAoaW1wb3J0UGtnLnBrZyAmJiBjb250ZXh0UGtnLnBrZyAmJiBpbXBvcnRQa2cucGtnLm5hbWUgIT09IGNvbnRleHRQa2cucGtnLm5hbWUpIHtcbiAgICAgICAgY29uc3QgaW1wb3J0QmFzZU5hbWUgPSBwYXRoLmJhc2VuYW1lKGltcG9ydFBhdGgpXG4gICAgICAgIGNvbnN0IHByb3BlclBhdGggPSBwYXRoLnJlbGF0aXZlKHBhdGguZGlybmFtZShpbXBvcnRQa2cucGF0aCksIHJlc29sdmVkSW1wb3J0KVxuICAgICAgICBjb25zdCBwcm9wZXJJbXBvcnQgPSBwYXRoLmpvaW4oXG4gICAgICAgICAgaW1wb3J0UGtnLnBrZy5uYW1lLCBcbiAgICAgICAgICBwYXRoLmRpcm5hbWUocHJvcGVyUGF0aCksXG4gICAgICAgICAgaW1wb3J0QmFzZU5hbWUgPT09IGltcG9ydFBrZy5wa2cubmFtZSA/ICcnIDogaW1wb3J0QmFzZU5hbWVcbiAgICAgICAgKVxuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiAnUmVsYXRpdmUgaW1wb3J0IGZyb20gYW5vdGhlciBwYWNrYWdlIGlzIG5vdCBhbGxvd2VkLiAnICsgXG4gICAgICAgICAgICBgVXNlIFwiJHtwcm9wZXJJbXBvcnR9XCIgaW5zdGVhZCBvZiBcIiR7aW1wb3J0UGF0aH1cImAsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgY2hlY2tJbXBvcnRGb3JSZWxhdGl2ZVBhY2thZ2Uobm9kZS5zb3VyY2UudmFsdWUsIG5vZGUuc291cmNlKVxuICAgICAgfSxcbiAgICAgIENhbGxFeHByZXNzaW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKGlzU3RhdGljUmVxdWlyZShub2RlKSkge1xuICAgICAgICAgIGNvbnN0IFsgZmlyc3RBcmd1bWVudCBdID0gbm9kZS5hcmd1bWVudHNcbiAgICAgICAgICBjaGVja0ltcG9ydEZvclJlbGF0aXZlUGFja2FnZShmaXJzdEFyZ3VtZW50LnZhbHVlLCBmaXJzdEFyZ3VtZW50KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn1cbiJdfQ==