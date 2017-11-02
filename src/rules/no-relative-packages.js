import path from 'path'
import readPkgUp from 'read-pkg-up'

import resolve from 'eslint-module-utils/resolve'
import importType from '../core/importType'
import isStaticRequire from '../core/staticRequire'

module.exports = {
  meta: {
    docs: {},
  },

  create: function noRelativePackages(context) {

    function findNamedPackage(filePath) {
      const found = readPkgUp.sync({cwd: filePath, normalize: false})
      // console.log(found)
      if (found.pkg && !found.pkg.name) {
        return findNamedPackage(path.join(found.path, '../..'))
      }
      return found
    }

    function checkImportForRelativePackage(importPath, node) {
      const potentialViolationTypes = ['parent', 'index', 'sibling']
      if (potentialViolationTypes.indexOf(importType(importPath, context)) === -1) {
        return
      }

      const resolvedImport = resolve(importPath, context)
      const resolvedContext = context.getFilename()

      if (!resolvedImport || !resolvedContext) {
        return
      }

      const importPkg = findNamedPackage(resolvedImport)
      const contextPkg = findNamedPackage(resolvedContext)

      if (importPkg.pkg && contextPkg.pkg && importPkg.pkg.name !== contextPkg.pkg.name) {
        const importBaseName = path.basename(importPath)
        const properPath = path.relative(path.dirname(importPkg.path), resolvedImport)
        const properImport = path.join(
          importPkg.pkg.name, 
          path.dirname(properPath),
          importBaseName === importPkg.pkg.name ? '' : importBaseName
        )
        context.report({
          node,
          message: 'Relative import from another package is not allowed. ' + 
            `Use "${properImport}" instead of "${importPath}"`,
        })
      }
    }

    return {
      ImportDeclaration(node) {
        checkImportForRelativePackage(node.source.value, node.source)
      },
      CallExpression(node) {
        if (isStaticRequire(node)) {
          const [ firstArgument ] = node.arguments
          checkImportForRelativePackage(firstArgument.value, firstArgument)
        }
      },
    }
  },
}
