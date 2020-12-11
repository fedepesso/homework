const fs = require("fs")

const settings = {
  file_extension: ".tpl",
  templates_directory: "/templates/",
  block_regex: /-- [a-zA-Z0-9_]{1,64} --/g
}

const load_template = function(template_name, data) {
  let raw = fs.readFileSync(__dirname + settings.templates_directory + template_name + settings.file_extension).toString()
  const blocks = [...raw.matchAll(settings.block_regex)]
  blocks.forEach(val => {
  })
  return Buffer.from(raw)
}

module.exports.load_template = load_template