# -*- coding: utf-8 -*-
"""
清理 graph-full.html 重排后失效的死 JS：positionAuthEvents + positionCorridor
（它们引用已删除的 auth-connector / corridor DOM，有 null 守卫所以是 no-op）。
保留 theme 脚本与 toggleDetail。默认 dry-run；加 --apply 落地。
"""
import sys, io
sys.stdout.reconfigure(encoding='utf-8')

HTML = r"D:\5月份cc项目\prince2-开发\prince2-kb-develop\graph-full.html"
SEG_START = '/* 将授权事件盒子精确对齐到目标流程节点列 */'
SEG_END = "window.addEventListener('resize', positionCorridor);"

def main():
    apply = '--apply' in sys.argv
    with io.open(HTML, 'r', encoding='utf-8') as f:
        content = f.read()

    if content.count(SEG_START) != 1:
        print('ERROR: SEG_START 命中数 =', content.count(SEG_START)); return
    if content.count(SEG_END) != 1:
        print('ERROR: SEG_END 命中数 =', content.count(SEG_END)); return

    si = content.find(SEG_START)
    ei = content.find(SEG_END) + len(SEG_END)
    seg = content[si:ei]
    print('将删除死 JS 段：', seg.count(chr(10)) + 1, '行,', len(seg), '字符')
    print('段首:', repr(seg[:60]))
    print('段尾:', repr(seg[-60:]))

    # 删除并压平多余空行
    new_content = content[:si].rstrip() + '\n\n' + content[ei:].lstrip()

    # 安全校验：toggleDetail 与 theme 脚本必须仍在
    for must in ['function toggleDetail', "localStorage.getItem('prince2-theme')",
                 'var currentOpen = null;']:
        if must not in new_content:
            print('ERROR: 误删了必须保留的', repr(must)); return
    # 死函数应已消失
    for gone in ['function positionAuthEvents', 'function positionCorridor']:
        if gone in new_content:
            print('ERROR: 仍残留', repr(gone)); return
    if '�' in new_content:
        print('ERROR: 检测到 U+FFFD 乱码'); return

    if apply:
        with io.open(HTML, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('=== 已写回 ===  新长度:', len(new_content))
    else:
        print('=== DRY-RUN（加 --apply 落地）===')

if __name__ == '__main__':
    main()
