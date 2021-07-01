module.exports = {
  root: true,
  extends: '',
  parser: 'babel-eslint',
  rules: {
    // semi: ['error', 'never'],
  },
  settings: {
    "import/resolver": {
      "babel-plugin-root-import": {
        "rootPathPrefix": "~",
        "rootPathSuffix": "src"
      }
    }
  }
}
