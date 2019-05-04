function formatBbc(item) {
    let i = item['id']
    let name = item['name']
    return `[sc=q i${i}][sc][item=${name}]${name}[sc][inventory=${name}][/sc][/sc][/sc]`
}

function formatCss(item) {
    let i = item['id']
    let name = item['name']
    return `.q.i${i}{max-height:[inventory=${name}];max-width:[inventory=${name}]}`
}

async function main() {
    let res = await fetch('items.json')
    let all_items = await res.json()

    let res2 = await fetch('./template.txt')
    let template = await res2.text()

    var ractive = new Ractive({
        el: '#target',
        template: '#template',
        data: {
            selected: null,
            selected_items: null,
            selected_template: null,
            categories: Object.keys(all_items)
        }
    })

    ractive.on('select', (ctx,name) => {
        // update selection
        let prev = document.querySelector('li.selected')
        if (prev) {
            prev.classList.toggle('selected')
        }
        ctx.node.classList.toggle('selected')
        ractive.set('selected', name)

        //render template
        let items = all_items[name]
        let cat_template = template
            .replace('TITLE', name)
            .replace('MAPPED_ITEMS', items.map(formatBbc).join(''))
            .replace('MAPPED_CSS', items.map(formatCss).join(''))
        ractive.set('selected_template', cat_template)
        })
}

document.addEventListener('DOMContentLoaded', () => {
    main()
})