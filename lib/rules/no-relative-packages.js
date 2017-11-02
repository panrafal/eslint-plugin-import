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
        const importRoot = _path2.default.dirname(importPkg.path);
        const properPath = _path2.default.relative(importRoot, resolvedImport);
        const properImport = _path2.default.join(importPkg.pkg.name, _path2.default.dirname(properPath), importBaseName === _path2.default.basename(importRoot) ? '' : importBaseName);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL25vLXJlbGF0aXZlLXBhY2thZ2VzLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsImNyZWF0ZSIsIm5vUmVsYXRpdmVQYWNrYWdlcyIsImNvbnRleHQiLCJmaW5kTmFtZWRQYWNrYWdlIiwiZmlsZVBhdGgiLCJmb3VuZCIsInN5bmMiLCJjd2QiLCJub3JtYWxpemUiLCJwa2ciLCJuYW1lIiwiam9pbiIsInBhdGgiLCJjaGVja0ltcG9ydEZvclJlbGF0aXZlUGFja2FnZSIsImltcG9ydFBhdGgiLCJub2RlIiwicG90ZW50aWFsVmlvbGF0aW9uVHlwZXMiLCJpbmRleE9mIiwicmVzb2x2ZWRJbXBvcnQiLCJyZXNvbHZlZENvbnRleHQiLCJnZXRGaWxlbmFtZSIsImltcG9ydFBrZyIsImNvbnRleHRQa2ciLCJpbXBvcnRCYXNlTmFtZSIsImJhc2VuYW1lIiwiaW1wb3J0Um9vdCIsImRpcm5hbWUiLCJwcm9wZXJQYXRoIiwicmVsYXRpdmUiLCJwcm9wZXJJbXBvcnQiLCJyZXBvcnQiLCJtZXNzYWdlIiwiSW1wb3J0RGVjbGFyYXRpb24iLCJzb3VyY2UiLCJ2YWx1ZSIsIkNhbGxFeHByZXNzaW9uIiwiYXJndW1lbnRzIiwiZmlyc3RBcmd1bWVudCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTTtBQURGLEdBRFM7O0FBS2ZDLFVBQVEsU0FBU0Msa0JBQVQsQ0FBNEJDLE9BQTVCLEVBQXFDOztBQUUzQyxhQUFTQyxnQkFBVCxDQUEwQkMsUUFBMUIsRUFBb0M7QUFDbEMsWUFBTUMsUUFBUSxvQkFBVUMsSUFBVixDQUFlLEVBQUNDLEtBQUtILFFBQU4sRUFBZ0JJLFdBQVcsS0FBM0IsRUFBZixDQUFkO0FBQ0E7QUFDQSxVQUFJSCxNQUFNSSxHQUFOLElBQWEsQ0FBQ0osTUFBTUksR0FBTixDQUFVQyxJQUE1QixFQUFrQztBQUNoQyxlQUFPUCxpQkFBaUIsZUFBS1EsSUFBTCxDQUFVTixNQUFNTyxJQUFoQixFQUFzQixPQUF0QixDQUFqQixDQUFQO0FBQ0Q7QUFDRCxhQUFPUCxLQUFQO0FBQ0Q7O0FBRUQsYUFBU1EsNkJBQVQsQ0FBdUNDLFVBQXZDLEVBQW1EQyxJQUFuRCxFQUF5RDtBQUN2RCxZQUFNQywwQkFBMEIsQ0FBQyxRQUFELEVBQVcsT0FBWCxFQUFvQixTQUFwQixDQUFoQztBQUNBLFVBQUlBLHdCQUF3QkMsT0FBeEIsQ0FBZ0MsMEJBQVdILFVBQVgsRUFBdUJaLE9BQXZCLENBQWhDLE1BQXFFLENBQUMsQ0FBMUUsRUFBNkU7QUFDM0U7QUFDRDs7QUFFRCxZQUFNZ0IsaUJBQWlCLHVCQUFRSixVQUFSLEVBQW9CWixPQUFwQixDQUF2QjtBQUNBLFlBQU1pQixrQkFBa0JqQixRQUFRa0IsV0FBUixFQUF4Qjs7QUFFQSxVQUFJLENBQUNGLGNBQUQsSUFBbUIsQ0FBQ0MsZUFBeEIsRUFBeUM7QUFDdkM7QUFDRDs7QUFFRCxZQUFNRSxZQUFZbEIsaUJBQWlCZSxjQUFqQixDQUFsQjtBQUNBLFlBQU1JLGFBQWFuQixpQkFBaUJnQixlQUFqQixDQUFuQjs7QUFFQSxVQUFJRSxVQUFVWixHQUFWLElBQWlCYSxXQUFXYixHQUE1QixJQUFtQ1ksVUFBVVosR0FBVixDQUFjQyxJQUFkLEtBQXVCWSxXQUFXYixHQUFYLENBQWVDLElBQTdFLEVBQW1GO0FBQ2pGLGNBQU1hLGlCQUFpQixlQUFLQyxRQUFMLENBQWNWLFVBQWQsQ0FBdkI7QUFDQSxjQUFNVyxhQUFhLGVBQUtDLE9BQUwsQ0FBYUwsVUFBVVQsSUFBdkIsQ0FBbkI7QUFDQSxjQUFNZSxhQUFhLGVBQUtDLFFBQUwsQ0FBY0gsVUFBZCxFQUEwQlAsY0FBMUIsQ0FBbkI7QUFDQSxjQUFNVyxlQUFlLGVBQUtsQixJQUFMLENBQ25CVSxVQUFVWixHQUFWLENBQWNDLElBREssRUFFbkIsZUFBS2dCLE9BQUwsQ0FBYUMsVUFBYixDQUZtQixFQUduQkosbUJBQW1CLGVBQUtDLFFBQUwsQ0FBY0MsVUFBZCxDQUFuQixHQUErQyxFQUEvQyxHQUFvREYsY0FIakMsQ0FBckI7QUFLQXJCLGdCQUFRNEIsTUFBUixDQUFlO0FBQ2JmLGNBRGE7QUFFYmdCLG1CQUFTLDBEQUNOLFFBQU9GLFlBQWEsaUJBQWdCZixVQUFXO0FBSHJDLFNBQWY7QUFLRDtBQUNGOztBQUVELFdBQU87QUFDTGtCLHdCQUFrQmpCLElBQWxCLEVBQXdCO0FBQ3RCRixzQ0FBOEJFLEtBQUtrQixNQUFMLENBQVlDLEtBQTFDLEVBQWlEbkIsS0FBS2tCLE1BQXREO0FBQ0QsT0FISTtBQUlMRSxxQkFBZXBCLElBQWYsRUFBcUI7QUFDbkIsWUFBSSw2QkFBZ0JBLElBQWhCLENBQUosRUFBMkI7QUFBQSwrQ0FDQ0EsS0FBS3FCLFNBRE47O0FBQUEsZ0JBQ2pCQyxhQURpQjs7QUFFekJ4Qix3Q0FBOEJ3QixjQUFjSCxLQUE1QyxFQUFtREcsYUFBbkQ7QUFDRDtBQUNGO0FBVEksS0FBUDtBQVdEO0FBNURjLENBQWpCIiwiZmlsZSI6InJ1bGVzL25vLXJlbGF0aXZlLXBhY2thZ2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCByZWFkUGtnVXAgZnJvbSAncmVhZC1wa2ctdXAnXG5cbmltcG9ydCByZXNvbHZlIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcmVzb2x2ZSdcbmltcG9ydCBpbXBvcnRUeXBlIGZyb20gJy4uL2NvcmUvaW1wb3J0VHlwZSdcbmltcG9ydCBpc1N0YXRpY1JlcXVpcmUgZnJvbSAnLi4vY29yZS9zdGF0aWNSZXF1aXJlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIGRvY3M6IHt9LFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gbm9SZWxhdGl2ZVBhY2thZ2VzKGNvbnRleHQpIHtcblxuICAgIGZ1bmN0aW9uIGZpbmROYW1lZFBhY2thZ2UoZmlsZVBhdGgpIHtcbiAgICAgIGNvbnN0IGZvdW5kID0gcmVhZFBrZ1VwLnN5bmMoe2N3ZDogZmlsZVBhdGgsIG5vcm1hbGl6ZTogZmFsc2V9KVxuICAgICAgLy8gY29uc29sZS5sb2coZm91bmQpXG4gICAgICBpZiAoZm91bmQucGtnICYmICFmb3VuZC5wa2cubmFtZSkge1xuICAgICAgICByZXR1cm4gZmluZE5hbWVkUGFja2FnZShwYXRoLmpvaW4oZm91bmQucGF0aCwgJy4uLy4uJykpXG4gICAgICB9XG4gICAgICByZXR1cm4gZm91bmRcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja0ltcG9ydEZvclJlbGF0aXZlUGFja2FnZShpbXBvcnRQYXRoLCBub2RlKSB7XG4gICAgICBjb25zdCBwb3RlbnRpYWxWaW9sYXRpb25UeXBlcyA9IFsncGFyZW50JywgJ2luZGV4JywgJ3NpYmxpbmcnXVxuICAgICAgaWYgKHBvdGVudGlhbFZpb2xhdGlvblR5cGVzLmluZGV4T2YoaW1wb3J0VHlwZShpbXBvcnRQYXRoLCBjb250ZXh0KSkgPT09IC0xKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXNvbHZlZEltcG9ydCA9IHJlc29sdmUoaW1wb3J0UGF0aCwgY29udGV4dClcbiAgICAgIGNvbnN0IHJlc29sdmVkQ29udGV4dCA9IGNvbnRleHQuZ2V0RmlsZW5hbWUoKVxuXG4gICAgICBpZiAoIXJlc29sdmVkSW1wb3J0IHx8ICFyZXNvbHZlZENvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGltcG9ydFBrZyA9IGZpbmROYW1lZFBhY2thZ2UocmVzb2x2ZWRJbXBvcnQpXG4gICAgICBjb25zdCBjb250ZXh0UGtnID0gZmluZE5hbWVkUGFja2FnZShyZXNvbHZlZENvbnRleHQpXG5cbiAgICAgIGlmIChpbXBvcnRQa2cucGtnICYmIGNvbnRleHRQa2cucGtnICYmIGltcG9ydFBrZy5wa2cubmFtZSAhPT0gY29udGV4dFBrZy5wa2cubmFtZSkge1xuICAgICAgICBjb25zdCBpbXBvcnRCYXNlTmFtZSA9IHBhdGguYmFzZW5hbWUoaW1wb3J0UGF0aClcbiAgICAgICAgY29uc3QgaW1wb3J0Um9vdCA9IHBhdGguZGlybmFtZShpbXBvcnRQa2cucGF0aClcbiAgICAgICAgY29uc3QgcHJvcGVyUGF0aCA9IHBhdGgucmVsYXRpdmUoaW1wb3J0Um9vdCwgcmVzb2x2ZWRJbXBvcnQpXG4gICAgICAgIGNvbnN0IHByb3BlckltcG9ydCA9IHBhdGguam9pbihcbiAgICAgICAgICBpbXBvcnRQa2cucGtnLm5hbWUsIFxuICAgICAgICAgIHBhdGguZGlybmFtZShwcm9wZXJQYXRoKSxcbiAgICAgICAgICBpbXBvcnRCYXNlTmFtZSA9PT0gcGF0aC5iYXNlbmFtZShpbXBvcnRSb290KSA/ICcnIDogaW1wb3J0QmFzZU5hbWVcbiAgICAgICAgKVxuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBtZXNzYWdlOiAnUmVsYXRpdmUgaW1wb3J0IGZyb20gYW5vdGhlciBwYWNrYWdlIGlzIG5vdCBhbGxvd2VkLiAnICsgXG4gICAgICAgICAgICBgVXNlIFwiJHtwcm9wZXJJbXBvcnR9XCIgaW5zdGVhZCBvZiBcIiR7aW1wb3J0UGF0aH1cImAsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgY2hlY2tJbXBvcnRGb3JSZWxhdGl2ZVBhY2thZ2Uobm9kZS5zb3VyY2UudmFsdWUsIG5vZGUuc291cmNlKVxuICAgICAgfSxcbiAgICAgIENhbGxFeHByZXNzaW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKGlzU3RhdGljUmVxdWlyZShub2RlKSkge1xuICAgICAgICAgIGNvbnN0IFsgZmlyc3RBcmd1bWVudCBdID0gbm9kZS5hcmd1bWVudHNcbiAgICAgICAgICBjaGVja0ltcG9ydEZvclJlbGF0aXZlUGFja2FnZShmaXJzdEFyZ3VtZW50LnZhbHVlLCBmaXJzdEFyZ3VtZW50KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn1cbiJdfQ==