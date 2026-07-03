# -*- coding: utf-8 -*-
"""
重排 graph-full.html 管理层，贴合官方图 12.2。
用稳定文本锚点定位 [DP↔管理层连接器 ... corridor 上行箭头] 整段，替换为：
新管理层（SU→IP / SB·CP / 触发框 / CS / MP）+ 简化 CS↔MP 信息流带 + 居中交付层。
默认 dry-run；加 --apply 才写回。
"""
import sys, io

sys.stdout.reconfigure(encoding='utf-8')

HTML = r"D:\5月份cc项目\prince2-开发\prince2-kb-develop\graph-full.html"

START = '    <!-- DP↔管理层 连接器'
END = '    <div class="corridor-arrow corridor-arrow-up" id="corr-up-arrow"></div>'

NEW_BLOCK = '''    <!-- ③管理层（重排贴合官方图 12.2：SU→IP / SB·CP / 触发 / CS / MP）-->
    <div class="layer-section layer--managing">
        <div class="layer-label">管理</div>
        <div class="layer-body">
            <div class="mlayer">

                <!-- 行1：SU → IP -->
                <div class="mrow mrow-top">
                    <div class="proc-col">
                        <div class="proc-events">
                            <span class="ev ev-up"><span class="ev-route">SU → DP</span><span>项目启动请求</span></span>
                        </div>
                        <div class="proc-node" id="node-su" onclick="toggleDetail('su')">
                            <div class="proc-header">
                                <span class="proc-abbr">SU</span>
                                <div class="proc-title">
                                    <h3>项目准备</h3>
                                    <div class="proc-role">项目经理 · 项目发起人</div>
                                </div>
                            </div>
                            <div class="proc-products">
                                <a class="mgmt-product mp-plan" href="entities/product.html">项目概述文件</a>
                                <a class="mgmt-product mp-register" href="entities/product.html">日志</a>
                                <a class="mgmt-product mp-register" href="entities/product.html">风险登记单</a>
                                <a class="mgmt-product mp-register" href="entities/product.html">问题登记单</a>
                                <a class="mgmt-product mp-register" href="entities/product.html">经验教训记录单</a>
                            </div>
                        </div>
                    </div>

                    <div class="flow-arrow">→</div>

                    <div class="proc-col">
                        <div class="proc-events">
                            <span class="ev ev-up"><span class="ev-route">IP → DP</span><span>项目授权请求·PID</span></span>
                            <span class="ev ev-down"><span class="ev-route">DP → IP</span><span>已授权项目启动</span></span>
                        </div>
                        <div class="proc-node" id="node-ip" onclick="toggleDetail('ip')">
                            <div class="proc-header">
                                <span class="proc-abbr">IP</span>
                                <div class="proc-title">
                                    <h3>项目启动</h3>
                                    <div class="proc-role">项目经理 · 项目保证</div>
                                </div>
                            </div>
                            <div class="proc-products">
                                <a class="mgmt-product mp-plan" href="entities/product.html">项目启动文件</a>
                                <a class="mgmt-product mp-plan" href="entities/product.html">项目计划</a>
                                <a class="mgmt-product mp-plan" href="entities/product.html">项目产品描述</a>
                                <a class="mgmt-product mp-approach" href="entities/product.html">质量管理方法</a>
                                <a class="mgmt-product mp-approach" href="entities/product.html">风险管理方法</a>
                                <a class="mgmt-product mp-approach" href="entities/product.html">沟通管理方法</a>
                                <a class="mgmt-product mp-approach" href="entities/product.html">收益管理方法</a>
                                <a class="mgmt-product mp-approach" href="entities/product.html">可持续性管理方法</a>
                                <a class="mgmt-product mp-approach" href="entities/product.html">问题管理方法</a>
                                <a class="mgmt-product mp-register" href="entities/product.html">质量登记单</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 行2：SB · CP -->
                <div class="mrow mrow-mid">
                    <div class="proc-col">
                        <div class="proc-events">
                            <span class="ev ev-up"><span class="ev-route">SB → DP</span><span>下一阶段请求</span></span>
                            <span class="ev ev-up"><span class="ev-route">SB → DP · 例外</span><span>例外计划批准请求</span></span>
                        </div>
                        <div class="proc-node" id="node-sb" onclick="toggleDetail('sb')">
                            <div class="proc-header">
                                <span class="proc-abbr">SB</span>
                                <div class="proc-title">
                                    <h3>阶段边界管理</h3>
                                    <div class="proc-role">项目经理 · 项目保证</div>
                                </div>
                            </div>
                            <div class="proc-products">
                                <a class="mgmt-product mp-plan" href="entities/product.html">阶段计划</a>
                                <a class="mgmt-product mp-plan" href="entities/product.html">阶段竣工报告</a>
                                <a class="mgmt-product mp-plan" href="entities/product.html">例外计划</a>
                            </div>
                        </div>
                    </div>

                    <div class="proc-col">
                        <div class="proc-events">
                            <span class="ev ev-up"><span class="ev-route">CP → DP</span><span>项目收尾建议</span></span>
                            <span class="ev ev-down"><span class="ev-route">DP → CP · 例外</span><span>提前收尾通知</span></span>
                        </div>
                        <div class="proc-node" id="node-cp" onclick="toggleDetail('cp')">
                            <div class="proc-header">
                                <span class="proc-abbr">CP</span>
                                <div class="proc-title">
                                    <h3>项目收尾</h3>
                                    <div class="proc-role">项目经理 · 项目发起人</div>
                                </div>
                            </div>
                            <div class="proc-products">
                                <a class="mgmt-product mp-plan" href="entities/product.html">项目竣工报告</a>
                                <a class="mgmt-product mp-plan" href="entities/product.html">项目收尾建议</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 行3：触发框（CS 触发 → SB / CP，↑ 指向上方流程）-->
                <div class="mrow trigger-row">
                    <div class="trigger-box">
                        <span class="trigger-arrow">↑</span>
                        <span class="trigger-tag"><span class="tg-name">阶段边界临近</span><span class="tg-route">CS 触发 → SB</span></span>
                    </div>
                    <div class="trigger-box">
                        <span class="trigger-arrow">↑</span>
                        <span class="trigger-tag"><span class="tg-name">项目竣工临近</span><span class="tg-route">CS 触发 → CP</span></span>
                    </div>
                </div>

                <!-- 行4：CS 阶段控制（居中，DP 连接 + 新问题/风险输入）-->
                <div class="mrow mrow-cs">
                    <div class="proc-col cs-col">
                        <div class="proc-events">
                            <span class="ev ev-up"><span class="ev-route">CS → DP</span><span>要点报告</span></span>
                            <span class="ev ev-up"><span class="ev-route">CS → DP · 例外</span><span>例外报告</span></span>
                            <span class="ev ev-down"><span class="ev-route">DP → CS · 首次</span><span>已授权项目</span></span>
                            <span class="ev ev-down"><span class="ev-route">DP → CS · 每阶段</span><span>已授权阶段</span></span>
                            <span class="ev ev-down"><span class="ev-route">DP → CS · 例外</span><span>例外计划批准</span></span>
                        </div>
                        <div class="cs-with-input">
                            <div class="proc-node" id="node-cs" onclick="toggleDetail('cs')">
                                <div class="proc-header">
                                    <span class="proc-abbr">CS</span>
                                    <div class="proc-title">
                                        <h3>阶段控制</h3>
                                        <div class="proc-role">项目经理</div>
                                    </div>
                                </div>
                                <div class="proc-products">
                                    <a class="mgmt-product mp-plan" href="entities/product.html">工作包描述</a>
                                    <a class="mgmt-product mp-plan" href="entities/product.html">要点报告</a>
                                    <a class="mgmt-product mp-plan" href="entities/product.html">例外报告</a>
                                    <a class="mgmt-product mp-plan" href="entities/product.html">问题报告</a>
                                    <a class="mgmt-product mp-register" href="entities/product.html">产品登记单</a>
                                </div>
                            </div>
                            <span class="cs-input-tag">← 新问题 / 风险</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- 管理 ↔ 交付 信息流带 (CS ↔ MP) -->
    <div class="info-band cs-mp-band">
        <div class="cs-mp-col">
            <div class="cs-mp-wrap">
                <span class="auth-v-arrow">↓</span>
                <span class="band-item down band-2line"><span class="band-route">CS → MP</span><span class="band-name">工作包描述</span></span>
                <span class="auth-v-arrow">↓</span>
            </div>
            <div class="cs-mp-wrap">
                <span class="auth-v-arrow">↑</span>
                <span class="band-item bi band-2line"><span class="band-route">MP → CS</span><span class="band-name">检查点报告</span></span>
                <span class="auth-v-arrow">↑</span>
            </div>
            <div class="cs-mp-wrap">
                <span class="auth-v-arrow">↑</span>
                <span class="band-item bi band-2line"><span class="band-route">MP → CS</span><span class="band-name">已完成工作包通知</span></span>
                <span class="auth-v-arrow">↑</span>
            </div>
        </div>
    </div>

    <!-- ④交付层 MP（与 CS 同列居中）-->
    <div class="layer-section layer--delivery">
        <div class="layer-label">交付</div>
        <div class="layer-body">
            <div class="mrow mrow-cs">
                <div class="proc-col cs-col">
                    <div class="proc-node" id="node-mp" onclick="toggleDetail('mp')">
                        <div class="proc-header">
                            <span class="proc-abbr">MP</span>
                            <div class="proc-title">
                                <h3>产品交付管理</h3>
                                <div class="proc-role">团队经理 · 项目保证</div>
                            </div>
                        </div>
                        <div class="proc-products">
                            <a class="mgmt-product mp-plan" href="entities/product.html">检查点报告</a>
                            <a class="mgmt-product mp-plan" href="entities/product.html">产品描述</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>'''

