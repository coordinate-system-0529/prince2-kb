/**
 * PRINCE2 知识库 - 浮动章节导航
 * 在每个章节页面右侧显示一个浮动的章节目录面板
 * 自动高亮当前阅读的小节，支持点击跳转
 */
(function() {
    // 收集所有 h2/h3 标题
    var headings = document.querySelectorAll('h2.section-heading, h3.section-heading');
    if (headings.length < 2) return; // 标题太少不需要导航

    // 创建浮动面板
    var panel = document.createElement('div');
    panel.id = 'floating-toc';
    panel.innerHTML = `
        <div class="ftoc-header" onclick="document.getElementById('ftoc-list').classList.toggle('ftoc-collapsed'); this.querySelector('.ftoc-arrow').classList.toggle('ftoc-open');">
            <span class="ftoc-arrow">▸</span> 本章目录
        </div>
        <div class="ftoc-list" id="ftoc-list"></div>
        <div class="ftoc-toggle" onclick="document.getElementById('floating-toc').classList.toggle('ftoc-minimized'); this.textContent = this.textContent === '◀' ? '▶' : '◀';">▶</div>
    `;

    // 样式
    var style = document.createElement('style');
    style.textContent = `
        #floating-toc {
            position: fixed;
            right: 16px;
            top: 80px;
            width: 220px;
            max-height: calc(100vh - 120px);
            background: #2c1810;
            border: 1px solid #5c3d1a;
            border-radius: 6px;
            z-index: 100;
            font-family: "Noto Serif SC", serif;
            font-size: 0.8em;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
        }
        #floating-toc.ftoc-minimized {
            transform: translateX(calc(100% - 32px));
        }
        .ftoc-header {
            padding: 10px 14px;
            color: #d4af37;
            font-weight: bold;
            cursor: pointer;
            border-bottom: 1px solid #3a2515;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .ftoc-header:hover { background: #3a2515; }
        .ftoc-arrow {
            font-size: 0.7em;
            transition: transform 0.2s;
            color: #8B7355;
        }
        .ftoc-arrow.ftoc-open { transform: rotate(90deg); }
        .ftoc-list {
            overflow-y: auto;
            max-height: calc(100vh - 200px);
            padding: 6px 0;
            transition: max-height 0.3s ease;
        }
        .ftoc-list.ftoc-collapsed {
            max-height: 0;
            padding: 0;
            overflow: hidden;
        }
        .ftoc-item {
            display: block;
            padding: 5px 14px;
            color: #c4a882;
            text-decoration: none;
            border-left: 3px solid transparent;
            transition: all 0.15s;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .ftoc-item:hover {
            background: #3a2515;
            color: #d4af37;
            border-left-color: #d4af37;
        }
        .ftoc-item.ftoc-active {
            color: #d4af37;
            border-left-color: #d4af37;
            background: #3a2515;
            font-weight: bold;
        }
        .ftoc-item.ftoc-h3 {
            padding-left: 28px;
            font-size: 0.92em;
        }
        .ftoc-toggle {
            position: absolute;
            left: -28px;
            top: 50%;
            transform: translateY(-50%);
            background: #2c1810;
            border: 1px solid #5c3d1a;
            border-right: none;
            color: #d4af37;
            width: 28px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 4px 0 0 4px;
            font-size: 0.8em;
        }
        .ftoc-toggle:hover { background: #3a2515; }
        @media (max-width: 1200px) {
            #floating-toc { display: none; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(panel);

    // 填充目录项
    var list = document.getElementById('ftoc-list');
    headings.forEach(function(h, i) {
        var id = h.id || ('heading-' + i);
        h.id = id;

        var a = document.createElement('a');
        a.className = 'ftoc-item' + (h.tagName === 'H3' ? ' ftoc-h3' : '');
        a.href = '#' + id;
        a.textContent = h.textContent.replace(/^[§¶]\s*/, '');
        a.setAttribute('data-target', id);
        a.onclick = function(e) {
            e.preventDefault();
            document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        list.appendChild(a);
    });

    // 滚动高亮
    var items = list.querySelectorAll('.ftoc-item');
    var ticking = false;

    function updateActive() {
        var scrollPos = window.scrollY + 100;
        var current = null;

        headings.forEach(function(h) {
            if (h.offsetTop <= scrollPos) {
                current = h.id;
            }
        });

        items.forEach(function(item) {
            if (item.getAttribute('data-target') === current) {
                item.classList.add('ftoc-active');
            } else {
                item.classList.remove('ftoc-active');
            }
        });

        // 确保高亮项可见
        var activeItem = list.querySelector('.ftoc-active');
        if (activeItem) {
            activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }

        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateActive);
            ticking = true;
        }
    });

    // 初始高亮
    updateActive();
})();
