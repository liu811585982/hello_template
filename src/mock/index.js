/**
 * 引入mock
 */
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./src', false, /\.js$/)
requireAll(req)
