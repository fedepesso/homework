/* eslint-disable no-console */
/* eslint-disable indent */
const fs = require("fs")

const settings = {
  file_extension: ".tpl",
  templates_directory: "/templates/",
  block_regex: /-- [a-zA-Z0-9_]{1,64} --/g,
  partial_regex: /--\/ [a-zA-Z0-9_]{1,64} --/g
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

const render_template = function(template_name, data) {
    let raw = load_tpl(template_name)
    let final = substitute_partials(raw)
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