def main():
    apply = '--apply' in sys.argv
    with io.open(HTML, 'r', encoding='utf-8') as f:
        content = f.read()

    # 锚点唯一性校验
    if content.count(START) != 1:
        print('ERROR: START 锚点命中数 =', content.count(START)); return
    si = content.find(START)
    ei = content.find(END)
    if ei == -1:
        print('ERROR: END 锚点未找到'); return
    if content.count(END) != 1:
        print('ERROR: END 锚点命中数 =', content.count(END)); return
    ei_end = ei + len(END)

    old_seg = content[si:ei_end]
    print('=== 将替换的旧段 ===')
    print('旧段长度(字符):', len(old_seg), '约', old_seg.count(chr(10)) + 1, '行')
    print('旧段开头:', repr(old_seg[:80]))
    print('旧段结尾:', repr(old_seg[-80:]))
    print('新块长度(字符):', len(NEW_BLOCK), '约', NEW_BLOCK.count(chr(10)) + 1, '行')

    # 关键产品标签数校验（防内容丢失）：旧段 mgmt-product 数量 vs 新块
    print('旧段 mgmt-product 数:', old_seg.count('mgmt-product'))
    print('新块 mgmt-product 数:', NEW_BLOCK.count('mgmt-product'))

    new_content = content[:si] + NEW_BLOCK + content[ei_end:]

    if '�' in new_content:
        print('ERROR: 检测到替换字符 U+FFFD（中文损坏），中止'); return

    if apply:
        with io.open(HTML, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('=== 已写回 ===  新文件总长:', len(new_content))
    else:
        print('=== DRY-RUN（未写回，加 --apply 落地）===')

if __name__ == '__main__':
    main()
