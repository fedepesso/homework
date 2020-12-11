const fs = require("fs")

let settings = {
  file_extension: "",
  templates_directory: "",
  block_regex: /-- [a-zA-Z0-9_]{1,64} --/g,
  partial_regex: /--\/ [a-zA-Z0-9_]{1,64} --/g,
  helpers_regex: /--# [a-zA-Z0-9_ ]{1,64} --/g
}

let helpers_callbacks = {
  //
}

const add_helpers = function(obj) {
  helpers_callbacks = Object.assign({}, helpers_callbacks, obj)
}

const modify_settings = function(obj) {
  settings = Object.assign({}, settings, obj)
}

const load_tpl = function(template_name) {
  return fs.readFileSync(__dirname + settings.templates_directory + template_name + settings.file_extension).toString()
}

const insert_value = function(original, block, new_data, index) {
  const first_segment = original.slice(0, index)
  const end_segment = original.slice(index + block.length)
  return first_segment + new_data + end_segment
}

const substitute_partials = function(raw_string) {
  while (true) {
    const partials = [...raw_string.matchAll(settings.partial_regex)]
    if (partials.length === 0) {
      return raw_string
    }
    const actual = partials[0]
    const raw_content = load_tpl(actual[0].slice(4, -3))
    const content = substitute_partials(raw_content)
    raw_string = insert_value(raw_string, actual[0], content, actual.index)
  }
}

const execute_helpers = function(raw_string, data) {
  while(true) {
    const helpers = [...raw_string.matchAll(settings.helpers_regex)]
    if (helpers.length === 0) {
      return raw_string
    }
    const actual = helpers[0]
    const string_fragments = actual[0].slice(4, -3).split(" ")
    const signature = string_fragments.slice(1).map(val => data[val])
    raw_string = insert_value(raw_string, actual[0], helpers_callbacks[string_fragments[0]](...signature), actual.index)
  }
}

const render_template = function(template_name, data) {
  let raw = load_tpl(template_name)
  let final = execute_helpers(substitute_partials(raw), data)
  while (true) {
    const blocks = [...final.matchAll(settings.block_regex)]
    if (blocks.length === 0) {
      return Buffer.from(final)
    }
    const val = blocks[0]
    const new_val = data[val[0].slice(3, -3)]
    final = insert_value(final, val[0], new_val, val.index)
  }
}

module.exports.render_template = render_template
module.exports.add_helpers = add_helpers
module.exports.modify_settings = modify_settings