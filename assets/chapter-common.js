/* PRINCE2 知识库 - 章节页公共脚本 */
/* 包含：配色加载/持久化、章节目录折叠、Purple Numbers 点击复制 */

document.addEventListener('DOMContentLoaded', function () {

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
