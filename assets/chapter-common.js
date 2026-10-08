/* PRINCE2 知识库 - 章节页公共脚本 */
/* 包含：配色加载/持久化、章节目录折叠、Purple Numbers 点击复制 */

document.addEventListener('DOMContentLoaded', function () {

    /* 宽表在内部滚动，短表头保持完整，不改变原文与锚点。 */
    document.querySelectorAll('table').forEach(function (table) {
        if (table.closest('.chapter-table-scroll')) return;
        var wrapper = document.createElement('div');
        wrapper.className = 'chapter-table-scroll';
        wrapper.tabIndex = 0;
        wrapper.setAttribute('role', 'region');
        wrapper.setAttribute('aria-label', '原文表格，可横向滚动');
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
        table.querySelectorAll('th').forEach(function (cell) {
            if (cell.textContent.trim().length <= 24) cell.classList.add('compact-table-label');
        });
    });

    /* -- 配色方案加载/持久化（与 index.html 同步） -- */
    (function () {
        var theme = localStorage.getItem('prince2-theme');
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }
    })();

    /* -- 章节目录折叠 -- */
    window.toggleToc = function () {
        var list = document.getElementById('tocList');
        var icon = document.querySelector('.toc-icon');
        if (!list || !icon) return;
        list.classList.toggle('collapsed');
        icon.style.transform = list.classList.contains('collapsed')
            ? 'rotate(0deg)' : 'rotate(90deg)';
    };

    /* -- Purple Numbers: 点击复制精确链接 -- */
    document.querySelectorAll('.pn-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var url = window.location.href.split('#')[0] + link.getAttribute('href');
            navigator.clipboard.writeText(url).then(function () {
                link.style.color = '#2E8B57';
                setTimeout(function () { link.style.color = ''; }, 1000);
            });
        });
    });

});
