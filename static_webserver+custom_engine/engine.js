/* eslint-disable no-console */
/* eslint-disable indent */
const fs = require("fs")

const settings = {
  file_extension: ".tpl",
  templates_directory: "/templates/",
  block_regex: /-- [a-zA-Z0-9_]{1,64} --/g
}

const insert_value = function(original, block, new_data, index) {
    const first_segment = original.slice(0, index)
    const end_segment = original.slice(index + block.length)
    return first_segment + new_data + end_segment
}

const load_template = function(template_name, data) {
    let raw = fs.readFileSync(__dirname + settings.templates_directory + template_name + settings.file_extension).toString()
    while (true) {
        const blocks = [...raw.matchAll(settings.block_regex)]
        console.log(blocks)
        if (blocks.length === 0) {
            return Buffer.from(raw)
        }
        const val = blocks[0]
        const new_val = data[val[0].slice(3, -3)]
        if (new_val === undefined) { 
            return null 
        }
        raw = insert_value(raw, val[0], new_val, val.index)
    }
}

module.exports.load_template = load_template