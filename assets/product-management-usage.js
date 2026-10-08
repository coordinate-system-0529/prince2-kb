(function () {
    "use strict";

    var activeSlug = "", activeMode = "theory", selected = 0, readingScene = false;
    function step(actors, fields, products, theory, example, result, caseResult, recipient) {
        return { actors: actors, fields: fields, products: products, theory: theory, example: example, result: result, caseResult: caseResult, recipient: recipient };
    }
    function scene(name, state, steps) { return { name: name, state: state, steps: steps }; }
    // 流程使用是项目归纳，不把产品职责表转换为教材未列明的RACI代码。
    var configurations = {
        "product-register": [
            scene("创建", "建单记录 · 日期待确认", [
                step([1, 2], [1], ["project-plan", "product-description"], "按计划识别产品及其描述，确定初始产品清单。", "陈默核对计划产品；宋妍、赵建国提供设计及施工产品清单。", "初始产品清单", "首批清单，第2至3周", "项目支持"),
                step([0], [1, 2, 3, 4], [], "建立标识符、计划日期、初始状态和资料关联。", "许静建立首批产品记录，关联描述和计划；实际建单日期待确认。", "初始登记单", "首批产品已登记，建单日期待确认", "项目经理检查")
            ]),
            scene("阶段增补", "计划第8周 · 待开展", [
                step([1, 2], [1, 2], ["project-plan"], "核对下一阶段或例外计划要求，识别新增产品。", "MGT-004已于第7周编制为v0.1；陈默拟与小组经理在第8周核对下一阶段产品。", "新增产品及计划日期", "下一阶段清单与日期待核对", "项目支持"),
                step([0], [1, 2, 3, 4], [], "登记新增项，并关联相应计划和产品描述。", "许静拟按阶段审查结果更新关联资料；MGT-004目前编制中，待授权。", "更新登记单", "阶段核对与授权待开展", "项目经理及相关小组")
            ]),
            scene("状态更新", "第7周 · 防水待复验", [
                step([2, 3], [2, 3, 4], ["quality-register"], "提供实际产品版本、交付及批准或验收结果。", "设计成果已验收；木门v0.1等待排产；防水返工后v1.1待复验，验收日期未填写。", "状态及批准验收依据", "已验收、待排产、待复验分别记录", "项目支持"),
                step([0, 1], [2, 3, 4], ["issue-register"], "更新记录，核对进展和偏差，必要时安排处置。", "许静更新状态与证据关联；陈默检查防水复验及木门排产对交付的影响。", "最新状态与处置输入", "复验及排产结果待确认", "相关小组及职权人员")
            ]),
            scene("阶段核对", "计划第8周 · 待开展", [
                step([0, 1], [2, 3, 4], ["project-plan", "quality-register"], "核对阶段计划产品是否交付及其接受依据。", "许静拟核对计划与实际状态，陈默确认阶段完成条件和未交付项。", "阶段交付核对结果", "阶段核对待开展", "阶段竣工报告与下一阶段审查")
            ]),
            scene("最终关闭", "计划第16周 · 未收尾", [
                step([1, 3], [2, 3, 4], ["project-product-description", "quality-register"], "确认最终产品交付及接受依据，识别遗留事项。", "陈默拟核对整体验收，林悦按授权确认适用性；尚无最终验收结论。", "最终交付确认", "验收与遗留事项待确认", "项目支持"),
                step([0], [2, 3, 4], [], "完成最终记录并关闭登记单，提供项目竣工报告输入。", "许静拟在交付确认后归档最终版本；登记单尚未关闭。", "最终登记单", "关闭待执行", "项目竣工报告及资料接收方")
            ])
        ],
        "product-description": [
            scene("编制", "案例版本 · v0.1至v1.0", [
                step([3, 2, 0], [3, 4, 6, 7], [], "确认产品目的、组成和用户需求，明确质量规格及生产条件。", "陈默组织需求与施工条件核对；林悦提出湿区使用要求，赵建国提供施工输入。", "产品要求与生产输入", "防水目的、组成及规格", "项目保证审查"),
                step([3, 1], [8, 9, 10], [], "明确质量方法、容许偏差和责任，检查要求是否可验证。", "描述由v0.1完善至v1.0，列明闭水方法、质量责任及接受条件。", "产品描述拟稿", "PD-WPF-11 v1.0", "批准及验收职权人员")
            ]),
            scene("批准基准", "历史记录 · 6月12日接受", [
                step([3], [1, 2, 10], [], "按已明确的职权取得产品描述批准，确立有效版本。", "案例记录陈默于6月12日接受PD-WPF-11 v1.0，作为防水质量基准。", "获批产品描述", "描述v1.0已接受", "项目支持"),
                step([4], [1, 2], ["product-register"], "将获批描述及其版本、批准依据关联到产品登记单。", "许静维护防水描述与产品版本及检查记录的关联。", "基准版本及引用", "描述v1.0，实际产品v1.1", "小组经理据此交付")
            ]),
            scene("生产与检查", "返工已记录 · 复验待执行", [
                step([0], [6, 9, 10], ["work-package-description", "quality-register"], "按协定规格生产和自检，报告检查结果及偏差。", "赵建国组织施工和自检；首次闭水不通过后完成节点返工，实际产品v1.1待复验。", "实际产品及质量记录", "返工完成，复验未完成", "项目经理及项目保证"),
                step([3, 1, 4], [8, 9, 10], ["issue-register", "quality-register"], "核查证据，按职权决定接受、拒绝或安排纠正，更新记录关联。", "王志衡核查失败与返工依据；陈默安排第二次闭水；许静保留失败记录及待复验资料。", "接受或纠正安排", "尚未验收", "小组经理及接受职权人员")
            ]),
            scene("受控变更", "本次 · 描述未变更", [
                step([3, 1], [2, 6, 8], ["issue-register"], "判断变化是否涉及产品要求，需求变更按控制程序处理。", "本次为质量不符合及返工，未改变质量规格；描述继续为v1.0。", "变更判断及有效描述", "描述v1.0保持有效", "相关批准职权人员"),
                step([4], [1, 2], ["product-register", "quality-register"], "分别维护描述版本、实际产品状态和检查结果。", "许静关联实际产品v1.1与待复验记录，不以返工版本替代描述基准。", "一致的版本及证据关联", "产品v1.1待复验", "项目经理及交付小组")
            ])
        ],
        "project-brief": [
            scene("形成启动基础", "历史版本 · v0.1至v0.2", [
                step([0, 1], [1, 2, 3], ["outline-business-case", "project-product-description"], "形成项目定义、初步业务理由及最终产品要求。", "陈默与周诚形成初始意图、勘察和选项比较，明确42万元待审查边界。", "项目定义与初步论证", "5月4日至8日，v0.1至v0.2", "项目经理汇编"),
                step([0], [4, 5, 6], [], "汇编项目方法、团队结构与参考资料，准备启动请求。", "陈默补充项目方法、参与人员及依据，提交项目概述文件供审查。", "项目概述文件及启动请求", "v1.0启动材料", "项目管理委员会")
            ]),
            scene("批准启动", "历史记录 · 5月10日批准", [
                step([2], [1, 2, 3, 4], [], "审查是否具备启动基础，决定是否投入项目启动工作。", "委员会审查后，周诚批准v1.0进入项目启动；不等同于授权全部施工。", "启动决定", "项目启动获批", "项目经理")
            ]),
            scene("转入启动文件", "台账记录 · 5月20日授权项目", [
                step([0], [1, 2, 4, 6], ["full-business-case", "project-plan"], "审查并细化启动基础，纳入项目启动文件，由其承接后续管理。", "台账MGT-002记载项目启动文件v1.0、5月20日授权项目；概述文件保留为启动依据。", "详细管理基础", "项目启动文件v1.0，当前基线", "项目管理委员会审查")
            ])
        ],
        "project-product-description": [
            scene("初始编制", "历史版本 · 5月4日v0.1", [
                step([0], [1, 2, 4, 5], [], "明确最终产品、主要组成、用户质量期望和验收准则。", "陈默形成v0.1，记录住宅最终产品边界和家庭初始质量期望。", "初始项目产品描述", "v0.1初稿", "项目管理委员会")
            ]),
            scene("批准质量基础", "历史记录 · v1.0及v1.1获批", [
                step([1], [4, 5, 6, 7], [], "审查并批准项目产品描述，确立项目层面的质量基础。", "5月10日随项目概述文件批准v1.0；5月20日周诚进一步批准v1.1。", "获批质量基础", "有效描述v1.1", "项目经理及交付小组")
            ]),
            scene("启动完善", "历史版本 · 5月20日v1.1", [
                step([0, 2], [5, 6, 7], ["quality-management-approach"], "完善验收准则、方法、责任及容许偏差，取得项目保证建议。", "结合启动质量规划补充Q05、Q06、检查方法、证据和责任，未改变范围及预算。", "完善后的验收基础", "v1.1，范围与预算不变", "项目管理委员会批准")
            ]),
            scene("阶段审查", "后续环节 · 待开展", [
                step([0, 2], [2, 5, 6, 7], ["project-plan", "quality-register"], "审查项目产品描述与阶段情况，需变更的要求按受控程序更新。", "陈默及王志衡拟在阶段边界核对验收要求；尚无后续阶段审查完成记录。", "审查意见或受控更新", "阶段审查待开展", "相关批准职权人员")
            ]),
            scene("整体验收", "计划第16周 · 未验收", [
                step([0, 2], [2, 5, 6], ["product-register", "quality-register", "issue-register"], "对照验收准则核查组成产品、测试结果和移交资料。", "计划第16周汇集质量测试、竣工与隐蔽照片、保修维护及尾项证据；当前仍在开发中。", "验收及移交依据", "整体验收待开展", "用户接受及收尾职权人员"),
                step([1], [5, 6], [], "按约定职责确认用户接受，并据收尾条件作出决定。", "林悦拟确认家庭接受；周诚在收尾条件满足后决定是否授权收尾。", "用户接受与收尾决定", "接受和收尾均待确认", "资料及住宅接收方")
            ])
        ],
        "risk-register": [
            scene("建单", "三条风险 · 建立日期待确认", [
                step([0, 1], [1, 2, 9, 10, 11, 12], [], "识别初始风险，登记描述、责任和资料，承接建单前的风险信息。", "汇集RISK-004、007、011；风险建立日期及部分责任信息待确认。", "初始风险记录", "三条风险记录", "风险负责人")
            ]),
            scene("复评与处置", "第7周 · 评级待复评", [
                step([3, 0], [3, 4, 5, 6, 8], ["project-plan", "issue-register", "quality-register"], "复评风险及剩余风险，判断对项目目标的影响，关联已发生事件。", "陈默核对木门等待排产和防水返工后待复验情况；评级与影响待复评。", "风险评估及处置输入", "评级及影响待复评", "风险行动负责人"),
                step([1], [7, 11, 12], [], "登记应对决定、审查日期、状态和证据关联。", "许静拟关联最新排产反馈、问题及质量资料，区分预测与实际证据。", "更新风险记录", "排产及应对证据待补", "项目经理持续审查")
            ]),
            scene("实施应对", "排产与复验 · 效果待核验", [
                step([4, 2], [7, 10, 11, 12], ["work-package-description"], "实施应对，报告资源、工作接口及执行结果。", "陆明远协调排产和备选资源；赵建国反馈到货对安装顺序的影响，结果待核验。", "应对执行反馈", "排产确认与效果待核验", "风险负责人"),
                step([3, 1], [8, 11, 12], [], "核对行动效果及剩余风险，维护后续监视信息。", "陈默拟评估应对效果；许静更新审查日期和依据。", "剩余风险及监视安排", "剩余风险待复评", "项目经理")
            ]),
            scene("阶段复评", "下一阶段 · 待开展", [
                step([0, 3, 1], [3, 4, 7, 8, 9, 10, 11], ["project-plan"], "复评当前和下一阶段风险，调整责任、行动和期限。", "拟核对到货、安装接口、未关闭风险及下一阶段责任和期限。", "阶段风险及下一阶段安排", "阶段复评待开展", "下一阶段计划及授权审查")
            ]),
            scene("剩余风险移交", "项目收尾 · 待开展", [
                step([0, 3, 1], [8, 9, 10, 11, 12], [], "确认剩余风险、接收方及后续责任，记录交接安排。", "剩余风险、接收方及移交责任待确认；当前尚未收尾。", "剩余风险及交接记录", "接收方及移交责任待确认", "后续风险接收方")
            ])
        ],
        "issue-register": [
            scene("建单", "建单日期 · 待确认", [
                step([0, 2], [1, 2, 3, 5, 7, 8], [], "建立正式问题记录，承接准备阶段已记录的问题。", "ISS-WPF-001已形成正式记录；登记单建立日期和问题负责人任命待确认。", "初始问题登记单", "一条不合格记录，建单日期待确认", "项目经理评估")
            ]),
            scene("评估与处置", "首次失败已记录 · 复验待执行", [
                step([1, 2], [2, 3, 7, 8], ["quality-register", "product-register"], "报告问题事实和影响，关联产品及质量证据。", "6月15日首次闭水不通过，停止交接；许静关联失败资料。年份未注明。", "问题事实与依据", "首次失败，产品停止交接", "项目经理及项目保证"),
                step([0, 3], [4, 5, 6, 8], ["project-plan", "quality-register"], "评估影响，按权限决定处置或上报，核查解决与关闭条件。", "陈默接受局部返工并复验方案；王志衡核查返工及复验前提。QA-WPF-02及关闭决定待确认。", "处置决定及后续检查", "局部返工获接受，复验和关闭待确认", "交付小组执行，项目支持记录")
            ]),
            scene("纠正与反馈", "返工完成 · 产品待复验", [
                step([1], [6, 7, 8], ["work-package-description", "quality-register"], "实施纠正行动，提交实际结果与相关证据。", "赵建国完成节点返工，形成WPF-011 v1.1；描述文件仍为v1.0。", "纠正结果及证据", "返工完成，自检证据关联", "项目经理核对"),
                step([0, 2], [6, 8], ["quality-register", "product-register"], "核对纠正结果，维护状态；以检查和接受依据确认解决。", "陈默安排第二次闭水；许静关联待复验表。产品仍未验收，问题尚未关闭。", "最新问题状态", "待复验、待关闭", "检查及接受职权人员")
            ]),
            scene("阶段审查", "阶段边界 · 待开展", [
                step([0, 2], [4, 5, 6, 7, 8], ["project-plan"], "核对未解决问题及下一阶段影响，更新责任、行动和期限。", "拟核对防水复验和问题关闭情况；尚无阶段边界审查记录。", "遗留问题及阶段安排", "阶段审查待开展", "下一阶段计划与授权审查")
            ]),
            scene("收尾与移交", "项目收尾 · 待开展", [
                step([0, 2, 3], [5, 6, 7, 8], [], "核对解决依据；遗留问题明确接收方和后续安排。", "拟核对问题关闭证据和遗留事项接收方；当前无项目收尾或移交记录。", "最终问题状态及交接记录", "收尾和移交待开展", "后续事项接收方")
            ])
        ],
        "lessons-log": [
            scene("既往经验", "三条记录 · 采用日期待确认", [
                step([0, 1], [1, 2, 3, 8], [], "审查既往经验，识别本项目适用内容，建立记录及来源关联。", "陈默拟审查三条历史经验；许静保留来源。采用记录和日期待确认。", "适用经验及来源", "三条经验，采用情况待确认", "项目方法与计划编制人员")
            ]),
            scene("纳入计划", "适用建议 · 纳入情况待确认", [
                step([0, 2], [2, 4, 6, 8], ["project-plan", "work-package-description"], "将适用建议转化为计划或工作安排，明确行动负责人和证据要求。", "封闭前检查、定位样板和主材排产预警可纳入相应安排；实际采用文件待核对。", "计划及工作安排中的改进措施", "采用与行动安排待核对", "相应行动负责人")
            ]),
            scene("捕获与应用", "第7周 · 行动及效果待核验", [
                step([2, 1], [2, 3, 7, 8], ["quality-register", "issue-register", "risk-register"], "记录事件、原因、影响和建议，关联行动及质量证据。", "赵建国、宋妍提供施工与定位经验；许静关联防水失败、返工和排产资料，原因与行动仍待核验。", "经验及行动记录", "事件已记录，原因和行动待核验", "项目经理审查"),
                step([0, 2], [4, 5, 6, 8], [], "确认建议的适用性与优先级，安排实施并核对结果。", "陈默拟安排适用建议，行动负责人反馈实施结果；三条记录均有行动或效果待核验。", "行动结果与效果依据", "行动或效果待核验", "项目支持更新记录")
            ]),
            scene("阶段复盘", "下一阶段 · 待开展", [
                step([0, 2, 1], [2, 4, 6, 8], ["project-plan"], "复盘已执行及未完成行动，将适用建议带入下一阶段。", "拟检查清单执行、样板确认及排产预警效果；验证状态待核验。", "阶段经验及后续行动", "效果验证与后续安排待核验", "下一阶段计划编制人员")
            ]),
            scene("汇总与分享", "项目收尾 · 总结待开展", [
                step([0, 1], [2, 6, 8], [], "整理可验证经验与未完成行动，为经验教训报告提供输入。", "陈默与许静拟汇总已验证经验及未完成行动；当前尚未完成收尾总结。", "经验教训报告输入", "收尾总结待开展", "项目总监及经验教训报告编制人员"),
                step([3], [2, 6, 8], [], "向业务分享可复用经验，明确后续使用及行动安排。", "周诚计划审查后向业主及后续使用者分享经验。分享状态：待执行。", "可复用经验及后续安排", "分享待执行", "业务及后续项目")
            ])
        ],
        "quality-register": [
            scene("安排检查", "质量活动 · 建单日期待确认", [
                step([0, 2], [2, 3, 4, 5], ["product-description", "work-package-description"], "按产品描述和工作包明确质量方法、计划日期及责任。", "防水活动列明闭水方法、日期和责任；建单日期待确认。", "计划质量活动", "两条质量活动，第二次待执行", "项目支持登记"),
                step([1], [1, 2, 4, 5, 7], [], "建立活动标识符与产品、计划和证据的关联。", "许静维护QA-WPF-01、QA-WPF-02及其产品和证据关联。", "初始质量登记单", "首次失败与待复验分别登记", "检查及相关交付人员")
            ]),
            scene("执行与更新", "首次不通过 · 复验待执行", [
                step([2, 3], [3, 4, 5, 6, 7], ["product-description"], "实施质量活动，报告结果，并核查活动及证据。", "赵建国返工并提交自检依据；王志衡核查失败事实、返工范围和复验前提。", "检查结果及证据", "首次不通过，返工后待复验", "项目经理安排处置"),
                step([0, 1], [4, 6, 7], ["issue-register", "product-register"], "安排纠正或后续检查，登记实际结果并保留历史记录。", "陈默停止交接并安排复验；许静保留QA-WPF-01失败结果，QA-WPF-02结果待填写。", "更新记录与处置安排", "复验未执行，结果未填写", "相关检查及接受人员")
            ]),
            scene("阶段核对", "阶段审查 · 待开展", [
                step([0, 1, 3], [4, 6, 7], ["project-plan", "product-register"], "核对已完成和未完成活动，确定阶段质量完成条件。", "拟核对复验结果及未完成活动；尚无阶段审查结论。", "阶段质量状态及后续活动", "阶段核对待开展", "阶段竣工报告及下一阶段安排")
            ]),
            scene("收尾核对", "项目收尾 · 待开展", [
                step([0, 1, 3], [4, 6, 7], ["project-product-description"], "核对最终质量活动与验收依据，区分通过、未通过和未执行事项。", "拟汇集验收结论与移交证据；当前未收尾。", "最终质量状态与证据索引", "收尾核对待开展", "项目竣工报告及资料接收方")
            ])
        ],
        "quality-management-approach": [
            scene("制定与协定", "拟稿 · 协定和批准待确认", [
                step([0, 2, 3, 5], [1, 2, 3, 4, 5, 6], ["project-product-description", "product-description"], "制定质量程序，协定用户及供应方技术和资源，取得项目保证建议。", "陈默汇总质量安排；林悦、陆明远待协定需求和资源；王志衡提出核查建议。", "协定的质量管理方法", "方法拟稿，协定和资源承诺待确认", "项目总监批准"),
                step([1, 6], [3, 7], [], "按职权批准方法，维护有效版本及参考资料。", "周诚拟批准方法；许静拟维护记录与引用。批准状态：待确认。", "获批方法及版本记录", "方法尚未批准生效", "项目经理及交付小组")
            ]),
            scene("落实质量安排", "现有防水活动 · 方法待批准", [
                step([0, 4], [2, 3, 4, 5, 6], ["work-package-description", "product-description"], "把协定质量安排落实到工作包、施工自检和产品检查。", "现有防水活动记录首次失败与返工；陈默拟核对方法对停止交接、处置及复验的覆盖。", "质量实施安排及实际活动", "现有活动已记录，方法待协定批准", "项目保证核查"),
                step([5, 6], [2, 3, 7], ["quality-register", "issue-register"], "独立核查程序实施，汇编活动结果与资料关联。", "王志衡核查程序和证据；许静维护质量活动、问题及产品版本关联。", "实施核查与质量记录", "复验及实施效果待核验", "项目经理审查")
            ]),
            scene("审查与改进", "后续审查 · 待开展", [
                step([0, 5, 6], [2, 4, 6, 7], ["quality-register", "lessons-log"], "依据阶段和收尾记录识别偏差及经验，需变更的安排按授权处理。", "拟审查标准清单、资源落实和实施效果；方法变更按授权处理。", "审查意见及受控改进", "标准、资源及效果待确认", "相关协定和批准人员")
            ])
        ],
        "work-package-description": [
            scene("拟定与授权", "工作包 · 授权待确认", [
                step([0], [1, 2, 3, 6, 7, 8], ["product-description", "project-plan"], "明确工作、产品、约束、目标、容许偏差及报告安排。", "陈默拟定防水交付边界及控制安排，预算、时限、容许偏差和报告频率等缺失条件待协定。", "工作包描述及授权条件", "工作包拟稿，条件待协定", "小组经理核对"),
                step([0, 1], [4, 5, 9, 10, 11], [], "协定程序、接口和接受条件，记录批准及协议。", "陈默与赵建国核对资源和接受条件；正式授权及协议待确认。", "获授权的工作包及协议", "授权和协议待确认", "交付小组")
            ]),
            scene("实施与反馈", "返工完成 · 复验待执行", [
                step([1], [3, 4, 6, 7, 8], ["quality-register", "issue-register"], "实施协定工作及质量活动，报告进展、偏差和完成情况。", "赵建国已组织节点返工，实际产品WPF-011 v1.1待复验，反馈结果待核对。", "交付结果、进展及质量依据", "返工完成，最终交付待确认", "项目经理"),
                step([0], [7, 10, 11], ["product-register", "quality-register"], "审查实际结果及接受依据，按协定确认交付和工作包完成。", "陈默拟核对复验、产品接受及完成签认；不能仅凭返工结束关闭工作包。", "产品接受及工作包完成记录", "复验、接受及完成签认待确认", "后续工作及资料接收方")
            ])
        ]
    };
    var caseRoleOrder = { "issue-register": [0, 1, 3, 2] };
    function selectedRiskId() {
        var record = document.querySelector("#lesson-register-section:not([hidden]) .lesson-detail:not([hidden])");
        return record ? record.id.replace(/^lesson-detail-/, "") : "";
    }
    function riskRecord(recordId) {
        var documentData = (window.PRINCE2RegisterDocuments || {})["risk-register"];
        return documentData && documentData.records.find(function (record) { return record.id === recordId; });
    }
    function riskActor(index, recordId) {
        if (index >= 0 && index <= 2) {
            var base = window.PRINCE2_PRODUCT_DETAILS_V2.entries["risk-register"].caseView.roles.items[index];
            var description = index === 0 ? "组织" + recordId + "的风险复评、协调与上报，不代替条目风险负责人的任命。" : index === 1 ?
                "维护" + recordId + "的状态、审查日期及证据关联，区分预测与实际。" :
                recordId === "RISK-004" ? "反馈木门到货对安装顺序和现场工作的影响。" :
                recordId === "RISK-007" ? "反馈防水工作包返工、自检及复验的交付接口，不因此承担风险应对任命。" :
                "联合采购规格及交付接口的具体参与分工待确认。";
            return Object.assign({}, base, { description: description });
        }
        if (index !== 3 && index !== 4) { return null; }
        var name = index === 3 ? "风险负责人" : "风险行动负责人";
        var role = window.PRINCE2ProductRaci && window.PRINCE2ProductRaci.riskRecordRole(recordId, index === 3 ? "owner" : "action", name, "case");
        var record = riskRecord(recordId);
        var field = record && record.fields.find(function (item) { return item[0] === name; });
        return { name: (role && role.person || "待确认") + " · " + (role && role.identity || recordId || "按所选风险"),
            relation: name, actions: index === 3 ? ["管理", "监视", "控制"] : ["实施", "反馈"], description: field ? field[1] : "职责待确认。" };
    }
    function riskScene(configuration, index, recordId) {
        var record = riskRecord(recordId);
        if (!record) { return configuration; }
        var context = {
            "RISK-004": {
                assess: "陈默以项目经理身份核对DOOR-018等待排产及安装接口；风险与行动负责人为拟任，当前评级及影响待复评。",
                action: "陆明远拟协调木门排产及备选资源，赵建国反馈安装接口；排产承诺、执行记录和应对效果待核验。",
                follow: "拟核对木门排产反馈、到货与安装接口，复评剩余风险。",
                stage: "拟核对木门到货、安装接口和下一阶段应对；责任任命、期限及阶段复评记录待确认。",
                assessProducts: ["project-plan", "commercial-management-approach"], actionProducts: ["commercial-management-approach", "product-register"], actionActors: [4, 2]
            },
            "RISK-007": {
                assess: "陈默以项目经理身份协调防水影响评估；首次闭水失败，WPF-011 v1.1返工后待复验，风险负责人及风险行动负责人待确认。",
                action: "风险应对职责待确认。质量处置由赵建国组织返工、陈默安排复验、王志衡核查；新增检查行动及应对效果待核验。",
                follow: "拟根据QA-WPF-02复验及后续交付安排复评渗漏、返工和工期影响；当前复验未执行。",
                stage: "拟核对防水复验、后续覆盖与交接条件及剩余风险；下一阶段责任、期限和复评记录待确认。",
                assessProducts: ["project-plan", "issue-register", "quality-register"], actionProducts: ["work-package-description", "quality-register", "issue-register"], actionActors: [4, 2]
            },
            "RISK-011": {
                assess: "陈默拟组织联合采购机会复评，核对规格、促销报价和节省金额；风险负责人及风险行动负责人待确认。",
                action: "拟确认瓷砖、洁具规格并争取组合折扣；行动分工、商业条件、促销有效期及实际收益待确认。",
                follow: "拟核对报价、规格确认及采购收益，再评估机会概率和影响；实际节省金额待确认。",
                stage: "拟核对联合采购机会的有效期、规格及下一阶段采购接口；责任、期限及收益影响待确认。",
                assessProducts: ["full-business-case", "commercial-management-approach"], actionProducts: ["commercial-management-approach", "full-business-case"], actionActors: [4]
            }
        }[recordId];
        if (!context) { return configuration; }
        var result = Object.assign({}, configuration, { state: recordId + " · " + (index === 0 ? "建立日期待确认" : index === 1 ? record.summary[2] : index === 2 ? "应对效果待核验" : index === 3 ? "阶段复评待开展" : "剩余风险移交待开展"),
            steps: configuration.steps.map(function (item) { return Object.assign({}, item); }) });
        if (index === 0) {
            result.steps[0].example = recordId + " · " + record.title + "；记录建立日期及职责签认待确认。";
            result.steps[0].caseResult = "所选风险记录及待确认事项";
        } else if (index === 1) {
            result.steps[0].example = context.assess; result.steps[0].products = context.assessProducts;
            result.steps[1].example = "许静拟维护" + recordId + "的应对、审查日期与资料，分别记录预测、实际及待核验结果。";
            result.steps[1].caseResult = "当前复评及应对证据待补";
        } else if (index === 2) {
            result.steps[0].example = context.action; result.steps[0].products = context.actionProducts; result.steps[0].actors = context.actionActors;
            result.steps[0].caseResult = "行动执行及效果待核验";
            result.steps[1].actors = [0, 3, 1]; result.steps[1].example = context.follow + "许静拟更新审查日期及依据。";
        } else if (index === 3) {
            result.steps[0].example = context.stage;
        } else {
            result.steps[0].example = recordId + "的剩余风险、接收方及移交责任待确认；当前尚未收尾。";
        }
        return result;
    }
    function entry() { return window.PRINCE2_PRODUCT_DETAILS_V2.entries[activeSlug]; }
    function actor(index) {
        var base = entry().roles.items[index];
        if (activeSlug === "risk-register" && activeMode === "case") {
            var linked = riskActor(index, selectedRiskId());
            if (linked) { return linked; }
        }
        return activeMode === "case" ? entry().caseView.roles.items[(caseRoleOrder[activeSlug] || [])[index] ?? index] : base;
    }
    function node(tag, text, className) {
        var element = document.createElement(tag);
        if (text != null) { element.textContent = text; }
        if (className) { element.className = className; }
        return element;
    }
    function link(label, href) { var element = node("a", label); element.href = href; return element; }
    function renderActor(index) {
        var item = actor(index), span = node("span", null, "plan-usage-person");
        var parts = item.name.split(" · ");
        span.append(node("strong", parts[0]));
        if (activeMode === "case") {
            // 多人共享角色时按语义拆分身份标签，姓名和现实身份仍完整保留。
            var identityText = parts.slice(1).join(" · ");
            if (parts[0] === "陈默" && ["项目经理", "木门风险整体负责人"].includes(identityText)) { identityText = "受托项目经理"; }
            identityText.split("、").forEach(function (identity) { span.append(node("small", identity)); });
            span.append(node("small", entry().roles.items[index].name));
        }
        return span;
    }
    function visibleRecordField(index) {
        var record = document.querySelector("#lesson-register-section:not([hidden]) .lesson-detail:not([hidden])");
        if (!record) { return null; }
        var fields = Array.from(record.querySelectorAll(".lesson-record-fields > div"));
        fields.forEach(function (field, position) { field.id = "record-field-" + record.id.slice(14) + "-" + (position + 1); });
        return fields[index - 1] || null;
    }
    function materialHref(index) {
        var paperField = activeMode === "case" && document.getElementById("remaining-" + activeSlug + "-chapter-" + index);
        if (paperField) { return "#" + paperField.id; }
        var field = activeMode === "case" && visibleRecordField(index);
        return field ? "#" + field.id : "#composition-" + entry().composition.items[index - 1].label;
    }
    function updateFieldLinks() {
        if (!configurations[activeSlug]) { return; }
        document.querySelectorAll("#product-management-usage [data-material-field]").forEach(function (a) { a.href = materialHref(Number(a.dataset.materialField)); });
        if (activeSlug === "risk-register" && activeMode === "case") {
            renderMatrix(); renderScene(); stabilizePanel();
        }
    }
    function productName(slug) { return window.PRINCE2_PRODUCT_DETAILS_V2.entries[slug].name; }
    function sources(index) {
        var life = entry().lifecycle;
        return life.items[index].evidence || life.evidence || [];
    }
    function renderScene() {
        var configuration = configurations[activeSlug][selected], phase = entry().lifecycle.items[selected];
        if (activeSlug === "risk-register" && activeMode === "case") { configuration = riskScene(configuration, selected, selectedRiskId()); }
        var panel = document.getElementById("product-management-panel");
        panel.replaceChildren(); panel.dataset.viewAnchor = "product-management-scenario";
        panel.setAttribute("aria-labelledby", "product-management-tab-" + selected);
        var header = node("div", null, "plan-usage-context");
        header.append(node("strong", phase.processCode + " · " + configuration.name), node("span", activeMode === "case" ? configuration.state : "流程应用 · 项目归纳", "plan-usage-state"));
        panel.append(header);
        var table = node("table", null, "plan-usage-steps"), head = node("thead"), body = node("tbody"), headings = node("tr");
        ["步骤", "责任人／角色", "使用材料", "管理动作", "产出与交接"].forEach(function (label, index) {
            var th = node("th", label); th.scope = "col"; th.className = ["plan-usage-number-cell", "plan-usage-actor-cell", "plan-usage-material-cell", "plan-usage-action-cell", "plan-usage-result-cell"][index]; headings.append(th);
        }); head.append(headings);
        configuration.steps.forEach(function (item, index) {
            var row = node("tr"), number = node("th", String(index + 1).padStart(2, "0")), actors = node("td"), materials = node("td"), action = node("td"), result = node("td"); number.scope = "row";
            [actors, materials, action, result].forEach(function (cell, position) { cell.dataset.label = ["责任人／角色", "使用材料", "管理动作", "产出与交接"][position]; });
            var actorList = node("div", null, "plan-usage-actors"); item.actors.forEach(function (index) { actorList.append(renderActor(index)); }); actors.append(actorList);
            var materialList = node("div", null, "plan-usage-materials");
            item.fields.forEach(function (index) { var a = link(String(index).padStart(2, "0") + " " + entry().composition.items[index - 1].label, materialHref(index)); a.dataset.materialField = index; materialList.append(a); });
            item.products.forEach(function (slug) { materialList.append(link(productName(slug), "product-detail-v2.html?entry=" + slug + "&mode=" + activeMode)); }); materials.append(materialList);
            action.className = "plan-usage-action-cell"; action.append(node("p", activeMode === "case" ? item.example : item.theory));
            result.append(node("strong", activeMode === "case" ? item.caseResult : item.result), node("p", "交接：" + item.recipient)); row.append(number, actors, materials, action, result); body.append(row);
        }); table.append(head, body); panel.append(table);
        var footer = node("div", null, "plan-usage-outcome");
        sources(selected).forEach(function (source) { footer.append(link("原文 · " + source.label, source.href)); }); panel.append(footer);
    }
    function stabilizePanel() {
        var panel = document.getElementById("product-management-panel");
        if (!panel || !panel.getBoundingClientRect().height || !configurations[activeSlug]) { return; }
        panel.style.minHeight = "0";
        var mode = activeMode, height = panel.getBoundingClientRect().height;
        activeMode = mode === "case" ? "theory" : "case"; renderScene(); height = Math.max(height, panel.getBoundingClientRect().height);
        activeMode = mode; renderScene(); panel.style.minHeight = Math.ceil(height) + "px";
    }
    function selectScene(index, focus, scroll) {
        selected = Math.min(Math.max(index, 0), configurations[activeSlug].length - 1); readingScene = true;
        try { sessionStorage.setItem("prince2-" + activeSlug + "-management-v1", String(selected)); } catch (error) { /* 不阻断阅读。 */ }
        document.querySelectorAll("#product-management-usage .plan-usage-tab").forEach(function (tab, index) {
            var active = index === selected; tab.tabIndex = active ? 0 : -1; tab.setAttribute("aria-selected", String(active)); if (active && focus) { tab.focus(); }
        }); renderScene(); stabilizePanel();
        if (scroll) { document.getElementById("lifecycle-section").scrollIntoView({ behavior: "instant", block: "start" }); }
    }
    function renderMatrix() {
        var matrix = document.getElementById("product-duty-matrix"); matrix.replaceChildren();
        var table = node("table", null, "product-duty-table"), head = node("thead"), body = node("tbody"), heading = node("tr");
        [activeMode === "case" ? "责任人／项目角色" : "项目角色／职权关系", "职责与动作", "责任范围"].forEach(function (label) { var th = node("th", label); th.scope = "col"; heading.append(th); }); head.append(heading);
        entry().roles.items.forEach(function (base, index) {
            var item = actor(index), row = node("tr"), person = node("th"), actions = node("td"), responsibility = node("td"); person.scope = "row";
            row.dataset.viewAnchor = "role-" + base.name; row.id = row.dataset.viewAnchor; person.dataset.label = heading.children[0].textContent;
            person.append(renderActor(index)); if (activeMode === "theory") { person.append(node("small", base.relation)); }
            actions.dataset.label = "职责与动作"; responsibility.dataset.label = "责任范围";
            actions.textContent = item.actions.join("、"); responsibility.textContent = item.description; row.append(person, actions, responsibility); body.append(row);
        }); table.append(head, body); matrix.append(table);
        var note = node("p", null, "product-management-provenance"); note.append(document.createTextNode(activeMode === "case" ? "人物分工：教学案例。" : "职责来源：手册引用与项目归纳。"));
        (entry().roles.evidence || []).forEach(function (source) { note.append(link(source.label, source.href)); }); matrix.append(note);
        if (window.PRINCE2ProductRaci) {
            var explanation = node("details", null, "product-duty-explanation");
            explanation.append(node("summary", "职责说明"), table, note); matrix.append(explanation);
            window.PRINCE2ProductRaci.render(matrix, activeSlug, activeMode, selectScene);
        }
    }
    function configurePaperLinks() {
        var paper = document.body.classList.contains("has-lesson-document");
        var compositionLink = document.querySelector('#detail-view-toolbar a[data-management-composition], #detail-view-toolbar a[href="#composition-section"]');
        compositionLink.dataset.managementComposition = "true"; compositionLink.href = paper ? "#lesson-register-section" : "#composition-section"; compositionLink.textContent = paper ? (document.querySelector("#lesson-register-section .business-chapter") ? "产品文件" : "记录单实例") : "组成内容";
        var documentLink = document.querySelector("[data-lesson-document-link]"); if (documentLink) { documentLink.hidden = true; }
        var definitionLink = document.querySelector('#detail-view-toolbar a[href="#definition-section"]');
        if (!definitionLink.dataset.managementDefinition) {
            definitionLink.dataset.managementDefinition = "true";
            definitionLink.addEventListener("click", function (event) {
                if (!document.body.classList.contains("has-lesson-document")) { return; }
                event.preventDefault(); var dialog = document.getElementById("lesson-help-dialog");
                if (activeSlug === "lessons-log") {
                    // 定义入口与单条案例解读分别打开，不混淆理论字段和具体记录的说明。
                    dialog.querySelector(".lesson-legacy-explanation").hidden = false; dialog.querySelector(".lesson-interpretation").hidden = true; document.getElementById("lesson-help-title").textContent = "字段说明";
                }
                dialog.querySelector(".lesson-help-close").setAttribute("aria-label", "关闭字段说明");
                if (!dialog.open) { dialog.showModal(); document.body.classList.add("lesson-help-open"); }
            });
        }
        var helpButton = document.querySelector(".lesson-help-button");
        if (paper && helpButton) { helpButton.textContent = activeSlug === "lessons-log" ? "案例解读" : "字段说明"; }
        var dialog = document.getElementById("lesson-help-dialog");
        if (paper && dialog && activeSlug !== "lessons-log") { document.getElementById("lesson-help-title").textContent = "字段说明"; dialog.querySelector(".lesson-help-close").setAttribute("aria-label", "关闭字段说明"); }
    }
    function render(slug, mode) {
        if (!configurations[slug]) { return; }
        if (activeSlug !== slug) {
            selected = 0; readingScene = false;
            try { selected = Number(sessionStorage.getItem("prince2-" + slug + "-management-v1")) || 0; } catch (error) { /* 默认首场景。 */ }
        }
        activeSlug = slug; activeMode = mode; document.body.dataset.productManagement = "true";
        var roles = document.getElementById("roles-section"), lifecycle = document.getElementById("lifecycle-section"); roles.hidden = false; lifecycle.hidden = false;
        document.getElementById("roles-title").textContent = "责任分工"; document.getElementById("roles-kicker").textContent = "活动 × 角色 · RACI";
        document.getElementById("roles-note").hidden = true; roles.querySelector(".role-table-wrap").hidden = true;
        roles.querySelectorAll(".role-table-wrap [data-view-anchor]").forEach(function (row) { row.removeAttribute("data-view-anchor"); row.removeAttribute("id"); });
        document.getElementById("lifecycle-title").textContent = "流程中的使用"; document.getElementById("lifecycle-kicker").textContent = "材料 → 动作 → 产出 → 交接";
        document.getElementById("lifecycle-note").hidden = true; document.getElementById("lifecycle-rhythm").hidden = true; lifecycle.querySelector(".lifecycle-table").hidden = true;
        document.querySelector('#detail-view-toolbar a[href="#roles-section"]').textContent = "责任分工"; document.querySelector('#detail-view-toolbar a[href="#lifecycle-section"]').textContent = "流程使用";
        var matrix = document.getElementById("product-duty-matrix"); if (!matrix) { matrix = node("div"); matrix.id = "product-duty-matrix"; roles.querySelector(".role-table-wrap").after(matrix); } renderMatrix();
        var usage = document.getElementById("product-management-usage"); if (!usage) { usage = node("div"); usage.id = "product-management-usage"; lifecycle.append(usage); } usage.replaceChildren();
        var tabs = node("div", null, "plan-usage-tabs"); tabs.setAttribute("role", "tablist"); tabs.setAttribute("aria-label", entry().name + "流程使用场景");
        configurations[slug].forEach(function (configuration, index) {
            var button = node("button", configuration.name, "plan-usage-tab"); button.type = "button"; button.id = "product-management-tab-" + index; button.dataset.scene = String(index); button.setAttribute("role", "tab"); button.setAttribute("aria-controls", "product-management-panel");
            button.addEventListener("click", function () { selectScene(index, false, false); });
            button.addEventListener("keydown", function (event) {
                var target = selected, length = configurations[slug].length;
                if (event.key === "ArrowRight") { target = (selected + 1) % length; } else if (event.key === "ArrowLeft") { target = (selected + length - 1) % length; } else if (event.key === "Home") { target = 0; } else if (event.key === "End") { target = length - 1; } else { return; }
                event.preventDefault(); selectScene(target, true, false);
            }); tabs.append(button);
        });
        var panel = node("div"); panel.id = "product-management-panel"; panel.setAttribute("role", "tabpanel"); panel.tabIndex = 0; usage.append(tabs, panel);
        var previousIntent = readingScene; selectScene(selected, false, false); readingScene = previousIntent; configurePaperLinks();
    }
    window.addEventListener("resize", stabilizePanel); window.addEventListener("hashchange", function () { readingScene = false; });
    window.addEventListener("product-record:changed", updateFieldLinks);
    window.PRINCE2ProductManagementUsage = {
        resetReadingIntent: function () { readingScene = false; },
        configurations: configurations, caseRoleOrder: caseRoleOrder, riskActor: riskActor, riskScene: riskScene, supports: function (slug) { return Boolean(configurations[slug]); }, render: render, stabilizePanel: stabilizePanel,
        captureReadingAnchor: function () {
            var panel = document.getElementById("product-management-panel"), rect = panel && panel.getBoundingClientRect();
            return readingScene && rect && rect.height && rect.top > 0 && rect.top < innerHeight ? { dataAnchor: "product-management-scenario", sectionId: "lifecycle-section", top: rect.top } : null;
        }
    };
}());
