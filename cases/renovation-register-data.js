window.RENOVATION_PRODUCT_REGISTER = {
    register: {
        id: "REN-PR-001",
        project: "住宅全屋装修项目",
        maintainer: "许静 · 项目支持",
        manager: "陈默 · 项目经理",
        currentStage: "管理阶段 1 · 隐蔽工程",
        currentUpdate: "更新 04",
        status: "持续维护中",
        updatedAt: "第 7 周",
        trigger: "卫生间防水闭水试验未通过，返工成果已形成受控版本"
    },
    updates: [
        {
            id: "update-01",
            label: "更新 01",
            state: "actual",
            affected: ["MGT-002", "MGT-003", "DEC-001", "DEM-003", "MEP-006", "WPF-011", "FIN-014", "CAB-016", "DOOR-018", "ELE-021", "HAN-024", "HOME-025"]
        },
        {
            id: "update-02",
            label: "更新 02",
            state: "actual",
            affected: ["DEC-001", "MEP-006"]
        },
        {
            id: "update-03",
            label: "更新 03",
            state: "actual",
            affected: ["DOOR-018"]
        },
        {
            id: "update-04",
            label: "更新 04",
            state: "actual",
            affected: ["WPF-011"]
        },
        {
            id: "update-05",
            label: "计划 05",
            state: "planned",
            affected: ["MGT-004", "FIN-014", "CAB-016", "DOOR-018", "ELE-021"]
        },
        {
            id: "update-06",
            label: "计划 06",
            state: "planned",
            affected: ["HAN-024", "HOME-025"]
        }
    ],
    products: [
        {
            id: "MGT-001",
            name: "项目概述文件",
            caseHref: "project-brief.html",
            type: "A11 正式产品",
            source: "项目准备",
            stage: "项目准备",
            owner: "陈默",
            status: "已批准",
            statusClass: "is-done",
            version: "v1.0",
            descriptionRef: "PD-MGT-01",
            descriptionApproved: "5月8日",
            plannedAcceptance: "5月10日",
            actualAcceptance: "5月10日",
            result: "批准启动",
            lastUpdate: "更新前置",
            detail: {
                purpose: "说明装修项目的初始范围、目标、预算约束和准备项目启动所需的基本信息。",
                parent: "项目启动文件的前置输入",
                components: ["项目目标与范围", "42 万元预算边界", "16 周工期目标", "初始项目组织"],
                people: [
                    ["陈默", "项目经理", "编制并协调信息"],
                    ["周诚", "项目总监", "确认商业理由和预算边界"],
                    ["林悦", "高级用户", "确认家庭需求和使用目标"]
                ],
                criteria: ["目标、范围和排除项表述清楚", "预算和工期目标可用于启动评估", "项目总监同意进入项目启动"],
                history: [
                    ["第 1 周", "家庭形成共同目标", "草案 → 已批准", "v0.1 → v1.0", "形成项目启动依据"]
                ]
            }
        },
        {
            id: "MGT-002",
            name: "项目启动文件",
            type: "A12 正式产品",
            source: "项目启动",
            stage: "启动管理阶段",
            owner: "陈默",
            status: "当前基线",
            statusClass: "is-done",
            version: "v1.0",
            descriptionRef: "PD-MGT-02",
            descriptionApproved: "5月16日",
            plannedAcceptance: "5月20日",
            actualAcceptance: "5月20日",
            result: "授权项目",
            lastUpdate: "更新 01",
            detail: {
                purpose: "汇集项目基准、管理方法、组织安排和裁剪决定，作为项目授权与控制依据。",
                parent: "项目管理基线",
                components: ["商业论证", "项目计划", "管理方法", "项目组织与裁剪说明"],
                people: [
                    ["陈默", "项目经理", "组织编制并保持协调一致"],
                    ["许静", "项目支持", "维护组成文件和版本"],
                    ["周诚", "项目总监", "代表项目管理委员会授权"]
                ],
                criteria: ["项目基准和管理方法完整", "角色、容许偏差和报告安排明确", "项目管理委员会正式授权"],
                history: [
                    ["第 2 至 3 周", "项目基准建立", "草案 → 当前基线", "v0.3 → v1.0", "成为项目授权版本"]
                ]
            }
        },
        {
            id: "MGT-003",
            name: "管理阶段 1 阶段计划",
            type: "A9 计划类型",
            source: "项目启动文件",
            stage: "管理阶段 1",
            owner: "陈默",
            status: "执行中",
            statusClass: "is-current",
            version: "v1.0",
            descriptionRef: "PD-MGT-03",
            descriptionApproved: "5月18日",
            plannedAcceptance: "5月20日",
            actualAcceptance: "5月20日",
            result: "批准执行",
            lastUpdate: "更新 01",
            detail: {
                purpose: "安排设计、拆除和隐蔽工程阶段的产品、资源、时间和控制活动。",
                parent: "项目计划的阶段级展开",
                components: ["阶段产品清单", "工作包安排", "质量活动", "阶段容许偏差"],
                people: [
                    ["陈默", "项目经理", "编制并控制阶段计划"],
                    ["宋妍", "设计小组经理", "提供设计工作估算"],
                    ["赵建国", "施工小组经理", "提供施工工作估算"]
                ],
                criteria: ["覆盖本阶段全部计划产品", "工作包接口和质量活动可执行", "与项目计划和容许偏差一致"],
                history: [
                    ["第 3 周", "本阶段获准开始", "草案 → 执行中", "v0.2 → v1.0", "用于阶段日常控制"]
                ]
            }
        },
        {
            id: "MGT-004",
            name: "管理阶段 2 阶段计划",
            type: "A9 计划类型",
            source: "阶段边界管理",
            stage: "阶段边界",
            owner: "陈默",
            status: "编制中",
            statusClass: "is-planned",
            version: "v0.1",
            descriptionRef: "PD-MGT-04",
            descriptionApproved: "待批准",
            plannedAcceptance: "第 8 周",
            actualAcceptance: "空白",
            result: "待授权",
            lastUpdate: "计划 05",
            detail: {
                purpose: "安排饰面、定制安装、设备调试、家庭验收和资料移交工作。",
                parent: "项目计划的下一阶段展开",
                components: ["饰面与安装产品", "供应排产接口", "调试和验收活动", "阶段成本与时间预测"],
                people: [
                    ["陈默", "项目经理", "编制下一阶段计划"],
                    ["赵建国", "施工小组经理", "提供现场和安装安排"],
                    ["陆明远", "高级供应商", "确认供应资源和排产"]
                ],
                criteria: ["上一阶段完成条件明确", "供应和现场接口可实现", "项目管理委员会完成授权"],
                history: [
                    ["第 7 周", "准备阶段边界评审", "未建立 → 编制中", "无 → v0.1", "尚未成为批准计划"]
                ]
            }
        },
        {
            id: "DEC-001",
            name: "全屋设计方案",
            type: "专业产品",
            source: "设计工作包 WP-DES-01",
            stage: "管理阶段 1",
            owner: "宋妍",
            status: "已验收",
            statusClass: "is-done",
            version: "v1.0",
            descriptionRef: "PD-DEC-01",
            descriptionApproved: "5月20日",
            plannedAcceptance: "5月28日",
            actualAcceptance: "5月28日",
            result: "通过",
            lastUpdate: "更新 02",
            detail: {
                purpose: "把家庭需求转化为可用于施工、采购和验收的完整空间设计成果。",
                parent: "可入住住宅 HOME-025",
                components: ["平面与动线方案", "材料和色彩方案", "水电点位图", "柜体与设备接口图"],
                people: [
                    ["宋妍", "设计小组经理", "组织设计并提交受控成果"],
                    ["林悦", "高级用户", "确认适用性和家庭需求"],
                    ["王志衡", "项目保证", "核查质量程序和证据"]
                ],
                criteria: ["满足已确认的家庭需求和适老要求", "尺寸、材料和专业接口完整", "林悦按授权确认适用性"],
                history: [
                    ["第 3 周", "设计工作包获准开始", "未开始 → 开发中", "v0.1 → v0.6", "形成方案草案"],
                    ["第 4 周", "设计成果通过确认", "开发中 → 已验收", "v0.6 → v1.0", "记录验收日期和结果"]
                ]
            }
        },
        {
            id: "DEM-003",
            name: "拆除与基层交接成果",
            type: "专业产品",
            source: "拆除工作包 WP-CON-01",
            stage: "管理阶段 1",
            owner: "赵建国",
            status: "已验收",
            statusClass: "is-done",
            version: "v1.0",
            descriptionRef: "PD-DEM-03",
            descriptionApproved: "5月22日",
            plannedAcceptance: "6月1日",
            actualAcceptance: "6月1日",
            result: "通过",
            lastUpdate: "更新 01",
            detail: {
                purpose: "完成约定范围内的拆除、清运和基层检查，为隐蔽工程提供合格作业面。",
                parent: "可入住住宅 HOME-025",
                components: ["拆除完成面", "垃圾清运记录", "基层检查清单", "现场交接记录"],
                people: [
                    ["赵建国", "施工小组经理", "组织拆除和交接"],
                    ["王志衡", "项目保证", "抽查范围和检查证据"],
                    ["陈默", "项目经理", "确认工作包产品可接受"]
                ],
                criteria: ["拆除范围与设计方案一致", "无遗留危险物和结构损伤", "基层状态满足下一工序条件"],
                history: [
                    ["第 3 周", "拆除工作包开始", "未开始 → 进行中", "v0.1", "进入现场施工"],
                    ["第 4 周", "完成基层交接", "进行中 → 已验收", "v0.1 → v1.0", "交接记录归档"]
                ]
            }
        },
        {
            id: "MEP-006",
            name: "水电隐蔽工程",
            type: "专业产品",
            source: "水电工作包 WP-MEP-02",
            stage: "管理阶段 1",
            owner: "赵建国",
            status: "已验收",
            statusClass: "is-done",
            version: "v1.0",
            descriptionRef: "PD-MEP-06",
            descriptionApproved: "6月10日",
            plannedAcceptance: "7月2日",
            actualAcceptance: "7月2日",
            result: "通过",
            lastUpdate: "更新 02",
            detail: {
                purpose: "完成水路、电路和设备接口的隐蔽施工，并形成封闭前可追溯的验收证据。",
                parent: "可入住住宅 HOME-025",
                components: ["给排水管路", "强弱电线路", "设备预留接口", "隐蔽影像和测试记录"],
                people: [
                    ["赵建国", "施工小组经理", "组织施工和自检"],
                    ["王志衡", "项目保证", "核查测试和隐蔽证据"],
                    ["陈默", "项目经理", "接受工作包产品"]
                ],
                criteria: ["点位和回路符合设计方案", "压力、通断和绝缘测试合格", "封闭前影像和验收记录完整"],
                history: [
                    ["第 4 周", "水电工作包获准开始", "未开始 → 进行中", "v0.1 → v0.5", "开始现场施工"],
                    ["第 6 周", "隐蔽验收通过", "进行中 → 已验收", "v0.5 → v1.0", "记录实际验收结果"]
                ]
            }
        },
        {
            id: "WPF-011",
            name: "卫生间防水系统",
            caseHref: "product-description-waterproofing.html",
            evidenceHref: "waterproof-quality-records.html",
            type: "专业产品",
            source: "防水工作包 WP-WPF-03",
            stage: "管理阶段 1",
            owner: "赵建国",
            status: "待复验",
            statusClass: "is-current",
            version: "v1.1",
            descriptionRef: "PD-WPF-11",
            descriptionApproved: "6月12日",
            plannedAcceptance: "第 7 周",
            actualAcceptance: "空白",
            result: "整改后复验",
            lastUpdate: "更新 04",
            detail: {
                purpose: "形成满足后续铺贴和长期防渗要求的卫生间防水成果。",
                parent: "可入住住宅 HOME-025",
                components: ["基层处理", "防水涂层", "管根和阴阳角加强", "闭水试验记录"],
                people: [
                    ["赵建国", "施工小组经理", "报告失败并组织返工"],
                    ["王志衡", "项目保证", "核查处理程序和证据"],
                    ["许静", "项目支持", "维护状态、版本和参考资料"],
                    ["陈默", "项目经理", "安排再次验收"]
                ],
                criteria: ["防水范围、厚度和高度符合产品描述", "节点加强和基层处理记录完整", "闭水试验达到约定时长且无渗漏"],
                history: [
                    ["第 3 周", "纳入阶段计划", "未记录 → 未开始", "无 → v0.1", "建立产品记录"],
                    ["第 6 周", "防水施工完成", "进行中 → 待验收", "v0.6 → v1.0", "准备闭水试验"],
                    ["第 7 周", "闭水试验未通过", "待验收 → 返工中", "v1.0", "失败结果进入质量记录"],
                    ["第 7 周", "返工成果受控", "返工中 → 待复验", "v1.0 → v1.1", "实际验收日期仍为空白"]
                ]
            }
        },
        {
            id: "FIN-014",
            name: "墙地面饰面系统",
            type: "专业产品",
            source: "饰面工作包 WP-FIN-04",
            stage: "管理阶段 2",
            owner: "赵建国",
            status: "计划中",
            statusClass: "is-planned",
            version: "v0.1",
            descriptionRef: "PD-FIN-14",
            descriptionApproved: "6月20日",
            plannedAcceptance: "第 11 周",
            actualAcceptance: "空白",
            result: "未开始",
            lastUpdate: "计划 05",
            detail: {
                purpose: "形成符合设计效果、平整度和使用耐久性要求的墙面与地面饰面。",
                parent: "可入住住宅 HOME-025",
                components: ["墙面涂饰", "墙地砖铺贴", "木地板铺装", "收口和成品保护"],
                people: [
                    ["赵建国", "施工小组经理", "组织样板和现场施工"],
                    ["宋妍", "设计小组经理", "确认材料和效果"],
                    ["林悦", "高级用户", "确认可见效果和适用性"]
                ],
                criteria: ["材料型号和铺贴方向与设计一致", "平整度、空鼓和色差满足约定", "成品保护完整"],
                history: [
                    ["第 3 周", "纳入项目产品清单", "未记录 → 计划中", "无 → v0.1", "等待阶段 2 授权"]
                ]
            }
        },
        {
            id: "CAB-016",
            name: "定制柜体系统",
            type: "专业产品",
            source: "定制工作包 WP-CAB-05",
            stage: "管理阶段 2",
            owner: "陆明远",
            status: "等待复尺",
            statusClass: "is-waiting",
            version: "v0.1",
            descriptionRef: "PD-CAB-16",
            descriptionApproved: "6月18日",
            plannedAcceptance: "第 13 周",
            actualAcceptance: "空白",
            result: "未验收",
            lastUpdate: "更新 01",
            detail: {
                purpose: "交付满足收纳、人体工学和空间接口要求的厨房、卧室与玄关定制柜体。",
                parent: "可入住住宅 HOME-025",
                components: ["柜体深化图", "板材与五金", "加工成品", "现场安装和调试"],
                people: [
                    ["陆明远", "高级供应商", "协调设计、生产和供应"],
                    ["宋妍", "设计小组经理", "确认尺寸和设计接口"],
                    ["林悦", "高级用户", "确认收纳和使用需求"]
                ],
                criteria: ["尺寸与现场复尺一致", "板材和五金符合选型", "门板、抽屉和收口使用正常"],
                history: [
                    ["第 3 周", "纳入项目产品清单", "未记录 → 等待复尺", "无 → v0.1", "建立计划记录"]
                ]
            }
        },
        {
            id: "DOOR-018",
            name: "定制木门系统",
            type: "专业产品",
            source: "定制工作包 WP-DOOR-06",
            stage: "管理阶段 2",
            owner: "陆明远",
            status: "等待排产",
            statusClass: "is-waiting",
            version: "v0.1",
            descriptionRef: "PD-DOOR-18",
            descriptionApproved: "6月18日",
            plannedAcceptance: "第 14 周",
            actualAcceptance: "空白",
            result: "未验收",
            lastUpdate: "更新 03",
            detail: {
                purpose: "交付尺寸、饰面、五金和安装质量符合设计要求的室内木门系统。",
                parent: "可入住住宅 HOME-025",
                components: ["门扇与门套", "锁具和五金", "生产尺寸记录", "安装与调试记录"],
                people: [
                    ["陆明远", "高级供应商", "协调工厂排产和交付"],
                    ["赵建国", "施工小组经理", "提供现场接口日期"],
                    ["林悦", "高级用户", "确认外观和使用要求"]
                ],
                criteria: ["尺寸与复尺结果一致", "饰面和五金符合确认样板", "安装后开合、锁闭和收口正常"],
                history: [
                    ["第 3 周", "纳入项目产品清单", "未记录 → 未开始", "无 → v0.1", "建立计划记录"],
                    ["第 6 周", "供应商预测排产延迟", "未开始 → 等待排产", "v0.1 = v0.1", "风险另记为 RISK-004"]
                ]
            }
        },
        {
            id: "ELE-021",
            name: "灯具及电气设备",
            type: "专业产品",
            source: "安装工作包 WP-ELE-07",
            stage: "管理阶段 2",
            owner: "赵建国",
            status: "计划中",
            statusClass: "is-planned",
            version: "v0.1",
            descriptionRef: "PD-ELE-21",
            descriptionApproved: "6月22日",
            plannedAcceptance: "第 15 周",
            actualAcceptance: "空白",
            result: "未开始",
            lastUpdate: "计划 05",
            detail: {
                purpose: "安装并调试满足照明、插座、安全和智能控制要求的电气终端设备。",
                parent: "可入住住宅 HOME-025",
                components: ["灯具", "开关与插座", "配电标识", "通电和功能测试记录"],
                people: [
                    ["赵建国", "施工小组经理", "组织安装和测试"],
                    ["宋妍", "设计小组经理", "确认点位和照明效果"],
                    ["林悦", "高级用户", "确认操作和使用体验"]
                ],
                criteria: ["型号、数量和点位符合设计", "通电、控制和保护功能正常", "回路和配电标识完整"],
                history: [
                    ["第 3 周", "纳入项目产品清单", "未记录 → 计划中", "无 → v0.1", "等待阶段 2 授权"]
                ]
            }
        },
        {
            id: "HAN-024",
            name: "竣工资料包",
            type: "最终交付",
            source: "项目收尾安排",
            stage: "项目收尾",
            owner: "许静",
            status: "持续汇集",
            statusClass: "is-waiting",
            version: "v0.1",
            descriptionRef: "PD-HAN-24",
            descriptionApproved: "5月20日",
            plannedAcceptance: "第 16 周",
            actualAcceptance: "空白",
            result: "未移交",
            lastUpdate: "更新 01",
            detail: {
                purpose: "汇集家庭使用、维护、保修和未来改造需要的竣工与设备资料。",
                parent: "可入住住宅 HOME-025 的移交组成",
                components: ["竣工图和隐蔽影像", "设备说明与保修", "材料清单", "验收与整改记录"],
                people: [
                    ["许静", "项目支持", "汇集、编号和归档资料"],
                    ["赵建国", "施工小组经理", "提供施工和验收记录"],
                    ["陈默", "项目经理", "检查资料完整性"]
                ],
                criteria: ["资料与最终交付产品一致", "设备和材料可追溯", "家庭能够用于运行维护"],
                history: [
                    ["第 3 周", "资料管理安排启用", "未记录 → 持续汇集", "无 → v0.1", "建立资料目录"]
                ]
            }
        },
        {
            id: "HOME-025",
            name: "可入住住宅",
            caseHref: "project-product-description.html",
            type: "最终交付",
            source: "项目产品描述",
            stage: "贯穿项目",
            owner: "陈默",
            status: "开发中",
            statusClass: "is-current",
            version: "v0.3",
            descriptionRef: "PPD-HOME-25",
            descriptionApproved: "5月20日",
            plannedAcceptance: "第 16 周",
            actualAcceptance: "空白",
            result: "未最终验收",
            lastUpdate: "更新 02",
            detail: {
                purpose: "形成满足安全、功能、适用性和资料移交要求，可供家庭正式入住的完整住宅。",
                parent: "项目最终产品",
                components: ["设计与施工成果", "设备和定制产品", "家庭验收结果", "竣工资料包"],
                people: [
                    ["陈默", "项目经理", "统筹各组成产品形成最终产品"],
                    ["林悦", "高级用户", "代表家庭确认适用性"],
                    ["周诚", "项目总监", "确认项目目标并授权关闭"]
                ],
                criteria: ["全部组成产品达到已批准标准", "家庭验收和遗留项安排明确", "资料、保修和使用说明完成移交"],
                history: [
                    ["第 1 周", "确认项目最终目标", "未记录 → 规划中", "无 → v0.1", "建立项目产品定义"],
                    ["第 4 周", "设计方案通过", "规划中 → 开发中", "v0.2 → v0.3", "设计组成获得验收"]
                ]
            }
        }
    ]
};
