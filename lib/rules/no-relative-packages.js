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
    docs: {},
    fixable: 'code',
    schema: [{
      'type': 'object',
      'properties': {
        'fixable': { 'type': 'boolean' }
      },
      'additionalProperties': false
    }]
  },

  create: function noRelativePackages(context) {

    function findNamedPackage(filePath) {
      const found = _readPkgUp2.default.sync({ cwd: filePath, normalize: false });

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
        const importRoot = _path2.default.dirname(importPkg.path);
        const properPath = _path2.default.relative(importRoot, resolvedImport);
        const properImport = _path2.default.join(importPkg.pkg.name, _path2.default.dirname(properPath), importBaseName === _path2.default.basename(importRoot) ? '' : importBaseName);
        context.report({
          node,
          message: 'Relative import from another package is not allowed. ' + `Use "${properImport}" instead of "${importPath}"`,
          fix(fixer) {
            if (context.options.fixable) {
              return fixer.replaceText(node, `'${properImport}'`);
            }
          }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL25vLXJlbGF0aXZlLXBhY2thZ2VzLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsImZpeGFibGUiLCJzY2hlbWEiLCJjcmVhdGUiLCJub1JlbGF0aXZlUGFja2FnZXMiLCJjb250ZXh0IiwiZmluZE5hbWVkUGFja2FnZSIsImZpbGVQYXRoIiwiZm91bmQiLCJzeW5jIiwiY3dkIiwibm9ybWFsaXplIiwicGtnIiwibmFtZSIsImpvaW4iLCJwYXRoIiwiY2hlY2tJbXBvcnRGb3JSZWxhdGl2ZVBhY2thZ2UiLCJpbXBvcnRQYXRoIiwibm9kZSIsInBvdGVudGlhbFZpb2xhdGlvblR5cGVzIiwiaW5kZXhPZiIsInJlc29sdmVkSW1wb3J0IiwicmVzb2x2ZWRDb250ZXh0IiwiZ2V0RmlsZW5hbWUiLCJpbXBvcnRQa2ciLCJjb250ZXh0UGtnIiwiaW1wb3J0QmFzZU5hbWUiLCJiYXNlbmFtZSIsImltcG9ydFJvb3QiLCJkaXJuYW1lIiwicHJvcGVyUGF0aCIsInJlbGF0aXZlIiwicHJvcGVySW1wb3J0IiwicmVwb3J0IiwibWVzc2FnZSIsImZpeCIsImZpeGVyIiwib3B0aW9ucyIsInJlcGxhY2VUZXh0IiwiSW1wb3J0RGVjbGFyYXRpb24iLCJzb3VyY2UiLCJ2YWx1ZSIsIkNhbGxFeHByZXNzaW9uIiwiYXJndW1lbnRzIiwiZmlyc3RBcmd1bWVudCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxFQURGO0FBRUpDLGFBQVMsTUFGTDtBQUdKQyxZQUFRLENBQ047QUFDRSxjQUFRLFFBRFY7QUFFRSxvQkFBYztBQUNaLG1CQUFXLEVBQUUsUUFBUSxTQUFWO0FBREMsT0FGaEI7QUFLRSw4QkFBd0I7QUFMMUIsS0FETTtBQUhKLEdBRFM7O0FBZWZDLFVBQVEsU0FBU0Msa0JBQVQsQ0FBNEJDLE9BQTVCLEVBQXFDOztBQUUzQyxhQUFTQyxnQkFBVCxDQUEwQkMsUUFBMUIsRUFBb0M7QUFDbEMsWUFBTUMsUUFBUSxvQkFBVUMsSUFBVixDQUFlLEVBQUNDLEtBQUtILFFBQU4sRUFBZ0JJLFdBQVcsS0FBM0IsRUFBZixDQUFkOztBQUVBLFVBQUlILE1BQU1JLEdBQU4sSUFBYSxDQUFDSixNQUFNSSxHQUFOLENBQVVDLElBQTVCLEVBQWtDO0FBQ2hDLGVBQU9QLGlCQUFpQixlQUFLUSxJQUFMLENBQVVOLE1BQU1PLElBQWhCLEVBQXNCLE9BQXRCLENBQWpCLENBQVA7QUFDRDtBQUNELGFBQU9QLEtBQVA7QUFDRDs7QUFFRCxhQUFTUSw2QkFBVCxDQUF1Q0MsVUFBdkMsRUFBbURDLElBQW5ELEVBQXlEO0FBQ3ZELFlBQU1DLDBCQUEwQixDQUFDLFFBQUQsRUFBVyxPQUFYLEVBQW9CLFNBQXBCLENBQWhDO0FBQ0EsVUFBSUEsd0JBQXdCQyxPQUF4QixDQUFnQywwQkFBV0gsVUFBWCxFQUF1QlosT0FBdkIsQ0FBaEMsTUFBcUUsQ0FBQyxDQUExRSxFQUE2RTtBQUMzRTtBQUNEOztBQUVELFlBQU1nQixpQkFBaUIsdUJBQVFKLFVBQVIsRUFBb0JaLE9BQXBCLENBQXZCO0FBQ0EsWUFBTWlCLGtCQUFrQmpCLFFBQVFrQixXQUFSLEVBQXhCOztBQUVBLFVBQUksQ0FBQ0YsY0FBRCxJQUFtQixDQUFDQyxlQUF4QixFQUF5QztBQUN2QztBQUNEOztBQUVELFlBQU1FLFlBQVlsQixpQkFBaUJlLGNBQWpCLENBQWxCO0FBQ0EsWUFBTUksYUFBYW5CLGlCQUFpQmdCLGVBQWpCLENBQW5COztBQUVBLFVBQUlFLFVBQVVaLEdBQVYsSUFBaUJhLFdBQVdiLEdBQTVCLElBQW1DWSxVQUFVWixHQUFWLENBQWNDLElBQWQsS0FBdUJZLFdBQVdiLEdBQVgsQ0FBZUMsSUFBN0UsRUFBbUY7QUFDakYsY0FBTWEsaUJBQWlCLGVBQUtDLFFBQUwsQ0FBY1YsVUFBZCxDQUF2QjtBQUNBLGNBQU1XLGFBQWEsZUFBS0MsT0FBTCxDQUFhTCxVQUFVVCxJQUF2QixDQUFuQjtBQUNBLGNBQU1lLGFBQWEsZUFBS0MsUUFBTCxDQUFjSCxVQUFkLEVBQTBCUCxjQUExQixDQUFuQjtBQUNBLGNBQU1XLGVBQWUsZUFBS2xCLElBQUwsQ0FDbkJVLFVBQVVaLEdBQVYsQ0FBY0MsSUFESyxFQUVuQixlQUFLZ0IsT0FBTCxDQUFhQyxVQUFiLENBRm1CLEVBR25CSixtQkFBbUIsZUFBS0MsUUFBTCxDQUFjQyxVQUFkLENBQW5CLEdBQStDLEVBQS9DLEdBQW9ERixjQUhqQyxDQUFyQjtBQUtBckIsZ0JBQVE0QixNQUFSLENBQWU7QUFDYmYsY0FEYTtBQUViZ0IsbUJBQVMsMERBQ04sUUFBT0YsWUFBYSxpQkFBZ0JmLFVBQVcsR0FIckM7QUFJYmtCLGNBQUlDLEtBQUosRUFBVztBQUNULGdCQUFJL0IsUUFBUWdDLE9BQVIsQ0FBZ0JwQyxPQUFwQixFQUE2QjtBQUMzQixxQkFBT21DLE1BQU1FLFdBQU4sQ0FBa0JwQixJQUFsQixFQUF5QixJQUFHYyxZQUFhLEdBQXpDLENBQVA7QUFDRDtBQUNGO0FBUlksU0FBZjtBQVVEO0FBQ0Y7O0FBRUQsV0FBTztBQUNMTyx3QkFBa0JyQixJQUFsQixFQUF3QjtBQUN0QkYsc0NBQThCRSxLQUFLc0IsTUFBTCxDQUFZQyxLQUExQyxFQUFpRHZCLEtBQUtzQixNQUF0RDtBQUNELE9BSEk7QUFJTEUscUJBQWV4QixJQUFmLEVBQXFCO0FBQ25CLFlBQUksNkJBQWdCQSxJQUFoQixDQUFKLEVBQTJCO0FBQUEsK0NBQ0NBLEtBQUt5QixTQUROOztBQUFBLGdCQUNqQkMsYUFEaUI7O0FBRXpCNUIsd0NBQThCNEIsY0FBY0gsS0FBNUMsRUFBbURHLGFBQW5EO0FBQ0Q7QUFDRjtBQVRJLEtBQVA7QUFXRDtBQTNFYyxDQUFqQiIsImZpbGUiOiJydWxlcy9uby1yZWxhdGl2ZS1wYWNrYWdlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgcmVhZFBrZ1VwIGZyb20gJ3JlYWQtcGtnLXVwJ1xuXG5pbXBvcnQgcmVzb2x2ZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Jlc29sdmUnXG5pbXBvcnQgaW1wb3J0VHlwZSBmcm9tICcuLi9jb3JlL2ltcG9ydFR5cGUnXG5pbXBvcnQgaXNTdGF0aWNSZXF1aXJlIGZyb20gJy4uL2NvcmUvc3RhdGljUmVxdWlyZSdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICBkb2NzOiB7fSxcbiAgICBmaXhhYmxlOiAnY29kZScsXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgICd0eXBlJzogJ29iamVjdCcsXG4gICAgICAgICdwcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdmaXhhYmxlJzogeyAndHlwZSc6ICdib29sZWFuJyB9LFxuICAgICAgICB9LFxuICAgICAgICAnYWRkaXRpb25hbFByb3BlcnRpZXMnOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIG5vUmVsYXRpdmVQYWNrYWdlcyhjb250ZXh0KSB7XG5cbiAgICBmdW5jdGlvbiBmaW5kTmFtZWRQYWNrYWdlKGZpbGVQYXRoKSB7XG4gICAgICBjb25zdCBmb3VuZCA9IHJlYWRQa2dVcC5zeW5jKHtjd2Q6IGZpbGVQYXRoLCBub3JtYWxpemU6IGZhbHNlfSlcblxuICAgICAgaWYgKGZvdW5kLnBrZyAmJiAhZm91bmQucGtnLm5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZpbmROYW1lZFBhY2thZ2UocGF0aC5qb2luKGZvdW5kLnBhdGgsICcuLi8uLicpKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZvdW5kXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tJbXBvcnRGb3JSZWxhdGl2ZVBhY2thZ2UoaW1wb3J0UGF0aCwgbm9kZSkge1xuICAgICAgY29uc3QgcG90ZW50aWFsVmlvbGF0aW9uVHlwZXMgPSBbJ3BhcmVudCcsICdpbmRleCcsICdzaWJsaW5nJ11cbiAgICAgIGlmIChwb3RlbnRpYWxWaW9sYXRpb25UeXBlcy5pbmRleE9mKGltcG9ydFR5cGUoaW1wb3J0UGF0aCwgY29udGV4dCkpID09PSAtMSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzb2x2ZWRJbXBvcnQgPSByZXNvbHZlKGltcG9ydFBhdGgsIGNvbnRleHQpXG4gICAgICBjb25zdCByZXNvbHZlZENvbnRleHQgPSBjb250ZXh0LmdldEZpbGVuYW1lKClcblxuICAgICAgaWYgKCFyZXNvbHZlZEltcG9ydCB8fCAhcmVzb2x2ZWRDb250ZXh0KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBpbXBvcnRQa2cgPSBmaW5kTmFtZWRQYWNrYWdlKHJlc29sdmVkSW1wb3J0KVxuICAgICAgY29uc3QgY29udGV4dFBrZyA9IGZpbmROYW1lZFBhY2thZ2UocmVzb2x2ZWRDb250ZXh0KVxuXG4gICAgICBpZiAoaW1wb3J0UGtnLnBrZyAmJiBjb250ZXh0UGtnLnBrZyAmJiBpbXBvcnRQa2cucGtnLm5hbWUgIT09IGNvbnRleHRQa2cucGtnLm5hbWUpIHtcbiAgICAgICAgY29uc3QgaW1wb3J0QmFzZU5hbWUgPSBwYXRoLmJhc2VuYW1lKGltcG9ydFBhdGgpXG4gICAgICAgIGNvbnN0IGltcG9ydFJvb3QgPSBwYXRoLmRpcm5hbWUoaW1wb3J0UGtnLnBhdGgpXG4gICAgICAgIGNvbnN0IHByb3BlclBhdGggPSBwYXRoLnJlbGF0aXZlKGltcG9ydFJvb3QsIHJlc29sdmVkSW1wb3J0KVxuICAgICAgICBjb25zdCBwcm9wZXJJbXBvcnQgPSBwYXRoLmpvaW4oXG4gICAgICAgICAgaW1wb3J0UGtnLnBrZy5uYW1lLFxuICAgICAgICAgIHBhdGguZGlybmFtZShwcm9wZXJQYXRoKSxcbiAgICAgICAgICBpbXBvcnRCYXNlTmFtZSA9PT0gcGF0aC5iYXNlbmFtZShpbXBvcnRSb290KSA/ICcnIDogaW1wb3J0QmFzZU5hbWVcbiAgICAgICAgKVxuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiAnUmVsYXRpdmUgaW1wb3J0IGZyb20gYW5vdGhlciBwYWNrYWdlIGlzIG5vdCBhbGxvd2VkLiAnICtcbiAgICAgICAgICAgIGBVc2UgXCIke3Byb3BlckltcG9ydH1cIiBpbnN0ZWFkIG9mIFwiJHtpbXBvcnRQYXRofVwiYCxcbiAgICAgICAgICBmaXgoZml4ZXIpIHtcbiAgICAgICAgICAgIGlmIChjb250ZXh0Lm9wdGlvbnMuZml4YWJsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZml4ZXIucmVwbGFjZVRleHQobm9kZSwgYCcke3Byb3BlckltcG9ydH0nYClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCAgXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgY2hlY2tJbXBvcnRGb3JSZWxhdGl2ZVBhY2thZ2Uobm9kZS5zb3VyY2UudmFsdWUsIG5vZGUuc291cmNlKVxuICAgICAgfSxcbiAgICAgIENhbGxFeHByZXNzaW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKGlzU3RhdGljUmVxdWlyZShub2RlKSkge1xuICAgICAgICAgIGNvbnN0IFsgZmlyc3RBcmd1bWVudCBdID0gbm9kZS5hcmd1bWVudHNcbiAgICAgICAgICBjaGVja0ltcG9ydEZvclJlbGF0aXZlUGFja2FnZShmaXJzdEFyZ3VtZW50LnZhbHVlLCBmaXJzdEFyZ3VtZW50KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn1cbiJdfQ==