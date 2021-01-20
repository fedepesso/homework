const view = (content) => {
    return `<div style="margin-top: 8px; height:100%; padding: 8px; margin-left: 50px; margin-right: 50px;">${content}</div>`
}

module.exports.homepage = (data) => {
    const content = Object.keys(data).reduce((acc, index) => {
        acc +=  `<div style="border-style: solid; border-width: 2px; margin: 6px; padding: 0px 8px;"><h3>${data[index].title}</h3><p>${data[index].body}<br><a href="/posts/${data[index].id}">See post</a></p></div>`
        return acc
    }, "")
    return view("<h1>Homepage</h1>" + content)
}

module.exports.post_page = (post_data, comments) => {
    const content = Object.keys(comments).reduce((acc, index) => {
        acc +=  `<div style="border-style: solid; border-width: 1px; margin: 12px 40px; padding: 0px 8px;"><h3>${comments[index].name}</h3><p><i>${comments[index].email}</i></p><p>${comments[index].body}</p></div>`
        return acc
    }, `<div style="border-style: solid; border-width: 2px; margin: 6px; padding: 0px 8px;"><h3>${post_data.title}</h3><p>${post_data.body}<br><a href="/" style="padding-bottom: 9px;">Home</a></p></div>`)
    return view(content)
}