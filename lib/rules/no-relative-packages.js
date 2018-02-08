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
    const options = context.options[0];

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
            if (options.fixable) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL25vLXJlbGF0aXZlLXBhY2thZ2VzLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsImZpeGFibGUiLCJzY2hlbWEiLCJjcmVhdGUiLCJub1JlbGF0aXZlUGFja2FnZXMiLCJjb250ZXh0Iiwib3B0aW9ucyIsImZpbmROYW1lZFBhY2thZ2UiLCJmaWxlUGF0aCIsImZvdW5kIiwic3luYyIsImN3ZCIsIm5vcm1hbGl6ZSIsInBrZyIsIm5hbWUiLCJqb2luIiwicGF0aCIsImNoZWNrSW1wb3J0Rm9yUmVsYXRpdmVQYWNrYWdlIiwiaW1wb3J0UGF0aCIsIm5vZGUiLCJwb3RlbnRpYWxWaW9sYXRpb25UeXBlcyIsImluZGV4T2YiLCJyZXNvbHZlZEltcG9ydCIsInJlc29sdmVkQ29udGV4dCIsImdldEZpbGVuYW1lIiwiaW1wb3J0UGtnIiwiY29udGV4dFBrZyIsImltcG9ydEJhc2VOYW1lIiwiYmFzZW5hbWUiLCJpbXBvcnRSb290IiwiZGlybmFtZSIsInByb3BlclBhdGgiLCJyZWxhdGl2ZSIsInByb3BlckltcG9ydCIsInJlcG9ydCIsIm1lc3NhZ2UiLCJmaXgiLCJmaXhlciIsInJlcGxhY2VUZXh0IiwiSW1wb3J0RGVjbGFyYXRpb24iLCJzb3VyY2UiLCJ2YWx1ZSIsIkNhbGxFeHByZXNzaW9uIiwiYXJndW1lbnRzIiwiZmlyc3RBcmd1bWVudCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxFQURGO0FBRUpDLGFBQVMsTUFGTDtBQUdKQyxZQUFRLENBQ047QUFDRSxjQUFRLFFBRFY7QUFFRSxvQkFBYztBQUNaLG1CQUFXLEVBQUUsUUFBUSxTQUFWO0FBREMsT0FGaEI7QUFLRSw4QkFBd0I7QUFMMUIsS0FETTtBQUhKLEdBRFM7O0FBZWZDLFVBQVEsU0FBU0Msa0JBQVQsQ0FBNEJDLE9BQTVCLEVBQXFDO0FBQzNDLFVBQU1DLFVBQVVELFFBQVFDLE9BQVIsQ0FBZ0IsQ0FBaEIsQ0FBaEI7O0FBRUEsYUFBU0MsZ0JBQVQsQ0FBMEJDLFFBQTFCLEVBQW9DO0FBQ2xDLFlBQU1DLFFBQVEsb0JBQVVDLElBQVYsQ0FBZSxFQUFDQyxLQUFLSCxRQUFOLEVBQWdCSSxXQUFXLEtBQTNCLEVBQWYsQ0FBZDs7QUFFQSxVQUFJSCxNQUFNSSxHQUFOLElBQWEsQ0FBQ0osTUFBTUksR0FBTixDQUFVQyxJQUE1QixFQUFrQztBQUNoQyxlQUFPUCxpQkFBaUIsZUFBS1EsSUFBTCxDQUFVTixNQUFNTyxJQUFoQixFQUFzQixPQUF0QixDQUFqQixDQUFQO0FBQ0Q7QUFDRCxhQUFPUCxLQUFQO0FBQ0Q7O0FBRUQsYUFBU1EsNkJBQVQsQ0FBdUNDLFVBQXZDLEVBQW1EQyxJQUFuRCxFQUF5RDtBQUN2RCxZQUFNQywwQkFBMEIsQ0FBQyxRQUFELEVBQVcsT0FBWCxFQUFvQixTQUFwQixDQUFoQztBQUNBLFVBQUlBLHdCQUF3QkMsT0FBeEIsQ0FBZ0MsMEJBQVdILFVBQVgsRUFBdUJiLE9BQXZCLENBQWhDLE1BQXFFLENBQUMsQ0FBMUUsRUFBNkU7QUFDM0U7QUFDRDs7QUFFRCxZQUFNaUIsaUJBQWlCLHVCQUFRSixVQUFSLEVBQW9CYixPQUFwQixDQUF2QjtBQUNBLFlBQU1rQixrQkFBa0JsQixRQUFRbUIsV0FBUixFQUF4Qjs7QUFFQSxVQUFJLENBQUNGLGNBQUQsSUFBbUIsQ0FBQ0MsZUFBeEIsRUFBeUM7QUFDdkM7QUFDRDs7QUFFRCxZQUFNRSxZQUFZbEIsaUJBQWlCZSxjQUFqQixDQUFsQjtBQUNBLFlBQU1JLGFBQWFuQixpQkFBaUJnQixlQUFqQixDQUFuQjs7QUFFQSxVQUFJRSxVQUFVWixHQUFWLElBQWlCYSxXQUFXYixHQUE1QixJQUFtQ1ksVUFBVVosR0FBVixDQUFjQyxJQUFkLEtBQXVCWSxXQUFXYixHQUFYLENBQWVDLElBQTdFLEVBQW1GO0FBQ2pGLGNBQU1hLGlCQUFpQixlQUFLQyxRQUFMLENBQWNWLFVBQWQsQ0FBdkI7QUFDQSxjQUFNVyxhQUFhLGVBQUtDLE9BQUwsQ0FBYUwsVUFBVVQsSUFBdkIsQ0FBbkI7QUFDQSxjQUFNZSxhQUFhLGVBQUtDLFFBQUwsQ0FBY0gsVUFBZCxFQUEwQlAsY0FBMUIsQ0FBbkI7QUFDQSxjQUFNVyxlQUFlLGVBQUtsQixJQUFMLENBQ25CVSxVQUFVWixHQUFWLENBQWNDLElBREssRUFFbkIsZUFBS2dCLE9BQUwsQ0FBYUMsVUFBYixDQUZtQixFQUduQkosbUJBQW1CLGVBQUtDLFFBQUwsQ0FBY0MsVUFBZCxDQUFuQixHQUErQyxFQUEvQyxHQUFvREYsY0FIakMsQ0FBckI7QUFLQXRCLGdCQUFRNkIsTUFBUixDQUFlO0FBQ2JmLGNBRGE7QUFFYmdCLG1CQUFTLDBEQUNOLFFBQU9GLFlBQWEsaUJBQWdCZixVQUFXLEdBSHJDO0FBSWJrQixjQUFJQyxLQUFKLEVBQVc7QUFDVCxnQkFBSS9CLFFBQVFMLE9BQVosRUFBcUI7QUFDbkIscUJBQU9vQyxNQUFNQyxXQUFOLENBQWtCbkIsSUFBbEIsRUFBeUIsSUFBR2MsWUFBYSxHQUF6QyxDQUFQO0FBQ0Q7QUFDRjtBQVJZLFNBQWY7QUFVRDtBQUNGOztBQUVELFdBQU87QUFDTE0sd0JBQWtCcEIsSUFBbEIsRUFBd0I7QUFDdEJGLHNDQUE4QkUsS0FBS3FCLE1BQUwsQ0FBWUMsS0FBMUMsRUFBaUR0QixLQUFLcUIsTUFBdEQ7QUFDRCxPQUhJO0FBSUxFLHFCQUFldkIsSUFBZixFQUFxQjtBQUNuQixZQUFJLDZCQUFnQkEsSUFBaEIsQ0FBSixFQUEyQjtBQUFBLCtDQUNDQSxLQUFLd0IsU0FETjs7QUFBQSxnQkFDakJDLGFBRGlCOztBQUV6QjNCLHdDQUE4QjJCLGNBQWNILEtBQTVDLEVBQW1ERyxhQUFuRDtBQUNEO0FBQ0Y7QUFUSSxLQUFQO0FBV0Q7QUE1RWMsQ0FBakIiLCJmaWxlIjoicnVsZXMvbm8tcmVsYXRpdmUtcGFja2FnZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHJlYWRQa2dVcCBmcm9tICdyZWFkLXBrZy11cCdcblxuaW1wb3J0IHJlc29sdmUgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZXNvbHZlJ1xuaW1wb3J0IGltcG9ydFR5cGUgZnJvbSAnLi4vY29yZS9pbXBvcnRUeXBlJ1xuaW1wb3J0IGlzU3RhdGljUmVxdWlyZSBmcm9tICcuLi9jb3JlL3N0YXRpY1JlcXVpcmUnXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgZG9jczoge30sXG4gICAgZml4YWJsZTogJ2NvZGUnLFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICAndHlwZSc6ICdvYmplY3QnLFxuICAgICAgICAncHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnZml4YWJsZSc6IHsgJ3R5cGUnOiAnYm9vbGVhbicgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJzogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiBub1JlbGF0aXZlUGFja2FnZXMoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF1cblxuICAgIGZ1bmN0aW9uIGZpbmROYW1lZFBhY2thZ2UoZmlsZVBhdGgpIHtcbiAgICAgIGNvbnN0IGZvdW5kID0gcmVhZFBrZ1VwLnN5bmMoe2N3ZDogZmlsZVBhdGgsIG5vcm1hbGl6ZTogZmFsc2V9KVxuXG4gICAgICBpZiAoZm91bmQucGtnICYmICFmb3VuZC5wa2cubmFtZSkge1xuICAgICAgICByZXR1cm4gZmluZE5hbWVkUGFja2FnZShwYXRoLmpvaW4oZm91bmQucGF0aCwgJy4uLy4uJykpXG4gICAgICB9XG4gICAgICByZXR1cm4gZm91bmRcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja0ltcG9ydEZvclJlbGF0aXZlUGFja2FnZShpbXBvcnRQYXRoLCBub2RlKSB7XG4gICAgICBjb25zdCBwb3RlbnRpYWxWaW9sYXRpb25UeXBlcyA9IFsncGFyZW50JywgJ2luZGV4JywgJ3NpYmxpbmcnXVxuICAgICAgaWYgKHBvdGVudGlhbFZpb2xhdGlvblR5cGVzLmluZGV4T2YoaW1wb3J0VHlwZShpbXBvcnRQYXRoLCBjb250ZXh0KSkgPT09IC0xKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXNvbHZlZEltcG9ydCA9IHJlc29sdmUoaW1wb3J0UGF0aCwgY29udGV4dClcbiAgICAgIGNvbnN0IHJlc29sdmVkQ29udGV4dCA9IGNvbnRleHQuZ2V0RmlsZW5hbWUoKVxuXG4gICAgICBpZiAoIXJlc29sdmVkSW1wb3J0IHx8ICFyZXNvbHZlZENvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGltcG9ydFBrZyA9IGZpbmROYW1lZFBhY2thZ2UocmVzb2x2ZWRJbXBvcnQpXG4gICAgICBjb25zdCBjb250ZXh0UGtnID0gZmluZE5hbWVkUGFja2FnZShyZXNvbHZlZENvbnRleHQpXG5cbiAgICAgIGlmIChpbXBvcnRQa2cucGtnICYmIGNvbnRleHRQa2cucGtnICYmIGltcG9ydFBrZy5wa2cubmFtZSAhPT0gY29udGV4dFBrZy5wa2cubmFtZSkge1xuICAgICAgICBjb25zdCBpbXBvcnRCYXNlTmFtZSA9IHBhdGguYmFzZW5hbWUoaW1wb3J0UGF0aClcbiAgICAgICAgY29uc3QgaW1wb3J0Um9vdCA9IHBhdGguZGlybmFtZShpbXBvcnRQa2cucGF0aClcbiAgICAgICAgY29uc3QgcHJvcGVyUGF0aCA9IHBhdGgucmVsYXRpdmUoaW1wb3J0Um9vdCwgcmVzb2x2ZWRJbXBvcnQpXG4gICAgICAgIGNvbnN0IHByb3BlckltcG9ydCA9IHBhdGguam9pbihcbiAgICAgICAgICBpbXBvcnRQa2cucGtnLm5hbWUsXG4gICAgICAgICAgcGF0aC5kaXJuYW1lKHByb3BlclBhdGgpLFxuICAgICAgICAgIGltcG9ydEJhc2VOYW1lID09PSBwYXRoLmJhc2VuYW1lKGltcG9ydFJvb3QpID8gJycgOiBpbXBvcnRCYXNlTmFtZVxuICAgICAgICApXG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG1lc3NhZ2U6ICdSZWxhdGl2ZSBpbXBvcnQgZnJvbSBhbm90aGVyIHBhY2thZ2UgaXMgbm90IGFsbG93ZWQuICcgK1xuICAgICAgICAgICAgYFVzZSBcIiR7cHJvcGVySW1wb3J0fVwiIGluc3RlYWQgb2YgXCIke2ltcG9ydFBhdGh9XCJgLFxuICAgICAgICAgIGZpeChmaXhlcikge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZml4YWJsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gZml4ZXIucmVwbGFjZVRleHQobm9kZSwgYCcke3Byb3BlckltcG9ydH0nYClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCAgXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgY2hlY2tJbXBvcnRGb3JSZWxhdGl2ZVBhY2thZ2Uobm9kZS5zb3VyY2UudmFsdWUsIG5vZGUuc291cmNlKVxuICAgICAgfSxcbiAgICAgIENhbGxFeHByZXNzaW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKGlzU3RhdGljUmVxdWlyZShub2RlKSkge1xuICAgICAgICAgIGNvbnN0IFsgZmlyc3RBcmd1bWVudCBdID0gbm9kZS5hcmd1bWVudHNcbiAgICAgICAgICBjaGVja0ltcG9ydEZvclJlbGF0aXZlUGFja2FnZShmaXJzdEFyZ3VtZW50LnZhbHVlLCBmaXJzdEFyZ3VtZW50KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn1cbiJdfQ==