(function () {
    "use strict";

    const provenanceLabels = Object.freeze({
        "manual-verbatim": "手册原文",
        "project-synthesis": "项目归纳",
        "fictional-case": "教学用虚构案例",
        "pending": "待核验"
    });

    const outlineBusinessCase = {
        slug: "outline-business-case",
        name: "概要商业论证",
        englishName: "Outline business case",
        code: "A1",
        identity: {
            type: "baseline-evolution-state",
            label: "商业论证演进状态",
            isFormalManagementProduct: false,
            provenance: "manual-verbatim",
            evidence: [
                {
                    label: "商业论证生命周期",
                    href: "../chapters/ch05.html#pn-4"
                },
                {
                    label: "准备概要商业论证",
                    href: "../chapters/ch13.html#s13-4-3"
                }
            ]
        },
        parent: {
            code: "A1",
            name: "商业论证",
            href: "product.html#entity-%E5%95%86%E4%B8%9A%E8%AE%BA%E8%AF%81",
            provenance: "manual-verbatim",
            evidence: [
                {
                    label: "商业论证管理产品",
                    href: "../chapters/ch05.html#pn-23"
                }
            ]
        },
        kind: "baseline-evolution-state",
        summary: {
            text: "在项目准备阶段，以当前可得的高层次信息说明为什么值得启动，并为完整商业论证提供协定基础。",
            provenance: "project-synthesis",
            evidence: [
                {
                    label: "项目准备 §13.4.3",
                    href: "../chapters/ch13.html#s13-4-3"
                },
                {
                    label: "商业论证生命周期",
                    href: "../chapters/ch05.html#pn-4"
                }
            ]
        },
        legacyHref: "product.html#entity-%E5%95%86%E4%B8%9A%E8%AE%BA%E8%AF%81",
        definition: {
            label: "定义",
            text: "需要开展该项目的理由和所选的业务选项。",
            sourceHref: "../chapters/glossary.html#source-outline-business-case-definition",
            provenance: "manual-verbatim",
            evidence: [
                {
                    label: "术语表中的定义原文",
                    href: "../chapters/glossary.html#source-outline-business-case-definition"
                }
            ]
        },
        purpose: {
            label: "用途",
            text: "商业论证用于记录开展项目的业务理由，其基于估算成本（开发、实施以及持续递增的运行维护成本）与因相关风险而获得和抵消的预期收益的比较。其应概述衡量预期收益的方式和时间。",
            sourceHref: "../chapters/ch05.html#source-business-case-purpose",
            provenance: "manual-verbatim",
            evidence: [
                {
                    label: "第 5 章中的商业论证用途原文",
                    href: "../chapters/ch05.html#source-business-case-purpose"
                }
            ]
        },
        sourceNote: "定义采用概要商业论证术语原文；用途属于其父产品 A1 商业论证。概要商业论证是 A1 的初始演进状态，不是新增的正式管理产品。",
        composition: {
            title: "商业论证标准组成",
            kicker: "手册原文与概要阶段",
            note: "概要阶段：高层次判断；启动阶段：细化验证。",
            provenance: "project-synthesis",
            evidence: [
                {
                    label: "商业论证概括性内容原文",
                    href: "../chapters/ch05.html#source-business-case-composition"
                },
                {
                    label: "概要版本的详细程度",
                    href: "../chapters/ch13.html#s13-4-3"
                }
            ],
            items: [
                {
                    label: "内容概要",
                    text: "关键点和投资回报",
                    provenance: "manual-verbatim",
                    evidence: [{ label: "商业论证概括性内容", href: "../chapters/ch05.html#source-business-case-composition" }]
                },
                {
                    label: "理由",
                    text: "如何促成业务目标实现",
                    provenance: "manual-verbatim",
                    evidence: [{ label: "商业论证概括性内容", href: "../chapters/ch05.html#source-business-case-composition" }],
                    caseExample: {
                        text: "整体装修比反复局部维修更能解决安全和使用问题。",
                        provenance: "fictional-case",
                        evidence: [{ label: "装修案例的决策理由", href: "../cases/project-brief.html#business-case" }]
                    }
                },
                {
                    label: "业务选项",
                    text: "分析及建议",
                    provenance: "manual-verbatim",
                    evidence: [{ label: "商业论证概括性内容", href: "../chapters/ch05.html#source-business-case-composition" }],
                    caseExample: {
                        text: "比较不采取行动、局部维修和全屋受控装修，推荐全屋受控装修。",
                        provenance: "fictional-case",
                        evidence: [{ label: "装修案例的业务选项", href: "../cases/project-brief.html#business-case" }]
                    }
                },
                {
                    label: "预期收益和负收益",
                    text: "可测量的术语，包括收益容许偏差",
                    provenance: "manual-verbatim",
                    evidence: [{ label: "商业论证概括性内容", href: "../chapters/ch05.html#source-business-case-composition" }],
                    caseExample: {
                        text: "改善老人安全、家庭收纳和设备使用体验，减少重复维修和协调成本。",
                        provenance: "fictional-case",
                        evidence: [{ label: "装修案例的预期价值", href: "../cases/project-brief.html#business-case" }]
                    }
                },
                {
                    label: "可持续性目标",
                    text: "包括可持续性容许偏差",
                    provenance: "manual-verbatim",
                    evidence: [{ label: "商业论证概括性内容", href: "../chapters/ch05.html#source-business-case-composition" }]
                },
                {
                    label: "时间",
                    text: "项目执行时段和收益实现时段",
                    provenance: "manual-verbatim",
                    evidence: [{ label: "商业论证概括性内容", href: "../chapters/ch05.html#source-business-case-composition" }],
                    caseExample: {
                        text: "当前高层目标为 16 周，启动阶段继续验证详细工期。",
                        provenance: "fictional-case",
                        evidence: [{ label: "装修案例的时间目标", href: "../cases/project-brief.html#business-case" }]
                    }
                },
                {
                    label: "成本",
                    text: "概要及资金安排",
                    provenance: "manual-verbatim",
                    evidence: [{ label: "商业论证概括性内容", href: "../chapters/ch05.html#source-business-case-composition" }],
                    caseExample: {
                        text: "全屋受控装修预算上限 42 万元，详细预算在启动阶段验证。",
                        provenance: "fictional-case",
                        evidence: [{ label: "装修案例的预计投入", href: "../cases/project-brief.html#business-case" }]
                    }
                },
                {
                    label: "投资评估",
                    text: "投资评估",
                    provenance: "manual-verbatim",
                    evidence: [{ label: "商业论证概括性内容", href: "../chapters/ch05.html#source-business-case-composition" }]
                },
                {
                    label: "主要风险",
                    text: "威胁和机会、影响与应对",
                    provenance: "manual-verbatim",
                    evidence: [{ label: "商业论证概括性内容", href: "../chapters/ch05.html#source-business-case-composition" }],
                    caseExample: {
                        text: "基层未知问题、定制产品延期、需求变化和现场质量风险。",
                        provenance: "fictional-case",
                        evidence: [{ label: "装修案例的主要风险", href: "../cases/project-brief.html#business-case" }]
                    }
                },
                {
                    label: "参考资料",
                    text: "参考资料",
                    provenance: "manual-verbatim",
                    evidence: [{ label: "商业论证概括性内容", href: "../chapters/ch05.html#source-business-case-composition" }]
                }
            ]
        },
        roles: {
            title: "角色和动作",
            kicker: "项目准备与授权",
            note: "",
            provenance: "project-synthesis",
            evidence: [
                { label: "项目准备 §13.4.3", href: "../chapters/ch13.html#s13-4-3" },
                { label: "商业论证开发与批准", href: "../chapters/ch05.html#pn-9" }
            ],
            items: [
                {
                    name: "项目总监",
                    relation: "业务理由负责人",
                    actions: ["制定", "确认方向"],
                    description: "根据项目任务书和当前认识制定概要商业论证。",
                    provenance: "manual-verbatim",
                    evidence: [{ label: "项目准备 §13.4.3", href: "../chapters/ch13.html#s13-4-3" }]
                },
                {
                    name: "项目经理",
                    relation: "组织编制",
                    actions: ["咨询", "汇编"],
                    description: "组织项目总监、高级用户和高级供应商之间的咨询，并把概要商业论证纳入项目概述文件。",
                    provenance: "project-synthesis",
                    evidence: [{ label: "项目准备 §13.3 与 §13.4.3", href: "../chapters/ch13.html#s13-4-3" }]
                },
                {
                    name: "高级用户",
                    relation: "用户视角输入",
                    actions: ["咨询", "确认价值"],
                    description: "在已任命的情况下，说明项目如何支持用户需求和业务目标。",
                    provenance: "project-synthesis",
                    evidence: [{ label: "项目准备 §13.4.3", href: "../chapters/ch13.html#s13-4-3" }]
                },
                {
                    name: "高级供应商",
                    relation: "交付可行性输入",
                    actions: ["咨询", "提供约束"],
                    description: "为交付内容、资源和可行性提供供应商视角。",
                    provenance: "project-synthesis",
                    evidence: [{ label: "项目准备 §13.4.3", href: "../chapters/ch13.html#s13-4-3" }]
                },
                {
                    name: "项目管理委员会",
                    relation: "批准与授权",
                    actions: ["检查", "批准"],
                    description: "在授权项目启动时批准包含概要商业论证的项目概述文件。",
                    provenance: "manual-verbatim",
                    evidence: [{ label: "商业论证开发与批准", href: "../chapters/ch05.html#pn-9" }]
                }
            ],
            boundary: {
                title: "关键区别",
                text: "概要商业论证只需支持是否值得投入启动成本的决策；完整商业论证在项目启动流程中形成，用于授权整个项目。",
                provenance: "project-synthesis",
                evidence: [
                    { label: "商业论证生命周期", href: "../chapters/ch05.html#pn-4" },
                    { label: "项目准备的目的", href: "../chapters/ch13.html#s13-1" }
                ]
            }
        },
        lifecycle: {
            title: "从概要到完整商业论证",
            kicker: "A1 演进路径",
            note: "",
            provenance: "project-synthesis",
            evidence: [
                { label: "商业论证生命周期", href: "../chapters/ch05.html#pn-4" },
                { label: "商业论证开发与批准", href: "../chapters/ch05.html#pn-9" },
                { label: "准备概要商业论证", href: "../chapters/ch13.html#s13-4-3" }
            ],
            rhythm: [
                {
                    label: "项目准备",
                    text: "形成并批准概要版本",
                    provenance: "project-synthesis",
                    evidence: [{ label: "准备概要商业论证", href: "../chapters/ch13.html#s13-4-3" }]
                },
                {
                    label: "项目启动",
                    text: "细化为完整版本",
                    provenance: "project-synthesis",
                    evidence: [{ label: "商业论证开发与批准", href: "../chapters/ch05.html#pn-9" }]
                }
            ],
            items: [
                {
                    processCode: "触发",
                    action: "接收依据",
                    description: "项目任务书提供形成初始业务理由所需的信息。",
                    provenance: "project-synthesis",
                    evidence: [{ label: "商业论证生命周期", href: "../chapters/ch05.html#pn-4" }]
                },
                {
                    processCode: "SU",
                    action: "制定概要版本",
                    description: "根据当前可得信息形成概要商业论证，并纳入项目概述文件。",
                    provenance: "project-synthesis",
                    evidence: [{ label: "准备概要商业论证", href: "../chapters/ch13.html#s13-4-3" }]
                },
                {
                    processCode: "DP",
                    action: "批准启动",
                    description: "项目管理委员会批准项目概述文件，确认业务理由足以授权项目启动。",
                    provenance: "project-synthesis",
                    evidence: [{ label: "商业论证开发与批准", href: "../chapters/ch05.html#pn-9" }]
                },
                {
                    processCode: "IP",
                    action: "细化完整版本",
                    description: "随着计划、成本、风险和收益信息更加清晰，概要商业论证发展为完整商业论证。",
                    provenance: "project-synthesis",
                    evidence: [{ label: "商业论证生命周期", href: "../chapters/ch05.html#pn-4" }]
                }
            ]
        },
        caseView: {
            identity: {
                label: "住宅装修教学案例"
            },
            summary: {
                text: "以住宅全屋装修项目的已批准项目概述文件为依据，说明家庭为什么选择全屋受控装修，并批准投入项目启动阶段。",
                provenance: "fictional-case",
                evidence: [
                    {
                        label: "住宅装修项目概要商业论证",
                        href: "../cases/project-brief.html#business-case"
                    }
                ]
            },
            definition: {
                label: "项目情境",
                text: "住宅连续使用约 12 年，已出现水电老化、湿区安全和空间使用问题。家庭需要判断继续维持、局部维修，还是开展一次受控的全屋装修。",
                provenance: "fictional-case"
            },
            purpose: {
                label: "本次决策",
                text: "比较不采取行动、局部维修和全屋受控装修三个选项，确认全屋受控装修是否值得投入启动成本，并授权继续完善计划、预算、风险和完整商业论证。",
                provenance: "fictional-case"
            },
            sourceNote: "教学用虚构案例：来源：住宅全屋装修项目概述文件。详细预算、工期及风险评估待启动阶段验证。",
            composition: {
                title: "案例中的十项具体内容",
                kicker: "理论字段与案例值一一对应",
                note: "依据项目概述文件；详细数据待验证。",
                provenance: "fictional-case",
                evidence: [
                    {
                        label: "项目概述文件中的概要商业论证",
                        href: "../cases/project-brief.html#business-case"
                    }
                ],
                items: [
                    {
                        label: "内容概要",
                        text: "家庭目标已经一致。建议在 42 万元成本边界和 16 周时间目标内实施全屋受控装修，解决安全、功能和长期维护问题。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "理由",
                        text: "整体装修比反复局部维修更能同时解决水电老化、湿区安全、家庭收纳和空间使用问题。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "业务选项",
                        text: "不采取行动为 0 元但问题继续累积；局部维修约 12 至 18 万元但无法解决整体问题；推荐上限 42 万元的全屋受控装修。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "预期收益和负收益",
                        text: "预期减少重复维修和家庭协调成本，改善老人安全、收纳和设备使用体验，提高维护可追溯性。负收益是一次性投入较高，装修期间需要暂住并承担组织与供应风险。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "可持续性目标",
                        text: "启动阶段待验证：补充材料耐用性、维护便利性及相关可持续性目标和容许偏差。",
                        provenance: "pending"
                    },
                    {
                        label: "时间",
                        text: "目标工期为 16 周，从现场交底到家庭验收和资料移交，不包含前期搬迁准备；最多延后 1 周。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "成本",
                        text: "项目层成本容许边界为 42 万元，正式预算和采购提前期在启动阶段细化。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "投资评估",
                        text: "当前仅完成高层次定性判断：整体装修能够覆盖多类问题并减少重复投入。详细成本收益比较和完整投资评估在启动阶段完成。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "主要风险",
                        text: "拆除后发现未知基层问题、定制产品延期、家庭需求变化，以及现场质量未达到验收标准。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "参考资料",
                        text: "住宅全屋装修项目概述文件 v1.0，包括项目定义、项目产品描述、项目方法和项目组织。",
                        provenance: "fictional-case"
                    }
                ]
            },
            roles: {
                title: "案例人物和实际动作",
                kicker: "现实身份与项目角色",
                note: "",
                provenance: "fictional-case",
                evidence: [
                    {
                        label: "项目概述文件中的项目组织",
                        href: "../cases/project-brief.html#organization"
                    }
                ],
                items: [
                    {
                        name: "周诚 · 业主",
                        relation: "项目总监",
                        actions: ["确认理由", "批准启动"],
                        description: "确认业务理由和 42 万元成本边界，批准项目进入启动阶段。",
                        provenance: "fictional-case"
                    },
                    {
                        name: "林悦 · 业主",
                        relation: "高级用户",
                        actions: ["汇总需求", "确认价值"],
                        description: "代表家庭说明安全、收纳和使用需求，并确认预期使用价值。",
                        provenance: "fictional-case"
                    },
                    {
                        name: "陆明远 · 装修公司负责人",
                        relation: "高级供应商",
                        actions: ["评估可行性", "提供约束"],
                        description: "从专业资源、技术方法和供应能力角度判断交付可行性。",
                        provenance: "fictional-case"
                    },
                    {
                        name: "陈默 · 独立装修项目经理",
                        relation: "项目经理",
                        actions: ["组织咨询", "汇编文件"],
                        description: "汇总三个业务选项、成本、时间和风险信息，形成项目概述文件并提出启动请求。",
                        provenance: "fictional-case"
                    },
                    {
                        name: "周诚、林悦、陆明远",
                        relation: "项目管理委员会",
                        actions: ["共同检查", "形成授权"],
                        description: "分别代表业务、用户和供应方利益检查概要商业论证；由项目总监作出启动授权。",
                        provenance: "fictional-case"
                    }
                ],
                boundary: {
                    title: "当前授权边界",
                    text: "本次批准只授权投入项目启动阶段。详细预算、完整风险评估、阶段计划和质量规格仍需验证，不能把概要判断当成完整商业论证。",
                    provenance: "fictional-case"
                }
            },
            lifecycle: {
                title: "案例中的形成与演进记录",
                kicker: "从初始理由到启动授权",
                note: "项目概述文件 v1.0 已形成；完整论证待细化。",
                provenance: "fictional-case",
                evidence: [
                    {
                        label: "项目概述文件的决策状态",
                        href: "../cases/project-brief.html#business-case"
                    }
                ],
                rhythm: [
                    {
                        label: "项目准备",
                        text: "v1.0 已编制并批准"
                    },
                    {
                        label: "项目启动",
                        text: "详细数据待补充"
                    }
                ],
                items: [
                    {
                        processCode: "触发",
                        action: "识别装修需要",
                        description: "家庭确认住宅存在老化、安全和空间使用问题，需要比较可行的处理方式。",
                        provenance: "fictional-case"
                    },
                    {
                        processCode: "SU",
                        action: "比较三个选项",
                        description: "陈默组织比较不采取行动、局部维修和全屋受控装修，并把建议写入项目概述文件。",
                        provenance: "fictional-case"
                    },
                    {
                        processCode: "DP",
                        action: "批准进入启动",
                        description: "周诚确认理由、预算和工期足以支持进一步规划，于第 1 周批准项目启动。",
                        provenance: "fictional-case"
                    },
                    {
                        processCode: "IP",
                        action: "细化完整论证",
                        description: "待完成详细预算、采购提前期、阶段计划、完整风险评估和质量规格，形成完整商业论证。",
                        provenance: "pending"
                    }
                ]
            },
            caseEntry: {
                title: "住宅全屋装修项目概述文件",
                description: "查看案例原文件中的选项比较、预期价值、主要风险和启动阶段待验证事项。",
                href: "../cases/project-brief.html#business-case",
                label: "打开完整项目概述文件",
                provenance: "fictional-case"
            }
        },
        caseEntry: {
            title: "住宅全屋装修项目概述文件",
            description: "案例以不采取行动、局部维修和全屋受控装修三个选项，说明为什么值得进入项目启动阶段。",
            href: "../cases/project-brief.html#business-case",
            label: "打开概要商业论证关联案例",
            provenance: "fictional-case",
            evidence: [
                {
                    label: "住宅装修项目概要商业论证",
                    href: "../cases/project-brief.html#business-case"
                }
            ]
        }
    };

    const fullBusinessCase = {
        slug: "full-business-case",
        name: "完整商业论证",
        englishName: "Full business case",
        code: "A1",
        identity: {
            type: "baseline-evolution-state",
            label: "商业论证演进状态",
            isFormalManagementProduct: false,
            provenance: "manual-verbatim",
            evidence: [
                { label: "商业论证生命周期", href: "../chapters/ch05.html#source-full-business-case-definition" },
                { label: "准备完整的商业论证", href: "../chapters/ch15.html#pn-10" }
            ]
        },
        parent: {
            code: "A1",
            name: "商业论证",
            href: "product.html#entity-%E5%95%86%E4%B8%9A%E8%AE%BA%E8%AF%81",
            provenance: "manual-verbatim",
            evidence: [{ label: "商业论证管理产品", href: "../chapters/ch05.html#pn-23" }]
        },
        kind: "baseline-evolution-state",
        summary: {
            text: "在项目启动阶段，使用项目计划的估算时间和成本、项目记录单中的总体风险及更详细的信息增强概要商业论证，为授权整个项目和持续检查可行性提供依据。",
            provenance: "project-synthesis",
            evidence: [
                { label: "完整商业论证的形成", href: "../chapters/ch15.html#source-full-business-case-preparation" },
                { label: "完整商业论证的授权用途", href: "../chapters/ch15.html#pn-10" }
            ]
        },
        legacyHref: "product.html#entity-%E5%95%86%E4%B8%9A%E8%AE%BA%E8%AF%81",
        definition: {
            label: "定义",
            text: "随着项目计划更加详细、信息更加清晰，概要商业论证将发展为更详尽的商业论证。PRINCE2 使用“完整商业论证”这个术语来描述这种经过增强的商业论证。",
            sourceHref: "../chapters/ch05.html#source-full-business-case-definition",
            provenance: "manual-verbatim",
            evidence: [{ label: "完整商业论证的原文说明", href: "../chapters/ch05.html#source-full-business-case-definition" }]
        },
        purpose: {
            label: "用途",
            text: "商业论证用于记录开展项目的业务理由，其基于估算成本（开发、实施以及持续递增的运行维护成本）与因相关风险而获得和抵消的预期收益的比较。其应概述衡量预期收益的方式和时间。",
            sourceHref: "../chapters/ch05.html#source-business-case-purpose",
            provenance: "manual-verbatim",
            evidence: [{ label: "第 5 章中的商业论证用途原文", href: "../chapters/ch05.html#source-business-case-purpose" }]
        },
        sourceNote: "定义采用第 5 章对完整商业论证演进状态的原文说明；用途和十项组成属于其父产品 A1 商业论证。完整商业论证不是新增的正式管理产品。",
        composition: {
            title: "完整商业论证的十项内容",
            kicker: "手册原文与完整阶段",
            note: "依据：项目计划、项目记录单及启动信息。",
            provenance: "project-synthesis",
            evidence: [
                { label: "商业论证概括性内容原文", href: "../chapters/ch05.html#source-business-case-composition" },
                { label: "完整版本所需的估算和风险", href: "../chapters/ch15.html#source-full-business-case-preparation" }
            ],
            items: [
                { label: "内容概要", text: "关键点和投资回报", provenance: "manual-verbatim" },
                { label: "理由", text: "如何促成业务目标实现", provenance: "manual-verbatim" },
                { label: "业务选项", text: "分析及建议", provenance: "manual-verbatim" },
                { label: "预期收益和负收益", text: "可测量的术语，包括收益容许偏差", provenance: "manual-verbatim" },
                { label: "可持续性目标", text: "包括可持续性容许偏差", provenance: "manual-verbatim" },
                { label: "时间", text: "项目执行时段和收益实现时段", provenance: "manual-verbatim" },
                { label: "成本", text: "概要及资金安排", provenance: "manual-verbatim" },
                { label: "投资评估", text: "比较开发、运营和维护成本与一段时间内的收益价值，并考虑收益、成本和风险之间的关系。", provenance: "project-synthesis" },
                { label: "主要风险", text: "威胁和机会、影响与应对", provenance: "manual-verbatim" },
                { label: "参考资料", text: "参考资料", provenance: "manual-verbatim" }
            ]
        },
        roles: {
            title: "角色和动作",
            kicker: "开发、授权与持续维护",
            note: "",
            provenance: "project-synthesis",
            evidence: [
                { label: "准备完整的商业论证", href: "../chapters/ch15.html#pn-10" },
                { label: "商业论证关键职责", href: "../chapters/ch05.html#pn-24" }
            ],
            items: [
                {
                    name: "业务层",
                    relation: "标准与容许偏差",
                    actions: ["定义标准", "设置项目容许偏差"],
                    description: "定义商业论证所需标准，并设置项目层面的收益容许偏差。",
                    provenance: "manual-verbatim"
                },
                {
                    name: "项目总监",
                    relation: "最终问责",
                    actions: ["监督开发", "确保资金", "确认持续合理"],
                    description: "在项目开展过程中对商业论证问责，确保项目可取、可行且可实现。",
                    provenance: "manual-verbatim"
                },
                {
                    name: "高级用户",
                    relation: "成果和收益",
                    actions: ["指定收益", "确认收益"],
                    description: "对所需成果和收益问责，并确认预期收益已经或能够实现。",
                    provenance: "manual-verbatim"
                },
                {
                    name: "高级供应商",
                    relation: "交付可行性",
                    actions: ["确认成本", "确认可行性"],
                    description: "确认能够在预期成本范围内交付所要求的产品。",
                    provenance: "manual-verbatim"
                },
                {
                    name: "项目经理",
                    relation: "开发与更新",
                    actions: ["开发", "检查", "更新"],
                    description: "根据项目总监的授权开发商业论证，在阶段结束时评估和更新，并检查风险和问题的影响。",
                    provenance: "manual-verbatim"
                },
                {
                    name: "项目保证",
                    relation: "独立检查",
                    actions: ["检查", "监视", "提供保证"],
                    description: "检查商业论证是否符合业务目标，并监视财务状况、风险和变更的影响。",
                    provenance: "manual-verbatim"
                },
                {
                    name: "项目支持",
                    relation: "基线控制",
                    actions: ["维护基线", "执行变更控制"],
                    description: "维护商业论证基线和变更控制，并报告可能影响商业论证的产品变更。",
                    provenance: "manual-verbatim"
                }
            ],
            boundary: {
                title: "授权边界",
                text: "项目总监对商业论证持续问责；项目经理负责开发和更新；项目保证提供独立检查；项目管理委员会在授权项目及后续关键决策点检查商业论证。",
                provenance: "project-synthesis"
            }
        },
        lifecycle: {
            title: "开发、检查、维护与确认",
            kicker: "贯穿项目生命周期",
            note: "",
            provenance: "project-synthesis",
            evidence: [
                { label: "商业论证管理技术", href: "../chapters/ch05.html#pn-8" },
                { label: "准备完整的商业论证", href: "../chapters/ch15.html#pn-10" }
            ],
            rhythm: [
                { label: "开发", text: "获取详细信息并完成投资评估" },
                { label: "检查", text: "判断项目是否仍然值得" },
                { label: "维护", text: "用实际进展和预测及时更新" },
                { label: "确认", text: "验证收益已经或将要实现" }
            ],
            items: [
                { processCode: "SU", action: "形成概要依据", description: "项目概述文件中的概要商业论证提供初始业务理由。", provenance: "project-synthesis" },
                { processCode: "IP", action: "开发完整版本", description: "使用项目计划的时间和成本估算、总体风险及其他详细信息增强商业论证。", provenance: "manual-verbatim" },
                { processCode: "DP", action: "授权整个项目", description: "项目管理委员会检查完整商业论证，并在授权项目时予以批准。", provenance: "manual-verbatim" },
                { processCode: "SB", action: "检查并维护", description: "在阶段边界使用实际进展和最新预测更新商业论证，决定是否授权下一阶段。", provenance: "project-synthesis" },
                { processCode: "CP / 项目后", action: "确认收益", description: "在项目收尾及项目后收益评审中，比较实际成果和收益与预测值。", provenance: "project-synthesis" }
            ]
        },
        caseView: {
            identity: { label: "住宅装修教学案例" },
            summary: {
                text: "第 2 至 3 周编制完整商业论证 v1.0 拟稿，按 16 周目标和 42 万元预算细化选项、收益及风险；本稿批准凭据待补。",
                provenance: "fictional-case",
                evidence: [{ label: "住宅装修项目启动记录", href: "../cases/renovation.html#full-business-case" }]
            },
            definition: {
                label: "项目状态",
                text: "完整商业论证 v1.0 拟稿已形成，包含 16 周目标、42 万元预算分配、收益指标及风险安排；批准状态待确认。",
                provenance: "fictional-case"
            },
            purpose: {
                label: "本次决策",
                text: "判断全屋受控装修在详细信息下是否仍然可取、可行且可实现，并为周诚代表项目管理委员会授权整个项目提供依据。",
                provenance: "fictional-case"
            },
            sourceNote: "教学用虚构案例：细分预算和量化收益指标为项目约定值，非 PRINCE2 标准值。",
            composition: {
                title: "案例中的完整商业论证",
                kicker: "十项理论字段与详细案例值",
                note: "v1.0 拟稿：第 2 至 3 周；批准待确认；计划复查：第 8 周。",
                provenance: "fictional-case",
                evidence: [
                    { label: "项目启动时间线", href: "../cases/renovation.html#full-business-case" },
                    { label: "概要商业论证来源", href: "../cases/project-brief.html#business-case" },
                    { label: "项目产品质量与维护要求", href: "../cases/project-product-description.html" }
                ],
                items: [
                    {
                        label: "内容概要",
                        text: "推荐全屋受控装修。以 42 万元为成本上限、16 周为目标工期，交付适合三代家庭长期、安全居住且资料完整的住宅；项目在当前详细程度下可取、可行且可实现。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "理由",
                        text: "一次受控的整体更新能够同时处理水电老化、湿区安全、空间动线、收纳和维护追溯问题，避免反复局部施工造成的重复协调与投入。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "业务选项",
                        text: "不采取行动为 0 元但风险继续累积；局部维修约 12 至 18 万元，仅处理眼前问题；全屋受控装修上限 42 万元，可同时改善安全、功能、耐久和资料完整性，因此保持推荐。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "预期收益和负收益",
                        text: "收益指标：关键安全测试通过率 100%；家庭联合验收完成；关键材料、设备和隐蔽工程记录可追溯率 100%；入住后 1 个月和 6 个月复查使用与维护情况。负收益包括装修期间暂住、一次性资金占用和家庭决策时间。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "可持续性目标",
                        text: "优先选择耐用、可维护方案；检修口、阀门、配电标识和可更换部件必须可访问；保修和维护资料完整移交。关键维护可达性不接受降级。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "时间",
                        text: "总目标 16 周，从现场交底到家庭验收和资料移交，不含搬迁准备；项目层最多延后 1 周。第 2 至 3 周完成启动，第 8 周进行阶段边界复查，第 16 周计划收尾。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "成本",
                        text: "成本上限 42 万元。教学案例基准分配：设计与项目管理 4 万元、拆除和基层 6 万元、水电与防水 9 万元、饰面 8 万元、定制与安装 10 万元、风险余量 5 万元。任何预测突破均需升级决策。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "投资评估",
                        text: "本项目不以产生现金收入为目标，采用全生命周期成本与使用价值比较。相较局部维修，全屋方案投入更高，但覆盖问题更完整，并减少重复施工、协调和未来维护的不确定性；42 万元上限是继续投资的硬边界。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "主要风险",
                        text: "未知基层问题可能消耗风险余量；定制木门排产可能影响接口日期；家庭需求变化可能造成返工；防水等关键质量活动失败会推迟验收。应对包括预留余量、提前锁定排产、变更控制和失败后复验。",
                        provenance: "fictional-case"
                    },
                    {
                        label: "参考资料",
                        text: "项目概述文件 v1.0、项目计划、项目产品描述、产品登记单、风险登记单、质量登记单、收益管理方法和可持续性管理方法。",
                        provenance: "fictional-case"
                    }
                ]
            },
            roles: {
                title: "案例人物和实际动作",
                kicker: "现实身份与项目角色",
                note: "",
                provenance: "fictional-case",
                evidence: [
                    { label: "住宅装修人物与项目角色", href: "../cases/renovation.html#people-title" },
                    { label: "项目概述文件中的组织", href: "../cases/project-brief.html#organization" }
                ],
                items: [
                    { name: "家庭投资授权层", relation: "业务层", actions: ["确认资金边界", "设置项目容许偏差"], description: "确认 42 万元资金上限和最多延后 1 周的项目时间边界。", provenance: "fictional-case" },
                    { name: "周诚 · 业主", relation: "项目总监", actions: ["监督共创", "确保资金", "批准项目"], description: "对完整商业论证和项目成功持续问责，确认项目仍值得整体投入。", provenance: "fictional-case" },
                    { name: "林悦 · 业主", relation: "高级用户", actions: ["定义收益", "确认衡量方法"], description: "代表家庭确定安全、适用性、收纳和维护价值，并在入住后参与收益复查。", provenance: "fictional-case" },
                    { name: "陆明远 · 装修公司负责人", relation: "高级供应商", actions: ["确认成本", "确认交付可行性"], description: "确认专业资源、技术路线和供应能力能够支持 16 周交付目标。", provenance: "fictional-case" },
                    { name: "陈默 · 独立装修项目经理", relation: "项目经理", actions: ["开发", "检查", "更新"], description: "整合项目计划、成本、风险和质量信息形成 v1.0，并在阶段边界更新预测。", provenance: "fictional-case" },
                    { name: "王志衡 · 第三方监理", relation: "项目保证", actions: ["独立检查", "监视风险和质量"], description: "检查成本、工期和质量证据是否支持业务理由，不替代项目经理作决策。", provenance: "fictional-case" },
                    { name: "许静 · 资料与协调专员", relation: "项目支持", actions: ["维护基线", "保留版本"], description: "维护商业论证版本和相关证据链接，报告可能影响业务理由的产品变化。", provenance: "fictional-case" }
                ],
                boundary: {
                    title: "当前责任边界",
                    text: "周诚对业务理由问责，陈默负责开发和更新，王志衡独立检查，许静维护基线。家庭成员提供需求和收益判断，但不因此承担文件日常维护责任。",
                    provenance: "fictional-case"
                }
            },
            lifecycle: {
                title: "案例中的开发与持续检查",
                kicker: "v1.0 拟稿与后续决策点",
                note: "",
                provenance: "fictional-case",
                evidence: [{ label: "住宅装修项目虚拟进展", href: "../cases/renovation.html#full-business-case" }],
                rhythm: [
                    { label: "开发", text: "第 2 至 3 周形成 v1.0" },
                    { label: "检查", text: "第 8 周阶段边界" },
                    { label: "维护", text: "风险或预测变化时更新" },
                    { label: "确认", text: "第 16 周及入住后复查" }
                ],
                items: [
                    { processCode: "SU", action: "继承概要依据", description: "第 1 周比较三个业务选项，形成 42 万元和 16 周的高层边界。", provenance: "fictional-case" },
                    { processCode: "IP", action: "形成 v1.0 拟稿", description: "第 2 至 3 周汇总计划、成本、收益指标、风险应对和维护控制；本稿批准凭据待补。", provenance: "fictional-case" },
                    { processCode: "DP", action: "审查与授权", description: "MGT-002 记载项目启动文件 v1.0 的历史授权；本商业论证拟稿的批准状态待确认。", provenance: "fictional-case" },
                    { processCode: "SB", action: "阶段边界复查", description: "第 8 周计划结合防水复验、木门排产、实际成本和剩余风险判断是否继续。", provenance: "fictional-case" },
                    { processCode: "CP / 项目后", action: "确认使用价值", description: "第 16 周检查交付和收益实现概率，并在入住后 1 个月和 6 个月复查安全、使用和维护情况。", provenance: "fictional-case" }
                ]
            },
            caseEntry: {
                title: "住宅装修项目启动记录",
                description: "查看第 2 至 3 周如何建立项目基准，并从该时间线进入完整商业论证案例。",
                href: "../cases/renovation.html#full-business-case",
                label: "打开项目启动时间线",
                provenance: "fictional-case"
            }
        },
        caseEntry: {
            title: "住宅装修完整商业论证案例",
            description: "切换到同页案例模式，查看十项理论字段在项目启动阶段形成的详细案例值。",
            href: "product-detail-v2.html?entry=full-business-case&mode=case",
            label: "查看完整商业论证案例",
            provenance: "fictional-case"
        }
    };

    const productRegister = {
        slug: "product-register",
        name: "产品登记单",
        englishName: "Product register",
        code: "A13",
        identity: {
            type: "record-component",
            label: "项目记录单组成项",
            isFormalManagementProduct: false,
            provenance: "manual-verbatim",
            evidence: [
                {
                    label: "质量实践中的产品登记单定义",
                    href: "../chapters/ch08.html#source-product-register-definition"
                }
            ]
        },
        parent: {
            code: "A13",
            name: "项目记录单",
            href: "product.html#entity-%E9%A1%B9%E7%9B%AE%E8%AE%B0%E5%BD%95%E5%8D%95",
            provenance: "manual-verbatim",
            evidence: [
                {
                    label: "质量实践中的产品登记单定义",
                    href: "../chapters/ch08.html#source-product-register-definition"
                }
            ]
        },
        kind: "record-component",
        summary: {
            text: "跟踪项目所需产品的状态、版本、关键日期和验收结果。",
            provenance: "project-synthesis",
            evidence: [
                {
                    label: "现有产品登记单条目",
                    href: "product.html#entity-%E4%BA%A7%E5%93%81%E7%99%BB%E8%AE%B0%E5%8D%95"
                }
            ]
        },
        legacyHref: "product.html#entity-%E4%BA%A7%E5%93%81%E7%99%BB%E8%AE%B0%E5%8D%95",
        definition: {
            label: "定义",
            text: "项目记录单的一个组件，用于标识项目要交付的产品并记录其验收情况。",
            sourceHref: "../chapters/ch08.html#source-product-register-definition",
            provenance: "manual-verbatim",
            evidence: [
                {
                    label: "质量实践中的定义原文",
                    href: "../chapters/ch08.html#source-product-register-definition"
                }
            ]
        },
        purpose: {
            label: "用途",
            text: "产品登记单的目的是列出计划所需的所有产品以及这些产品的状态。",
            sourceHref: "../chapters/appendix_a.html#source-product-register-purpose",
            provenance: "manual-verbatim",
            evidence: [
                {
                    label: "附录 A 中的用途原文",
                    href: "../chapters/appendix_a.html#source-product-register-purpose"
                }
            ]
        },
        sourceNote: "定义、用途和组成内容沿用手册原文。角色和生命周期按证据分别标注为手册原文或项目归纳。",
        composition: {
            title: "组成内容",
            kicker: "手册原文",
            note: "",
            provenance: "manual-verbatim",
            evidence: [
                {
                    label: "质量实践 §8.5",
                    href: "../chapters/ch08.html#pn-31"
                },
                {
                    label: "附录 A 产品登记单",
                    href: "../chapters/appendix_a.html#source-product-register-purpose"
                }
            ],
            items: [
                {
                    label: "产品标识符",
                    text: "产品的标识符",
                    provenance: "manual-verbatim",
                    evidence: [
                        {
                            label: "质量实践 §8.5",
                            href: "../chapters/ch08.html#pn-31"
                        }
                    ],
                    caseExample: {
                        text: "DEC-001 · 全屋设计方案",
                        provenance: "fictional-case",
                        evidence: [
                            {
                                label: "现有产品登记单虚构案例",
                                href: "product.html#entity-%E4%BA%A7%E5%93%81%E7%99%BB%E8%AE%B0%E5%8D%95"
                            }
                        ]
                    }
                },
                {
                    label: "日期",
                    text: "产品描述批准日期和产品验收日期",
                    provenance: "manual-verbatim",
                    evidence: [
                        {
                            label: "质量实践 §8.5",
                            href: "../chapters/ch08.html#pn-31"
                        }
                    ],
                    caseExample: {
                        text: "描述批准 5月20日 · 计划验收 5月28日",
                        provenance: "fictional-case",
                        evidence: [
                            {
                                label: "现有产品登记单虚构案例",
                                href: "product.html#entity-%E4%BA%A7%E5%93%81%E7%99%BB%E8%AE%B0%E5%8D%95"
                            }
                        ]
                    }
                },
                {
                    label: "状态",
                    text: "产品状态（如开发中或已验收）和当前版本号",
                    provenance: "manual-verbatim",
                    evidence: [
                        {
                            label: "质量实践 §8.5",
                            href: "../chapters/ch08.html#pn-31"
                        }
                    ],
                    caseExample: {
                        text: "已验收 · v1.0",
                        provenance: "fictional-case",
                        evidence: [
                            {
                                label: "现有产品登记单虚构案例",
                                href: "product.html#entity-%E4%BA%A7%E5%93%81%E7%99%BB%E8%AE%B0%E5%8D%95"
                            }
                        ]
                    }
                },
                {
                    label: "参考资料",
                    text: "关联产品描述的链接",
                    provenance: "manual-verbatim",
                    evidence: [
                        {
                            label: "质量实践 §8.5",
                            href: "../chapters/ch08.html#pn-31"
                        }
                    ],
                    caseExample: {
                        text: "关联《全屋设计方案产品描述》",
                        provenance: "fictional-case",
                        evidence: [
                            {
                                label: "现有产品登记单虚构案例",
                                href: "product.html#entity-%E4%BA%A7%E5%93%81%E7%99%BB%E8%AE%B0%E5%8D%95"
                            }
                        ]
                    }
                }
            ]
        },
        roles: {
            title: "角色和动作",
            kicker: "原文与流程证据",
            note: "",
            provenance: "project-synthesis",
            evidence: [
                {
                    label: "质量实践 §8.6",
                    href: "../chapters/ch08.html#pn-32"
                },
                {
                    label: "项目启动中的创建职责",
                    href: "../chapters/ch15.html#pn-9"
                }
            ],
            items: [
                {
                    name: "项目支持",
                    relation: "直接维护",
                    actions: ["准备", "维护"],
                    description: "准备和维护产品登记单。",
                    provenance: "manual-verbatim",
                    evidence: [
                        {
                            label: "质量实践 §8.6",
                            href: "../chapters/ch08.html#pn-32"
                        }
                    ]
                },
                {
                    name: "项目经理",
                    relation: "管理与使用",
                    actions: ["创建", "检查", "使用"],
                    description: "组织创建或更新记录，用状态数据审查进展、确认交付并处理偏差。",
                    provenance: "project-synthesis",
                    evidence: [
                        {
                            label: "项目启动 §9",
                            href: "../chapters/ch15.html#pn-9"
                        },
                        {
                            label: "进展 §6",
                            href: "../chapters/ch11.html#pn-6"
                        }
                    ]
                },
                {
                    name: "小组经理",
                    relation: "状态提供",
                    actions: ["更新", "报告"],
                    description: "在工作包交付期间提供产品状态、版本和批准信息。",
                    provenance: "project-synthesis",
                    evidence: [
                        {
                            label: "产品交付管理 §17.4.2",
                            href: "../chapters/ch17.html#pn-17.4.2"
                        }
                    ]
                },
                {
                    name: "批准或验收职权组织",
                    relation: "结果被记录",
                    actions: ["批准", "验收"],
                    description: "批准产品描述或验收产品，相关日期与结果进入产品登记单。",
                    provenance: "project-synthesis",
                    evidence: [
                        {
                            label: "质量实践 §8.2.1.5",
                            href: "../chapters/ch08.html#pn-10"
                        },
                        {
                            label: "产品登记单概括性内容",
                            href: "../chapters/appendix_a.html#source-product-register-purpose"
                        }
                    ]
                }
            ],
            boundary: {
                title: "关键区别",
                text: "维护登记单，与批准或验收登记单中所记录的产品，是两种不同关系。批准者和验收者提供被记录的结果，不承担登记单的日常维护。",
                provenance: "project-synthesis",
                evidence: [
                    {
                        label: "质量实践中的维护职责",
                        href: "../chapters/ch08.html#pn-32"
                    },
                    {
                        label: "批准和验收信息的记录",
                        href: "../chapters/appendix_a.html#source-product-register-purpose"
                    }
                ]
            }
        },
        lifecycle: {
            title: "产品登记单生命周期",
            kicker: "流程使用职责",
            note: "",
            provenance: "project-synthesis",
            evidence: [
                {
                    label: "创建：项目启动 §9",
                    href: "../chapters/ch15.html#pn-9"
                },
                {
                    label: "增补：阶段边界管理 §6",
                    href: "../chapters/ch18.html#pn-6"
                },
                {
                    label: "更新：产品交付管理 §17.4.2",
                    href: "../chapters/ch17.html#pn-17.4.2"
                },
                {
                    label: "更新：阶段控制 §8",
                    href: "../chapters/ch16.html#pn-8"
                },
                {
                    label: "核对：阶段边界管理 §16",
                    href: "../chapters/ch18.html#pn-16"
                },
                {
                    label: "关闭：项目收尾 §14",
                    href: "../chapters/ch19.html#pn-14"
                }
            ],
            rhythm: [
                {
                    label: "项目启动",
                    text: "创建一次",
                    provenance: "project-synthesis",
                    evidence: [
                        {
                            label: "项目启动 §9",
                            href: "../chapters/ch15.html#pn-9"
                        }
                    ]
                },
                {
                    label: "每个管理阶段",
                    text: "增补、更新、核对",
                    provenance: "project-synthesis",
                    evidence: [
                        {
                            label: "阶段边界管理 §6",
                            href: "../chapters/ch18.html#pn-6"
                        },
                        {
                            label: "产品交付管理 §17.4.2",
                            href: "../chapters/ch17.html#pn-17.4.2"
                        },
                        {
                            label: "阶段控制 §8",
                            href: "../chapters/ch16.html#pn-8"
                        },
                        {
                            label: "阶段边界管理 §16",
                            href: "../chapters/ch18.html#pn-16"
                        }
                    ]
                },
                {
                    label: "项目收尾",
                    text: "关闭一次",
                    provenance: "project-synthesis",
                    evidence: [
                        {
                            label: "项目收尾 §14",
                            href: "../chapters/ch19.html#pn-14"
                        }
                    ]
                }
            ],
            items: [
                {
                    processCode: "IP",
                    action: "创建",
                    description: "根据项目计划和产品分解，建立产品登记单的初始记录。",
                    provenance: "project-synthesis",
                    evidence: [
                        {
                            label: "项目启动 §9",
                            href: "../chapters/ch15.html#pn-9"
                        }
                    ]
                },
                {
                    processCode: "SB",
                    action: "增补",
                    anchor: "SB-add",
                    description: "在下一阶段开始前，加入阶段计划或例外计划要求的产品。",
                    provenance: "project-synthesis",
                    evidence: [
                        {
                            label: "阶段边界管理 §6",
                            href: "../chapters/ch18.html#pn-6"
                        }
                    ]
                },
                {
                    processCode: "MP · CS",
                    action: "更新",
                    description: "在阶段执行期间，更新状态、版本、批准和验收信息。",
                    provenance: "project-synthesis",
                    evidence: [
                        {
                            label: "产品交付管理 §17.4.2",
                            href: "../chapters/ch17.html#pn-17.4.2"
                        },
                        {
                            label: "阶段控制 §8",
                            href: "../chapters/ch16.html#pn-8"
                        }
                    ]
                },
                {
                    processCode: "SB",
                    action: "核对",
                    anchor: "SB-review",
                    description: "在阶段结束时确认计划产品是否交付，并为阶段竣工报告提供输入。",
                    provenance: "project-synthesis",
                    evidence: [
                        {
                            label: "阶段边界管理 §16",
                            href: "../chapters/ch18.html#pn-16"
                        }
                    ]
                },
                {
                    processCode: "CP",
                    action: "关闭",
                    description: "确认最终产品已经交付，为项目竣工报告提供输入并关闭登记单。",
                    provenance: "project-synthesis",
                    evidence: [
                        {
                            label: "项目收尾 §14",
                            href: "../chapters/ch19.html#pn-14"
                        }
                    ]
                }
            ]
        },
        caseEntry: {
            title: "住宅全屋装修项目",
            description: "案例页展示登记单如何随计划、交付、验收和整改持续更新。",
            href: "../cases/product-register.html",
            label: "打开产品登记单案例",
            provenance: "fictional-case",
            evidence: [
                {
                    label: "现有产品登记单虚构案例",
                    href: "product.html#entity-%E4%BA%A7%E5%93%81%E7%99%BB%E8%AE%B0%E5%8D%95"
                }
            ]
        }
    };

    // 按原台账的更新 04 快照映射，不将后续计划动作表述为实际结果。
    productRegister.caseView = {
        identity: { label: "住宅装修教学案例", provenance: "fictional-case" },
        summary: {
            text: "以住宅装修产品登记单的第 7 周快照，查看产品状态、版本和验收信息如何随交付更新。",
            provenance: "fictional-case",
            evidence: [{ label: "原台账更新 04", href: "../cases/product-register.html#update-04" }]
        },
        definition: {
            label: "项目情境",
            text: "REN-PR-001 是住宅全屋装修项目持续维护的产品登记单。当前处于第 7 周，卫生间防水返工成果已受控，但仍待复验。",
            provenance: "fictional-case"
        },
        purpose: {
            label: "本次使用",
            text: "许静更新产品状态、版本和参考资料，陈默据此检查交付并安排再次验收。登记单反映待完成验收，不把返工完成视为验收通过。",
            provenance: "fictional-case"
        },
        sourceNote: "教学用虚构案例：台账更新 04 · 第 7 周快照。第 8 周和第 16 周事项为计划。",
        composition: {
            title: "组成内容", kicker: "四项理论字段与台账记录对应",
            note: "WPF-011：待复验，实际验收日期未记录。",
            provenance: "fictional-case",
            evidence: [
                { label: "原台账及产品记录", href: "../cases/product-register.html#register-sheet-title" },
                { label: "防水返工与复验更新", href: "../cases/product-register.html#update-04" }
            ],
            items: [
                { label: "产品标识符", text: "WPF-011 · 卫生间防水系统，来源为防水工作包 WP-WPF-03。", provenance: "fictional-case" },
                { label: "日期", text: "产品描述批准：6月12日；计划验收：第 7 周；实际验收：空白，等待复验完成。", provenance: "fictional-case" },
                { label: "状态", text: "待复验 · v1.1。验收结果记录为“整改后复验”，并非验收通过。", provenance: "fictional-case" },
                { label: "参考资料", text: "关联产品描述 PD-WPF-11，以及防水质量记录包，保留失败、返工与复验的证据。", provenance: "fictional-case" }
            ]
        },
        roles: {
            title: "角色和动作", kicker: "谁维护，谁提供结果",
            note: "维护职责与验收职权分开。",
            provenance: "fictional-case",
            evidence: [
                { label: "创建时的人员分工", href: "../cases/product-register.html#update-01" },
                { label: "设计验收与维护分工", href: "../cases/product-register.html#update-02" },
                { label: "防水更新人员动作", href: "../cases/product-register.html#update-04" }
            ],
            items: [
                { name: "许静 · 资料与协调专员", relation: "项目支持", actions: ["创建", "维护"], description: "创建并持续维护登记单，记录产品状态、版本、日期和参考资料。", provenance: "fictional-case" },
                { name: "陈默 · 独立装修项目经理", relation: "项目经理", actions: ["组织", "检查", "安排复验"], description: "组织建立记录；防水失败后检查更新情况，并安排再次验收。", provenance: "fictional-case" },
                { name: "宋妍 · 设计师；赵建国 · 施工包工头", relation: "小组经理", actions: ["提供清单", "报告状态"], description: "提供首批产品清单及状态；宋妍提交设计成果和版本，赵建国报告防水失败并组织返工。", provenance: "fictional-case" },
                { name: "林悦 · 业主／高级用户", relation: "批准或验收职权组织", actions: ["按授权确认适用性"], description: "在设计验收中按授权确认使用适用性，由许静记录结果；不因此承担登记单的日常维护。", provenance: "fictional-case" }
            ],
            boundary: {
                title: "维护与验收分开", provenance: "fictional-case",
                text: "许静维护记录，陈默管理使用，交付方提供状态，验收人员按授权确认结果。登记单更新不等于产品版本必然变化，更不等于验收通过。"
            }
        },
        lifecycle: {
            title: "生命周期", kicker: "实际进展与后续计划分开",
            note: "已更新至 04；05、06 为计划。",
            provenance: "fictional-case",
            evidence: [
                { label: "第 2 至 3 周创建", href: "../cases/product-register.html#update-01" },
                { label: "第 4 周设计验收", href: "../cases/product-register.html#update-02" },
                { label: "第 5 至 6 周木门更新", href: "../cases/product-register.html#update-03" },
                { label: "第 7 周防水更新", href: "../cases/product-register.html#update-04" },
                { label: "第 8 周计划", href: "../cases/product-register.html#update-05" },
                { label: "第 16 周计划", href: "../cases/product-register.html#update-06" }
            ],
            rhythm: [
                { label: "已发生", text: "创建及设计、木门状态更新" },
                { label: "正在处理", text: "第 7 周防水待复验" },
                { label: "计划动作", text: "阶段核对、增补和最终关闭" }
            ],
            items: [
                { processCode: "IP", action: "已发生 · 创建", description: "第 2 至 3 周，许静建立首批产品清单并关联受控描述，陈默组织检查，小组经理提供初始状态。", provenance: "fictional-case" },
                { processCode: "SB", anchor: "SB-add", action: "计划 · 增补", description: "第 8 周计划将下一阶段产品加入同一份登记单，计划日期随阶段计划补充，尚未形成实际更新。", provenance: "fictional-case" },
                { processCode: "MP · CS", action: "已更新 · 防水仍待复验", description: "第 4 周设计已验收；第 5 至 6 周木门等待排产，版本保持 v0.1；第 7 周防水返工后为 v1.1、待复验，实际验收日期仍为空白。", provenance: "fictional-case" },
                { processCode: "SB", anchor: "SB-review", action: "计划 · 核对", description: "第 8 周计划由许静核对记录完整性，陈默确认本阶段产品状态，供项目管理委员会评审下一阶段授权。", provenance: "fictional-case" },
                { processCode: "CP", action: "计划 · 关闭", description: "第 16 周只有全部验收证据成立后，才补齐日期与结果、完成移交并关闭归档；当前尚未发生。", provenance: "fictional-case" }
            ]
        },
        caseEntry: {
            title: "住宅装修产品登记单", relatedLabel: "完整动态台账与更新轨迹",
            href: "../cases/product-register.html#update-04", provenance: "fictional-case"
        }
    };

    const productDescription = {
        slug: "product-description", name: "产品描述", englishName: "Product description", code: "A10", kind: "baseline",
        identity: { type: "baseline", label: "正式管理产品 · 基准", isFormalManagementProduct: true, provenance: "manual-verbatim" },
        summary: { text: "在交付前明确单个产品要做成什么、如何检查，以及谁负责开发和验收。", provenance: "project-synthesis" },
        definition: {
            label: "定义", text: "对产品的用途、格式、组成、来源、质量规格和开发职责的描述。",
            sourceHref: "../chapters/ch08.html?v=a10-1#source-product-description-definition", provenance: "manual-verbatim"
        },
        purpose: {
            label: "用途", text: "产品描述的目的是描述产品的目的、组成、来源和质量规格。它制定于计划阶段，在识别产品需求后应尽快制定。",
            sourceHref: "../chapters/appendix_a.html?v=a10-1#source-product-description-purpose", provenance: "manual-verbatim"
        },
        sourceNote: "定义来源：第 8 章。用途与组成内容来源：附录 A10。角色与生命周期：项目归纳。",
        composition: {
            title: "组成内容", kicker: "附录 A10 · 手册原文", note: "",
            provenance: "manual-verbatim",
            evidence: [{ label: "附录 A10 概括性内容", href: "../chapters/appendix_a.html?v=a10-1#source-product-description-composition" }],
            items: [
                { label: "标识符", text: "产品名称或唯一标识符（如果项目有大量产品）", provenance: "manual-verbatim" },
                { label: "版本", text: "产品描述的当前版本号", provenance: "manual-verbatim" },
                { label: "目的", text: "产品的目的，其使用方式及预期用户", provenance: "manual-verbatim" },
                { label: "组成", text: "产品组件或零件列表", provenance: "manual-verbatim" },
                { label: "来源", text: "此产品的来源，例如设计、商业产品、需要升级或更换的现有系统或预期收益陈述", provenance: "manual-verbatim" },
                { label: "质量规格", text: "产品的功能性需求和非功能性需求及其相关测量指标", provenance: "manual-verbatim" },
                { label: "所需的开发或生产方法和技能", text: "描述产品预期会如何开发或生产；所需的任何特殊技能、设施或设备", provenance: "manual-verbatim" },
                { label: "质量容许偏差", text: "关键质量规格的范围可能是多样并保持可接受的", provenance: "manual-verbatim" },
                { label: "所需的质量方法和质量技能", text: "用于检查产品是否符合其质量规格的质量方法（如验证、测试和检查），以及执行质量控制活动所需技能的指标", provenance: "manual-verbatim" },
                { label: "职责", text: "产品的生产者、审查者和验收职权组织", provenance: "manual-verbatim" }
            ]
        },
        roles: {
            title: "角色和动作", kicker: "质量职责与项目角色", provenance: "project-synthesis",
            note: "生产、审查与验收属于质量职责，不是新增项目角色。",
            evidence: [{ label: "质量职责", href: "../chapters/ch08.html#pn-10" }, { label: "质量实践角色职责", href: "../chapters/ch08.html#pn-32" }],
            items: [
                { name: "小组经理", relation: "开发与质量控制", actions: ["协助编制", "生产", "报告"], description: "协助准备和维护产品描述，生产与描述一致的产品，实施协定的质量控制并报告状态。", provenance: "project-synthesis" },
                { name: "项目保证", relation: "审查与保证", actions: ["审查", "建议", "核查"], description: "协助审查产品描述，对质量专家和方法提出建议，并保证质量程序的实施情况。", provenance: "project-synthesis" },
                { name: "高级用户", relation: "用户需求与接受", actions: ["提供需求", "批准", "验收"], description: "提供用户质量期望和验收准则，批准专业产品的产品描述，并提供人员和资源执行用户质量活动与产品验收。", provenance: "project-synthesis" },
                { name: "项目经理", relation: "组织准备与维护", actions: ["咨询", "准备", "维护"], description: "咨询利益相关方准备和维护产品描述，确保小组经理实施协定的质量控制。具体产品的验收职权应另行明确。", provenance: "project-synthesis" },
                { name: "项目支持", relation: "行政与记录支持", actions: ["支持", "维护记录"], description: "为质量控制提供行政支持，准备和维护产品登记单、质量登记单，协助应用项目质量程序。", provenance: "project-synthesis" }
            ],
            boundary: { title: "描述、成果与验收分开", provenance: "project-synthesis", text: "产品描述规定质量要求；实际产品需要经过检查才能被接受。审查者应不同于生产者，验收职权及授权应明确，项目经理身份本身不意味着拥有全部产品的验收权。" }
        },
        lifecycle: {
            title: "生命周期", kicker: "管理情境", provenance: "project-synthesis",
            note: "",
            evidence: [{ label: "产品描述与受控变更", href: "../chapters/ch08.html#pn-8" }, { label: "质量职责与授权", href: "../chapters/ch08.html#pn-10" }, { label: "交付期间质量控制", href: "../chapters/ch08.html#pn-12" }],
            rhythm: [{ label: "交付前", text: "明确产品和要求" }, { label: "交付中", text: "按描述检查成果" }, { label: "需求变化", text: "受控更新描述" }],
            items: [
                { processCode: "准备", action: "识别需求并编制", description: "识别产品需求后尽快制定描述。在顺序型项目中通常于启动及后续阶段边界完善，迭代型项目可与开发并行。", provenance: "project-synthesis" },
                { processCode: "批准", action: "纳入受控基准", description: "产品描述批准后记入产品登记单，成为项目基线的一部分；明确产品的质量职责和验收授权。", provenance: "project-synthesis" },
                { processCode: "交付", action: "据此开发与检查", description: "按协定的质量方法评估实际产品是否满足要求，质量控制活动及结果记录在质量登记单中。", provenance: "project-synthesis" },
                { processCode: "变更", action: "受控更新描述", description: "允许变更产品描述，但应受控处理。描述规定的要求与实际产品的符合情况应区分，不将检查结果本身当成新的要求。", provenance: "project-synthesis" }
            ]
        },
        caseEntry: { href: "../cases/product-description-waterproofing.html", relatedLabel: "完整防水产品描述", relatedKind: "关联文件：" },
        caseView: {
            identity: { label: "住宅装修教学案例", provenance: "fictional-case" },
            summary: { text: "以 PD-WPF-11 防水产品描述为例，对照交付要求、检查方法和责任，区分描述基准与返工后的实际产品。", provenance: "fictional-case" },
            definition: { label: "案例文件", text: "PD-WPF-11 描述 WPF-011 卫生间防水系统，文件 v1.0 已批准；实际产品因返工形成 v1.1，目前仍待复验。", provenance: "fictional-case" },
            purpose: { label: "本次使用", text: "按已批准的防水质量要求开展施工、检查和接受判断。首次闭水失败后保留失败记录，返工并安排复验，不自动修改产品描述基准。", provenance: "fictional-case" },
            sourceNote: "教学用虚构案例：质量数值和检查安排为项目约定，非通用施工标准。防水产品待复验。",
            composition: {
                title: "组成内容", kicker: "十项理论字段与防水案例对应", provenance: "fictional-case",
                note: "PD-WPF-11 v1.0；专项技能与设备要求待确认。",
                evidence: [
                    { label: "产品定义", href: "../cases/product-description-waterproofing.html#definition" },
                    { label: "组成与接口", href: "../cases/product-description-waterproofing.html#composition" },
                    { label: "质量规格", href: "../cases/product-description-waterproofing.html#specification" },
                    { label: "开发与检查方法", href: "../cases/product-description-waterproofing.html#method" },
                    { label: "质量责任", href: "../cases/product-description-waterproofing.html#responsibility" },
                    { label: "独立版本记录", href: "../cases/product-description-waterproofing.html#traceability" }
                ],
                items: [
                    { label: "标识符", text: "产品：WPF-011 卫生间防水系统；描述文件：PD-WPF-11。", provenance: "fictional-case" },
                    { label: "版本", text: "产品描述 v1.0，已批准。实际产品为 v1.1、待复验，两者版本独立记录。", provenance: "fictional-case" },
                    { label: "目的", text: "形成连续、完整且可验证的卫生间防水屏障，防止水进入相邻房间和下层空间，并为保护层及墙地面饰面提供基层条件。", provenance: "fictional-case" },
                    { label: "组成", text: "合格基层、节点加强层、主体防水层、闭水试验状态、保护与交接、质量证据。", provenance: "fictional-case" },
                    { label: "来源", text: "上游为 DEC-001 全屋设计方案与 MEP-006 水电隐蔽工程；承接 HOME-025 可入住住宅的 Q01 使用安全要求。", provenance: "fictional-case" },
                    { label: "质量规格", text: "S01 至 S08 覆盖基层、材料、施工范围、节点、防水层、闭水、排水交接及资料。案例要求闭水不少于 24 小时且无渗漏；完整规格见本节依据。", provenance: "fictional-case" },
                    { label: "所需的开发或生产方法和技能", text: "基层交接、节点加强、分遍成膜、完成面检查、闭水试验、接受与交接，由施工小组组织实施；原文件未单列额外专项技能、设施和设备要求。", provenance: "fictional-case" },
                    { label: "质量容许偏差", text: "案例约定关键节点遗漏、渗漏、必需证据缺项为零；不接受未经批准的材料替代，施工范围不得小于约定值。", provenance: "fictional-case" },
                    { label: "所需的质量方法和质量技能", text: "采用联合目视检查、材料资料核对、标线与抽测、逐点检查、闭水观察和证据索引核查；专项质量技能未单列。", provenance: "fictional-case" },
                    { label: "职责", text: "赵建国生产与自检，王志衡独立核查，陈默按检查结果作接受判断；林悦确认使用关注点，许静维护相关记录。", provenance: "fictional-case" }
                ]
            },
            roles: {
                title: "角色和动作", kicker: "沿用原案例的质量分工", provenance: "fictional-case",
                note: "本案例产品接受职权：陈默。",
                evidence: [{ label: "防水质量责任", href: "../cases/product-description-waterproofing.html#responsibility" }],
                items: [
                    { name: "赵建国 · 施工包工头", relation: "小组经理", actions: ["生产", "自检", "报告"], description: "组织基层、节点、防水施工和自检，报告任何失败或偏差。", provenance: "fictional-case" },
                    { name: "王志衡 · 第三方监理", relation: "项目保证", actions: ["独立核查"], description: "核查检查安排、闭水结果和证据完整性，不代替生产者自检。", provenance: "fictional-case" },
                    { name: "林悦 · 业主", relation: "高级用户", actions: ["确认使用关注点"], description: "确认湿区安全和未来使用关注点，不负责判断专业施工质量。", provenance: "fictional-case" },
                    { name: "陈默 · 独立装修项目经理", relation: "项目经理", actions: ["接受", "拒绝", "安排复验"], description: "根据检查结果决定接受、拒绝或安排返工复验。", provenance: "fictional-case" },
                    { name: "许静 · 资料与协调专员", relation: "项目支持", actions: ["维护记录关联"], description: "维护产品状态、版本、质量记录和参考资料之间的关联。", provenance: "fictional-case" }
                ],
                boundary: { title: "验收要求未变，描述版本不升级", provenance: "fictional-case", text: "首次闭水失败后，失败结果保留。返工改变的是实际产品，形成 WPF-011 v1.1；质量要求未变，描述文件仍为 PD-WPF-11 v1.0。" }
            },
            lifecycle: {
                title: "生命周期", kicker: "描述基准与实际产品分开跟踪", provenance: "fictional-case",
                note: "描述基准 v1.0；返工产品 v1.1 待复验。",
                evidence: [{ label: "版本与记录关系", href: "../cases/product-description-waterproofing.html#traceability" }, { label: "当前失败与返工", href: "../cases/product-description-waterproofing.html#current-event" }],
                rhythm: [{ label: "描述文件", text: "v1.0 已批准" }, { label: "实际产品", text: "v1.1 待复验" }, { label: "质量记录", text: "保留失败与复验安排" }],
                items: [
                    { processCode: "准备", action: "工作包准备时编制", description: "描述文件由 v0.1 完善至 v1.0，确定组成、质量规格、方法和责任。", provenance: "fictional-case" },
                    { processCode: "批准", action: "6月12日接受描述", description: "原案例记录陈默接受 PD-WPF-11 v1.0，作为防水交付的受控质量基准。", provenance: "fictional-case" },
                    { processCode: "交付", action: "检查失败，返工后待复验", description: "第 6 周施工完成；第 7 周首次闭水失败，返工后实际产品为 v1.1，安排第二次闭水，尚未验收。", provenance: "fictional-case" },
                    { processCode: "变更", action: "本次未变更描述", description: "质量规格没有改变，因此描述仍为 v1.0；只更新实际产品状态、版本和质量记录，不因失败自动升级描述文件。", provenance: "fictional-case" }
                ]
            }
        }
    };

    const projectBrief = {
        "slug": "project-brief",
        "name": "项目概述文件",
        "englishName": "Project brief",
        "code": "A11",
        "kind": "baseline",
        "identity": {
            "type": "baseline",
            "label": "正式管理产品 · 基准",
            "isFormalManagementProduct": true,
            "provenance": "manual-verbatim"
        },
        "summary": {
            "text": "回答项目为什么启动、要做什么、怎样交付以及由谁负责，供项目管理委员会决定是否批准项目启动。",
            "provenance": "project-synthesis"
        },
        "definition": {
            "label": "定义",
            "text": "对项目目的、成本、时间、绩效需求与约束的说明。它在项目开始前的“项目准备”流程中创建，并在“项目启动”流程中用于创建项目启动文件。它将被项目启动文件取代，因此无需维护。",
            "sourceHref": "../chapters/glossary.html?v=project-pair-1#source-project-brief-definition",
            "provenance": "manual-verbatim"
        },
        "purpose": {
            "label": "用途",
            "text": "项目概述文件的目的是为项目启动提供全面、坚实的基础。",
            "sourceHref": "../chapters/appendix_a.html?v=project-pair-1#source-project-brief-purpose",
            "provenance": "manual-verbatim"
        },
        "sourceNote": "原文：定义、用途、组成。归纳：角色、生命周期。",
        "composition": {
            "title": "组成内容",
            "kicker": "附录 A11 · 手册原文",
            "note": "项目启动的基础；详细规划纳入项目启动文件。",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "附录 A11 组成内容",
                    "href": "../chapters/appendix_a.html?v=project-pair-1#source-project-brief-composition"
                }
            ],
            "items": [
                {
                    "label": "项目定义",
                    "text": "解释项目应实现的目标，应包括以下内容： ●背景 ●项目目标 ●期望成果 ●项目范围和除外条款 ●约束和假设 ●项目容许偏差 ●用户和其他已知的利益相关方",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "概要商业论证",
                    "text": "需要开展项目的理由和所选的业务选项（更多明细请参阅 A1）",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "项目产品描述",
                    "text": "包括用户质量期望和验收准则",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "项目方法",
                    "text": "定义交付商业论证中选定的业务选项的方法",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "项目管理团队结构和角色描述",
                    "text": "定义团队中不同成员的不同职责",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "参考资料",
                    "text": "任何相关文件或产品",
                    "provenance": "manual-verbatim"
                }
            ]
        },
        "roles": {
            "title": "角色和动作",
            "kicker": "按附录使用表归纳",
            "note": "",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "附录 A11 使用表",
                    "href": "../chapters/appendix_a.html?v=project-pair-1#source-project-brief-usage"
                }
            ],
            "items": [
                {
                    "name": "项目经理",
                    "actions": [
                        "编制",
                        "审查"
                    ],
                    "description": "与项目总监编制项目概述文件，在项目启动时审查并将相关信息纳入项目启动文件。",
                    "relation": "编制与审查",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "项目总监",
                    "actions": [
                        "编制"
                    ],
                    "description": "与项目经理共同编制项目概述文件，为项目启动建立基础。",
                    "relation": "共同编制",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "项目管理委员会",
                    "actions": [
                        "批准"
                    ],
                    "description": "在项目指导中批准项目概述文件。",
                    "relation": "批准",
                    "provenance": "project-synthesis"
                }
            ],
            "boundary": {
                "title": "批准启动，不等于批准全部交付",
                "text": "项目概述文件用于支持项目启动，后续仍需通过项目启动文件等材料建立和批准完整的项目管理基础。",
                "provenance": "project-synthesis"
            }
        },
        "lifecycle": {
            "title": "生命周期",
            "kicker": "沿流程看编制与使用",
            "note": "",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "附录 A11 使用表",
                    "href": "../chapters/appendix_a.html?v=project-pair-1#source-project-brief-usage"
                }
            ],
            "items": [
                {
                    "processCode": "SU",
                    "action": "项目准备：编制",
                    "description": "项目经理和项目总监建立项目定义、概要商业论证、项目产品描述、项目方法、团队结构和参考资料。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "DP",
                    "action": "项目指导：批准",
                    "description": "项目管理委员会审查启动基础并作出批准决定。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "IP",
                    "action": "项目启动：审查并纳入启动文件",
                    "description": "项目经理审查。由此开始，项目概述文件成为项目启动文件的一部分；其后被项目启动文件取代，无需持续维护。",
                    "provenance": "project-synthesis"
                }
            ]
        },
        "caseEntry": {
            "href": "../cases/project-brief.html",
            "relatedLabel": "完整项目概述文件",
            "relatedKind": "关联文件："
        },
        "caseView": {
            "identity": {
                "label": "住宅装修教学案例",
                "provenance": "fictional-case"
            },
            "summary": {
                "text": "第 1 周，以 REN-PB-001 v1.0 说明 42 万元、16 周住宅装修的启动基础，支持是否进入项目启动的决策。",
                "provenance": "fictional-case"
            },
            "definition": {
                "label": "案例文件",
                "text": "REN-PB-001 住宅全屋装修项目概述文件，v1.0 已批准。陈默编制，周诚于第 1 周 5 月 10 日批准，当前快照用于项目启动决策。",
                "provenance": "fictional-case"
            },
            "purpose": {
                "label": "本次决策",
                "text": "确认值得进入项目启动并开展详细规划，不表示全部装修工作已经获得交付授权。详细预算、计划、风险和控制安排仍需在启动阶段细化。",
                "provenance": "fictional-case"
            },
            "sourceNote": "教学用虚构案例：第 1 周快照。预算上限 42 万元、工期 16 周为项目初始约束；后续事项为计划。",
            "composition": {
                "title": "组成内容",
                "kicker": "六项理论字段与启动案例对应",
                "note": "后续细化成果纳入项目启动文件。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "项目定义",
                        "href": "../cases/project-brief.html#definition"
                    },
                    {
                        "label": "概要商业论证",
                        "href": "../cases/project-brief.html#business-case"
                    },
                    {
                        "label": "项目产品描述",
                        "href": "../cases/project-brief.html#project-product"
                    },
                    {
                        "label": "项目方法",
                        "href": "../cases/project-brief.html#approach"
                    },
                    {
                        "label": "组织与角色",
                        "href": "../cases/project-brief.html#organization"
                    },
                    {
                        "label": "参考资料",
                        "href": "../cases/project-brief.html#references"
                    }
                ],
                "items": [
                    {
                        "label": "项目定义",
                        "text": "对使用约 12 年的住宅进行全屋装修，满足三代同住。初始投资边界 42 万元，目标 16 周，最多延后 1 周；包括设计、拆改、水电、防水、饰面、固定安装及验收移交，排除结构改造、公共区域和后续家具家电软装。约束包括物业时段、临时居住及定制周期；假设无需结构加固、审批及时、家庭参与关键验收。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "概要商业论证",
                        "text": "比较维持现状、12 至 18 万元局部修缮、42 万元全屋系统装修，推荐全屋方案。关注隐蔽基层、定制延期、需求变化和质量不合格等风险。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "项目产品描述",
                        "text": "以 HOME-025 可入住住宅为最终产品，明确家庭的质量期望和高层次验收准则，形成启动时的质量基础。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "项目方法",
                        "text": "先设计再施工，分阶段推进，以专业工作包组织交付，家庭与专业人员共同参与关键验收；管理保持轻量，但质量、风险和批准记录可追溯。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "项目管理团队结构和角色描述",
                        "text": "周诚担任项目总监，林悦代表用户，陆明远代表供应商；陈默日常管理，许静维护资料，宋妍和赵建国组织专业交付，王志衡提供独立保证。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "参考资料",
                        "text": "家庭需求访谈、现场勘察、初步投资估算、物业规则以及前期经验教训，分别保留负责人和版本依据。",
                        "provenance": "fictional-case"
                    }
                ]
            },
            "roles": {
                "title": "角色和动作",
                "kicker": "人物身份与正式职权对应",
                "note": "",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "编制、批准与组织",
                        "href": "../cases/project-brief.html#organization"
                    }
                ],
                "items": [
                    {
                        "name": "陈默 · 独立装修项目经理",
                        "relation": "项目经理",
                        "actions": [
                            "编制",
                            "澄清",
                            "提交"
                        ],
                        "description": "组织项目定义和参考资料，明确约束与假设，提交启动请求。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "周诚 · 业主",
                        "relation": "项目总监",
                        "actions": [
                            "明确商业理由",
                            "确认启动基础"
                        ],
                        "description": "确认投资理由和初始预算边界，与陈默形成可供决策的项目概述文件。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "项目管理委员会 · 周诚、林悦、陆明远",
                        "relation": "项目管理委员会",
                        "actions": [
                            "审查",
                            "批准启动"
                        ],
                        "description": "原文件记录 5 月 10 日委员会审查，周诚批准 v1.0，进入项目启动。",
                        "provenance": "fictional-case"
                    }
                ],
                "boundary": {
                    "title": "后续细化有去处",
                    "text": "此时不是执行期的动态台账。详细成本、计划、风险和控制安排在项目启动中细化，并纳入项目启动文件。",
                    "provenance": "fictional-case"
                }
            },
            "lifecycle": {
                "title": "生命周期",
                "kicker": "第 1 周文件快照与后续承接",
                "note": "已记录版本：v0.1、v0.2、v1.0。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "版本演进",
                        "href": "../cases/project-brief.html#evolution"
                    }
                ],
                "items": [
                    {
                        "processCode": "SU",
                        "action": "5 月 4 日至 8 日：形成启动基础",
                        "description": "v0.1 记录初始意图，v0.2 补充勘察、选项、范围约束、项目方法及 42 万元待审查边界。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "DP",
                        "action": "5 月 10 日：批准 v1.0",
                        "description": "项目管理委员会审查，周诚批准进入项目启动，不等于一次性批准全部施工。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "IP",
                        "action": "后续：详细信息转入项目启动文件",
                        "description": "详细成本、计划、风险与控制安排将在启动阶段细化。项目概述文件随后由项目启动文件承接，不持续更新成日常记录。",
                        "provenance": "fictional-case"
                    }
                ]
            }
        }
    };

    const projectProductDescription = {
        "slug": "project-product-description",
        "name": "项目产品描述",
        "englishName": "Project product description",
        "code": "A14",
        "kind": "baseline",
        "identity": {
            "type": "baseline",
            "label": "正式管理产品 · 基准",
            "isFormalManagementProduct": true,
            "provenance": "manual-verbatim"
        },
        "summary": {
            "text": "描述整个项目最终要交付什么、用户期待怎样的质量，以及用什么方法、由谁确认接受。",
            "provenance": "project-synthesis"
        },
        "definition": {
            "label": "定义",
            "text": "项目主要产品或成果的描述，包括用户的质量期望，以及项目的验收准则和验收方法。",
            "sourceHref": "../chapters/glossary.html?v=project-pair-1#source-project-product-description-definition",
            "provenance": "manual-verbatim"
        },
        "purpose": {
            "label": "用途",
            "text": "项目产品描述的目的是描述项目的主要产品和预期用途，包括用户的质量期望、项目的验收准则和验收方法。产品描述是在项目准备流程中创建的，并在项目启动流程中进行完善。",
            "sourceHref": "../chapters/appendix_a.html?v=project-pair-1#source-project-product-description-purpose",
            "provenance": "manual-verbatim"
        },
        "sourceNote": "原文：定义、用途、组成。归纳：角色、生命周期。",
        "composition": {
            "title": "组成内容",
            "kicker": "附录 A14 · 手册原文",
            "note": "面向项目主要产品；A10 面向单个产品。",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "附录 A14 组成内容",
                    "href": "../chapters/appendix_a.html?v=project-pair-1#source-project-product-description-composition"
                }
            ],
            "items": [
                {
                    "label": "目的",
                    "text": "描述项目产品的使用目的以及产品使用对象",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "主要产品",
                    "text": "描述要交付的主要产品",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "来源",
                    "text": "产品基于什么，例如现有产品或对新能力的需求",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "用户的质量期望",
                    "text": "描述对项目产品的质量期望以及实现这些期望所需应用的标准和程序",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "验收准则",
                    "text": "项目产品必须满足才能被用户接受的标准的优先级列表",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "验收方法和职责",
                    "text": "确认验收的方法以及验收决定负责人",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "项目层面的质量容许偏差",
                    "text": "应用于验收准则的任何容许偏差",
                    "provenance": "manual-verbatim"
                }
            ]
        },
        "roles": {
            "title": "角色和动作",
            "kicker": "按附录使用表归纳",
            "note": "",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "附录 A14 使用表",
                    "href": "../chapters/appendix_a.html?v=project-pair-1#source-project-product-description-usage"
                }
            ],
            "items": [
                {
                    "name": "项目经理",
                    "actions": [
                        "创建",
                        "更新",
                        "审查"
                    ],
                    "description": "在项目准备创建，在项目启动更新，在阶段边界审查和更新，在收尾审查。",
                    "relation": "创建与维护",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "项目管理委员会",
                    "actions": [
                        "批准"
                    ],
                    "description": "在项目指导中批准项目产品描述。",
                    "relation": "批准",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "项目保证",
                    "actions": [
                        "建议",
                        "审查",
                        "确认"
                    ],
                    "description": "在项目启动提供建议，在阶段边界审查，在项目收尾确认。",
                    "relation": "独立保证",
                    "provenance": "project-synthesis"
                }
            ],
            "boundary": {
                "title": "使用表不是全部验收分工",
                "text": "验收方法和职责属于产品描述的组成内容，应明确具体方法和验收决定负责人。项目保证的确认不应被直接写成替代用户接受。",
                "provenance": "project-synthesis"
            }
        },
        "lifecycle": {
            "title": "生命周期",
            "kicker": "沿流程看编制与使用",
            "note": "",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "附录 A14 使用表",
                    "href": "../chapters/appendix_a.html?v=project-pair-1#source-project-product-description-usage"
                }
            ],
            "items": [
                {
                    "processCode": "SU",
                    "action": "项目准备：创建",
                    "description": "项目经理创建项目产品描述，明确主要产品、用户质量期望与验收条件。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "DP",
                    "action": "项目指导：批准",
                    "description": "项目管理委员会批准项目产品描述。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "IP",
                    "action": "项目启动：更新并获得建议",
                    "description": "项目经理完善描述，项目保证提供建议。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "SB",
                    "action": "阶段边界：审查和更新",
                    "description": "项目经理审查、更新；项目保证审查。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "CP",
                    "action": "项目收尾：审查和确认",
                    "description": "项目经理审查，项目保证确认，结合已约定的验收方法和职责检查最终产品。",
                    "provenance": "project-synthesis"
                }
            ]
        },
        "caseEntry": {
            "href": "../cases/project-product-description.html",
            "relatedLabel": "完整项目产品描述",
            "relatedKind": "关联文件："
        },
        "caseView": {
            "identity": {
                "label": "住宅装修教学案例",
                "provenance": "fictional-case"
            },
            "summary": {
                "text": "用 PPD-HOME-25 约定 HOME-025 可入住住宅的六组质量与验收要求。描述文件 v1.1 已批准，不代表住宅已经通过最终验收。",
                "provenance": "fictional-case"
            },
            "definition": {
                "label": "案例文件",
                "text": "PPD-HOME-25 住宅全屋装修项目产品描述，v1.1 于 5 月 20 日由周诚批准。描述对象 HOME-025 可入住住宅仍为 v0.3、开发中。",
                "provenance": "fictional-case"
            },
            "purpose": {
                "label": "本次使用",
                "text": "让家庭、设计、施工和管理人员围绕同一套最终住宅质量期望、验收准则、检查方法和责任开展工作，并为计划第 16 周的最终验收准备证据。",
                "provenance": "fictional-case"
            },
            "sourceNote": "教学用虚构案例：来源：住宅项目产品描述。最终验收状态：待执行。",
            "composition": {
                "title": "组成内容",
                "kicker": "七项理论字段与整屋验收对应",
                "note": "范围：整套住宅；防水专项见 A10。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "项目产品定义",
                        "href": "../cases/project-product-description.html#definition"
                    },
                    {
                        "label": "主要组成",
                        "href": "../cases/project-product-description.html#composition"
                    },
                    {
                        "label": "用户质量期望",
                        "href": "../cases/project-product-description.html#expectations"
                    },
                    {
                        "label": "验收准则与方法",
                        "href": "../cases/project-product-description.html#acceptance"
                    },
                    {
                        "label": "责任分工",
                        "href": "../cases/project-product-description.html#responsibility"
                    },
                    {
                        "label": "版本记录",
                        "href": "../cases/project-product-description.html#versions"
                    }
                ],
                "items": [
                    {
                        "label": "目的",
                        "text": "交付适合三代家庭长期居住的住宅，具备正常入住、维护、保修和竣工资料移交条件；不包含后续可移动家具、家电和软装。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "主要产品",
                        "text": "HOME-025 可入住住宅，由设计方案、拆除与基层交接、水电隐蔽工程、防水系统、饰面、定制柜、门、照明电器安装及移交资料包组成。各组成产品分别跟踪状态，并非全部已验收。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "来源",
                        "text": "家庭需求访谈、现场勘察、已批准的项目概述文件、设计方案、物业规则及前期经验教训。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "用户的质量期望",
                        "text": "Q01 使用安全，Q02 三代同住功能，Q03 设计与实物一致，Q04 质量可追溯，Q05 便于维护，Q06 完整移交。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "验收准则",
                        "text": "安全项目必须通过且安全缺陷为零；家庭场景可用；实物符合已批准设计及样板；关键质量记录可追溯；检修位置和标识可用；必需产品及移交资料满足接受条件。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "验收方法和职责",
                        "text": "结合专业测试与现场检查、家庭场景走查、设计样板对照、资料索引核查及维护演示。王志衡独立核查，林悦确认用户接受，陈默组织验收，周诚授权收尾；完整逐项责任见原验收矩阵。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "项目层面的质量容许偏差",
                        "text": "安全、防水、电气、排水及结构安全不通过时，不能以普通尾项放行。允许的普通外观尾项须明确责任人、截止日期和批准记录，不用笼统“基本完成”替代验收。",
                        "provenance": "fictional-case"
                    }
                ]
            },
            "roles": {
                "title": "角色和动作",
                "kicker": "管理产品使用职权与案例对应",
                "note": "用户接受：林悦；项目保证不代行接受职权。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "验收责任",
                        "href": "../cases/project-product-description.html#responsibility"
                    },
                    {
                        "label": "受控版本",
                        "href": "../cases/project-product-description.html#versions"
                    }
                ],
                "items": [
                    {
                        "name": "陈默 · 独立装修项目经理",
                        "relation": "项目经理",
                        "actions": [
                            "组织验收",
                            "协调责任"
                        ],
                        "description": "组织整体验收与资料移交，协调检查人员和问题收口。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "项目管理委员会 · 周诚、林悦、陆明远",
                        "relation": "项目管理委员会",
                        "actions": [
                            "批准质量基础"
                        ],
                        "description": "原文件记录周诚批准 v1.1。林悦代表家庭确认用户接受，周诚在满足收尾条件后授权收尾。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "王志衡 · 第三方监理",
                        "relation": "项目保证",
                        "actions": [
                            "独立核查"
                        ],
                        "description": "检查质量证据与现场状态，不替代施工自检，也不替代林悦的用户接受。",
                        "provenance": "fictional-case"
                    }
                ],
                "boundary": {
                    "title": "描述已批准，住宅仍在开发",
                    "text": "PPD-HOME-25 v1.1 是质量和验收要求的受控描述；HOME-025 v0.3 是实际住宅产品。二者的版本、状态和批准含义不能混为一谈。",
                    "provenance": "fictional-case"
                }
            },
            "lifecycle": {
                "title": "生命周期",
                "kicker": "已记录的版本与后续验收计划",
                "note": "准备至启动已有记录；阶段审查及最终验收待开展。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "版本演进",
                        "href": "../cases/project-product-description.html#versions"
                    },
                    {
                        "label": "验收与证据包",
                        "href": "../cases/project-product-description.html#evidence"
                    }
                ],
                "items": [
                    {
                        "processCode": "SU",
                        "action": "5 月 4 日：v0.1 初稿",
                        "description": "记录家庭的初始质量期望和最终产品边界。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "DP",
                        "action": "5 月 10 日：v1.0 获批",
                        "description": "随项目概述文件建立初始质量基础；5 月 20 日周诚进一步批准 v1.1。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "IP",
                        "action": "5 月 20 日：完善至 v1.1",
                        "description": "结合启动质量规划补充 Q05、Q06、检查方法、证据和责任，未改变范围和预算。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "SB",
                        "action": "后续控制：审查是否需要受控变更",
                        "description": "原文件约定只有获批的受控变更才升级描述版本。本案例未提供后续阶段边界审查的完成记录。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "CP",
                        "action": "计划第 16 周：整体验收",
                        "description": "准备组成产品验收、质量测试、竣工与隐蔽照片、家庭检查、保修维护及尾项关闭证据。当前住宅仍开发中，不标记为已验收或已收尾。",
                        "provenance": "fictional-case"
                    }
                ]
            }
        }
    };

    const riskRegister = {
        "slug": "risk-register",
        "name": "风险登记单",
        "englishName": "Risk register",
        "code": "A13",
        "kind": "record-component",
        "identity": {
            "type": "record-component",
            "label": "项目记录单组成项",
            "isFormalManagementProduct": false,
            "provenance": "manual-verbatim"
        },
        "parent": {
            "code": "A13",
            "name": "项目记录单",
            "href": "product.html#entity-项目记录单",
            "provenance": "manual-verbatim"
        },
        "summary": {
            "text": "把威胁和机会转化为可跟踪的评估、责任和应对，保留风险的当前状态与历史。",
            "provenance": "project-synthesis"
        },
        "definition": {
            "label": "定义",
            "text": "记录与举措相关的已识别风险，包括风险的状态和历史。",
            "sourceHref": "../chapters/glossary.html?v=register-pair-1#source-risk-register-definition",
            "provenance": "manual-verbatim"
        },
        "purpose": {
            "label": "用途",
            "text": "风险登记单的目的是维护一份与项目相关的已识别风险记录，包括风险的状态和历史记录。其用于捕获并维护与项目相关的所有已识别威胁和机会的信息。",
            "sourceHref": "../chapters/appendix_a.html?v=register-pair-1#source-risk-register-purpose",
            "provenance": "manual-verbatim"
        },
        "sourceNote": "原文：定义、用途、组成。归纳：角色、生命周期。",
        "composition": {
            "title": "组成内容",
            "kicker": "附录 A13 · 手册原文字段",
            "note": "补充维护：状态与历史。",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "组成内容原文",
                    "href": "../chapters/appendix_a.html?v=register-pair-1#source-risk-register-composition"
                }
            ],
            "items": [
                {
                    "label": "风险标识符",
                    "text": "风险的唯一参考",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "风险描述",
                    "text": "风险的原因、事件和影响的摘要",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "概率",
                    "text": "对风险事件发生的可能性的估算",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "影响",
                    "text": "风险影响的估算",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "临近度",
                    "text": "有关风险可能多快发生的估算",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "速度",
                    "text": "如果发生风险，风险对目标产生影响的速度的估算",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "风险应对",
                    "text": "选择应对风险的行动",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "计划的剩余概率和影响",
                    "text": "假设风险应对有效的情况下，风险的概率和影响",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "风险负责人",
                    "text": "对风险负责的人员",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "风险行动负责人",
                    "text": "对风险应对负责的人员",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "风险相关日期",
                    "text": "例如，记录的日期、上次审查日期和行动截止日期",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "记录",
                    "text": "与风险关联的文件列表及其位置",
                    "provenance": "manual-verbatim"
                }
            ]
        },
        "roles": {
            "title": "角色和动作",
            "kicker": "正式角色与具体职责分开",
            "note": "项目角色与具体记录职责分别列示。",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "进展实践的角色职责",
                    "href": "../chapters/ch11.html#pn-31"
                },
                {
                    "label": "两种风险职责",
                    "href": "../chapters/ch09.html#pn-8"
                }
            ],
            "items": [
                {
                    "name": "项目经理",
                    "relation": "管理与使用",
                    "actions": [
                        "创建",
                        "审查",
                        "上报"
                    ],
                    "description": "组织维护风险信息，审查风险变化及对项目目标的影响，按授权边界沟通和上报。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "项目支持",
                    "relation": "协助维护",
                    "actions": [
                        "记录",
                        "更新"
                    ],
                    "description": "协助维护责任、日期、评估、状态和关联资料，不因负责记录而承担所有风险。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "小组经理",
                    "relation": "工作包风险信息",
                    "actions": [
                        "识别",
                        "报告"
                    ],
                    "description": "从工作包交付中识别风险，并反馈应对行动和进展。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "风险负责人",
                    "relation": "整体风险职责",
                    "actions": [
                        "管理",
                        "监视",
                        "控制"
                    ],
                    "description": "对被分配的特定风险及其整体应对负责。这是具体风险职责，不是新增的互斥项目角色。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "风险行动负责人",
                    "relation": "具体行动职责",
                    "actions": [
                        "实施",
                        "反馈"
                    ],
                    "description": "负责协定的应对行动，让风险负责人及时了解行动结果。",
                    "provenance": "project-synthesis"
                }
            ],
            "boundary": {
                "title": "风险负责人不等于行动负责人",
                "text": "两种职责可以由同一人承担，也可以分开。预期剩余风险是假设应对有效后的估计，不等于已经验证的应对结果。",
                "provenance": "project-synthesis"
            }
        },
        "lifecycle": {
            "title": "生命周期",
            "kicker": "持续维护",
            "note": "",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "项目记录单使用表",
                    "href": "../chapters/appendix_a.html?v=register-pair-1#source-project-log-usage"
                }
            ],
            "items": [
                {
                    "processCode": "IP",
                    "action": "建立登记单",
                    "description": "建立初始风险记录；建单前使用日志。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "CS",
                    "action": "审查与更新",
                    "description": "更新风险、评估、状态与历史；已发生事件关联问题或质量记录。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "MP",
                    "action": "实施与反馈",
                    "description": "小组经理、项目支持更新交付风险；行动负责人反馈执行结果。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "SB",
                    "action": "阶段边界审查",
                    "description": "复评本阶段及下一阶段风险，更新责任与剩余风险。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "CP",
                    "action": "收尾审查与移交",
                    "description": "确认剩余风险、接收方与后续责任，记录交接安排。",
                    "provenance": "project-synthesis"
                }
            ]
        },
        "caseEntry": {
            "href": "../cases/risk-lessons-records.html#risk-register",
            "relatedLabel": "风险登记单案例记录摘录",
            "relatedKind": "关联记录："
        },
        "caseView": {
            "identity": {
                "label": "住宅装修教学案例",
                "provenance": "fictional-case"
            },
            "summary": {
                "text": "以 RISK-004 定制木门交付风险对应十二项字段，并保留防水风险和采购机会的历史摘录。当前状态与旧示例评估分开显示。",
                "provenance": "fictional-case"
            },
            "definition": {
                "label": "案例记录",
                "text": "住宅装修风险登记单教学摘录。主记录 RISK-004 关联 DOOR-018 定制木门；另保留 RISK-007 防水风险、RISK-011 采购机会。",
                "provenance": "fictional-case"
            },
            "purpose": {
                "label": "本次使用",
                "text": "跟踪木门等待排产对安装与完工的影响，明确风险责任和排产应对。防水首次闭水已失败，复验及进度影响待确认。",
                "provenance": "fictional-case"
            },
            "sourceNote": "教学案例 · 旧风险评级待复评。当前进展依据：产品台账、防水检查记录。",
            "composition": {
                "title": "组成内容",
                "kicker": "RISK-004 · 12 项字段",
                "note": "历史评级；当前待复评。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "风险历史记录",
                        "href": "../cases/risk-lessons-records.html#risk-register"
                    },
                    {
                        "label": "木门当前台账",
                        "href": "../cases/product-register.html"
                    }
                ],
                "items": [
                    {
                        "label": "风险标识符",
                        "text": "RISK-004，威胁，关联 DOOR-018 定制木门。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "风险描述",
                        "text": "厂家产能紧张，可能延迟交货并影响安装与完工日期。当前台账显示木门等待排产，最终延期幅度尚未确认。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "概率",
                        "text": "旧示例估计为 4/5；当前概率待复评。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "影响",
                        "text": "旧示例估计为 4/5；不是已确认的损失或延期量。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "临近度",
                        "text": "旧示例为 3 周，需结合最新排产信息重新确认。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "速度",
                        "text": "旧示例为 1 天，表示风险发生后影响目标的速度，不是预计延期天数。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "风险应对",
                        "text": "应对计划：确认排产并准备备选供应商。排产状态：待确认。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "计划的剩余概率和影响",
                        "text": "旧示例预计概率 2/5、影响 2/5，前提是应对有效，不作为已实现的降低结果。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "风险负责人",
                        "text": "陈默 · 独立装修项目经理，拟任木门风险负责人。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "风险行动负责人",
                        "text": "陆明远 · 装修公司负责人，拟负责排产与备选供应资源协调。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "风险相关日期",
                        "text": "旧示例为 7 月 3 日记录、7 月 8 日复查。保留为历史示例日期，当前行动截止日期待确认，不改写为已经复查完成。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "记录",
                        "text": "关联木门产品台账；采购计划和供应商排产确认属于应补充的依据，当前未附独立确认文件。",
                        "provenance": "fictional-case"
                    }
                ]
            },
            "roles": {
                "title": "角色和动作",
                "kicker": "围绕木门风险的教学分工",
                "note": "人员分工拟定，签认待确认。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "拟定分工与当前状态",
                        "href": "../cases/risk-lessons-records.html#mapping"
                    }
                ],
                "items": [
                    {
                        "name": "陈默 · 独立装修项目经理",
                        "relation": "项目经理",
                        "actions": [
                            "审查",
                            "协调"
                        ],
                        "description": "关注木门排产对阶段与项目目标的影响，组织风险复评。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "许静 · 资料与协调专员",
                        "relation": "项目支持",
                        "actions": [
                            "记录",
                            "关联"
                        ],
                        "description": "记录最新排产反馈、审查日期和关联资料，区分预计结果与已取得证据。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "赵建国 · 施工包工头",
                        "relation": "小组经理",
                        "actions": [
                            "反馈接口影响"
                        ],
                        "description": "说明木门到货对安装顺序和现场工作的影响。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "陈默 · 木门风险整体负责人",
                        "relation": "风险负责人",
                        "actions": [
                            "监视",
                            "判断"
                        ],
                        "description": "承担 RISK-004 的整体管理职责，不把维护表格交给许静视为转移责任。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "陆明远 · 装修公司负责人",
                        "relation": "风险行动负责人",
                        "actions": [
                            "协调排产",
                            "准备备选"
                        ],
                        "description": "执行供应协调行动并反馈结果；尚未收到的确认不标为完成。",
                        "provenance": "fictional-case"
                    }
                ],
                "boundary": {
                    "title": "防水事件已发生，剩余不确定性继续跟踪",
                    "text": "QA-WPF-01 首次检查失败；WPF-011 v1.1 返工后待复验。RISK-007 持续跟踪复验及交付影响，当前评级与应对效果待核验。",
                    "provenance": "fictional-case"
                }
            },
            "lifecycle": {
                "title": "生命周期",
                "kicker": "当前进展与后续安排",
                "note": "",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "风险记录摘录",
                        "href": "../cases/risk-lessons-records.html#risk-register"
                    },
                    {
                        "label": "防水当前事件",
                        "href": "../cases/product-description-waterproofing.html#current-event"
                    }
                ],
                "items": [
                    {
                        "processCode": "IP",
                        "action": "收集风险",
                        "description": "RISK-004、007、011；建立日期待确认。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "CS",
                        "action": "核对与复评",
                        "description": "第 7 周：木门等待排产，防水返工后待复验；评级待复评。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "MP",
                        "action": "协调与反馈",
                        "description": "跟踪排产、备选资源和复验；应对效果待核验。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "SB",
                        "action": "阶段复评（待开展）",
                        "description": "核对到货、安装接口、未关闭风险及下一阶段责任和期限。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "CP",
                        "action": "风险移交（待开展）",
                        "description": "剩余风险、接收方及移交责任待确认。",
                        "provenance": "fictional-case"
                    }
                ]
            }
        }
    };

    const lessonsLog = {
        "slug": "lessons-log",
        "name": "经验教训记录单",
        "englishName": "Lessons log",
        "code": "A13",
        "kind": "record-component",
        "identity": {
            "type": "record-component",
            "label": "项目记录单组成项",
            "isFormalManagementProduct": false,
            "provenance": "manual-verbatim"
        },
        "parent": {
            "code": "A13",
            "name": "项目记录单",
            "href": "product.html#entity-项目记录单",
            "provenance": "manual-verbatim"
        },
        "summary": {
            "text": "把项目中的正面和负面经验转化为可跟踪行动，让经验在项目进行中得到应用。",
            "provenance": "project-synthesis"
        },
        "definition": {
            "label": "定义",
            "text": "经验教训的一种非正式资料库，适用于本项目或未来的项目。",
            "sourceHref": "../chapters/glossary.html?v=register-pair-1#source-lessons-log-definition",
            "provenance": "manual-verbatim"
        },
        "purpose": {
            "label": "用途",
            "text": "经验教训记录单的目的是，提供一个资料库，用来记录适用于本项目或未来项目的经验教训。某些经验教训可能源于其他项目，应总结到经验教训记录单中，以便输入项目方法和计划。某些经验教训可能源于本项目，可以将新的经验（好的或坏的）应用到此项目中和/或转给其他项目。",
            "sourceHref": "../chapters/appendix_a.html?v=register-pair-1#source-lessons-log-purpose",
            "provenance": "manual-verbatim"
        },
        "sourceNote": "原文：定义、用途、组成。归纳：角色、生命周期。",
        "composition": {
            "title": "组成内容",
            "kicker": "附录 A13 · 手册原文字段",
            "note": "“记录”字段原文用语：与问题关联。",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "组成内容原文",
                    "href": "../chapters/appendix_a.html?v=register-pair-1#source-lessons-log-composition"
                }
            ],
            "items": [
                {
                    "label": "经验教训标识符",
                    "text": "经验教训的唯一参考",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "经验教训描述",
                    "text": "经验教训摘要和相关细节，例如影响（如正面/负面财务影响）、已知原因/触发因素、是否有任何早期预警指标、以前是否被识别为风险（威胁或机会）及建议",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "经验教训类型",
                    "text": "例如，团队经验教训、项目经验教训和业务层经验教训",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "经验教训负责人",
                    "text": "负责根据从经验教训中获得的经验（可能来自团队、项目或业务）采取行动的人",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "分级",
                    "text": "优先级和严重性的分级",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "状态",
                    "text": "经验教训的当前状态，例如，已记录、已审查、已根据经验教训采取行动（按项目）、已根据经验教训采取行动（按业务）",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "经验教训相关日期",
                    "text": "例如，提出日期、上次审查日期、行动截止日期和解决日期",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "记录",
                    "text": "与问题关联的文件列表及其位置",
                    "provenance": "manual-verbatim"
                }
            ]
        },
        "roles": {
            "title": "角色和动作",
            "kicker": "正式角色与具体职责分开",
            "note": "项目角色与具体记录职责分别列示。",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "进展实践的角色职责",
                    "href": "../chapters/ch11.html#pn-31"
                }
            ],
            "items": [
                {
                    "name": "项目经理",
                    "relation": "管理与使用",
                    "actions": [
                        "创建",
                        "审查",
                        "应用"
                    ],
                    "description": "组织记录并审查适用经验，将建议落实到后续方法和计划。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "项目支持",
                    "relation": "协助维护",
                    "actions": [
                        "记录",
                        "更新"
                    ],
                    "description": "维护经验标识符、行动负责人、状态、日期和关联资料。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "小组经理",
                    "relation": "提供交付经验",
                    "actions": [
                        "识别",
                        "报告"
                    ],
                    "description": "从工作包中提供正面与负面经验，反馈行动是否执行及结果。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "项目总监",
                    "relation": "向业务分享",
                    "actions": [
                        "分享",
                        "问责"
                    ],
                    "description": "对向业务分享项目经验教训继续承担问责。",
                    "provenance": "project-synthesis"
                }
            ],
            "boundary": {
                "title": "记录单和报告不是同一项",
                "text": "经验教训记录单是持续积累和跟踪行动的资料库。A8 经验教训报告是对特定经验、阶段或项目的总结，不以此记录单直接替代。",
                "provenance": "project-synthesis"
            }
        },
        "lifecycle": {
            "title": "生命周期",
            "kicker": "持续维护",
            "note": "",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "项目记录单使用表",
                    "href": "../chapters/appendix_a.html?v=register-pair-1#source-project-log-usage"
                },
                {
                    "label": "审查与应用经验",
                    "href": "../chapters/ch11.html#pn-6"
                }
            ],
            "items": [
                {
                    "processCode": "SU",
                    "action": "评估既往经验并创建",
                    "description": "在适用时由项目经理创建经验教训记录单，识别可供本项目使用的经验。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "IP",
                    "action": "纳入项目方法和计划",
                    "description": "把适用经验输入项目方法和计划，不只留下文字摘录。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "CS/MP",
                    "action": "持续识别与应用",
                    "description": "在管理与交付过程中审查和更新，记录原因、影响、建议及行动结果。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "SB",
                    "action": "阶段复盘",
                    "description": "审查当前阶段经验和未完成行动，将适用建议带入下一阶段安排。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "CP",
                    "action": "汇总与分享",
                    "description": "收尾时审查和更新记录，为经验总结与后续项目复用提供资料；注明尚未验证的行动。",
                    "provenance": "project-synthesis"
                }
            ]
        },
        "caseEntry": {
            "href": "../cases/risk-lessons-records.html#lessons-log",
            "relatedLabel": "经验教训记录单案例记录摘录",
            "relatedKind": "关联记录："
        },
        "caseView": {
            "identity": {
                "label": "住宅装修教学案例",
                "provenance": "fictional-case"
            },
            "summary": {
                "text": "防水检查、开关定位样板与主材排产的经验记录。",
                "provenance": "fictional-case"
            },
            "definition": {
                "label": "案例记录",
                "text": "LES-001 封闭前检查；LES-002 开关定位样板；LES-003 长周期主材排产。",
                "provenance": "fictional-case"
            },
            "purpose": {
                "label": "本次使用",
                "text": "将防水返工、样板确认和供应排产中的经验转化为具体后续行动，明确谁执行、如何检查，并保留尚未验证的状态。",
                "provenance": "fictional-case"
            },
            "sourceNote": "教学案例 · 行动实施与效果待核验。",
            "composition": {
                "title": "组成内容",
                "kicker": "LES-001 · 八项逐字段对应",
                "note": "",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "三条经验摘录",
                        "href": "../cases/risk-lessons-records.html#lessons-log"
                    },
                    {
                        "label": "防水失败与返工",
                        "href": "../cases/product-description-waterproofing.html#current-event"
                    }
                ],
                "items": [
                    {
                        "label": "经验教训标识符",
                        "text": "LES-001，封闭前增加检查清单和照片记录。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "经验教训描述",
                        "text": "旧示例将基层检查不足与返工联系起来，建议封闭前核对并留照。当前已知首次闭水失败和节点返工，但不能据此确认全部根因；应复盘原因、预警和改进效果。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "经验教训类型",
                        "text": "项目经验教训，来自质量检查与工作包交付。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "经验教训负责人",
                        "text": "赵建国 · 施工包工头，拟负责施工检查；陈默组织审查，许静维护记录。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "分级",
                        "text": "沿用旧示例的高优先级；旧字段示例给出中等严重性，当前分级待复评。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "状态",
                        "text": "当前状态：建议已记录，实施和效果待核验。历史状态：已应用。复验状态：待执行。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "经验教训相关日期",
                        "text": "历史日期：7 月 2 日提出、7 月 5 日应用。当前行动截止日、效果确认日及签认日期：待确认。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "记录",
                        "text": "关联首次闭水检查、返工及待复验记录。待补资料：新增检查清单的实施记录和照片。",
                        "provenance": "fictional-case"
                    }
                ]
            },
            "roles": {
                "title": "角色和动作",
                "kicker": "记录、行动和效果分开负责",
                "note": "拟定分工，签认待确认。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "拟定职责",
                        "href": "../cases/risk-lessons-records.html#mapping"
                    }
                ],
                "items": [
                    {
                        "name": "陈默 · 独立装修项目经理",
                        "relation": "项目经理",
                        "actions": [
                            "审查",
                            "安排落实"
                        ],
                        "description": "审查经验是否适用，将认可的检查建议纳入后续工作安排。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "许静 · 资料与协调专员",
                        "relation": "项目支持",
                        "actions": [
                            "记录",
                            "追踪"
                        ],
                        "description": "保留经验来源、历史状态和当前待核验项，关联检查与行动依据。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "赵建国、宋妍 · 施工包工头、设计师",
                        "relation": "小组经理",
                        "actions": [
                            "提供经验",
                            "反馈行动"
                        ],
                        "description": "赵建国提供施工检查经验，宋妍提供定位样板经验，反馈实施情况，不以建议代替效果证明。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "周诚 · 业主",
                        "relation": "项目总监",
                        "actions": [
                            "分享经验"
                        ],
                        "description": "计划在审查后向业主及后续使用者分享可复用经验。分享状态：待执行。",
                        "provenance": "fictional-case"
                    }
                ],
                "boundary": {
                    "title": "建议已记录，不等于经验已验证",
                    "text": "首次失败和返工是已记录事实，改进措施是否执行、是否有效需要另有证据。经验教训记录单不替代质量验收，也不等于 A8 经验教训报告。",
                    "provenance": "fictional-case"
                }
            },
            "lifecycle": {
                "title": "生命周期",
                "kicker": "从历史经验到可验证的行动",
                "note": "行动与效果待核验。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "经验历史记录",
                        "href": "../cases/risk-lessons-records.html#lessons-log"
                    }
                ],
                "items": [
                    {
                        "processCode": "SU",
                        "action": "准备时：审查可复用经验",
                        "description": "准备阶段可复用三条历史经验；采用记录及日期待确认。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "IP",
                        "action": "启动时：选择适用建议",
                        "description": "封闭前检查、定位样板和主材排产预警可作为方法与计划的输入；是否已纳入须查相应文件。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "CS/MP",
                        "action": "第 7 周：捕获并核对",
                        "description": "防水首次失败、节点返工和木门等待排产为现有事件，记录经验并标出尚待调查的原因和改进行动。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "SB",
                        "action": "后续：复盘行动效果",
                        "description": "计划检查清单执行、样板确认和排产预警效果。验证状态：待核验。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "CP",
                        "action": "后续：总结并分享",
                        "description": "收尾时区分已验证经验和未完成行动，为经验教训报告及以后项目提供输入；当前尚未完成收尾总结。",
                        "provenance": "fictional-case"
                    }
                ]
            }
        }
    };

    const qualityRegister = {
        "slug": "quality-register",
        "name": "质量登记单",
        "englishName": "Quality register",
        "code": "A13",
        "kind": "record-component",
        "identity": {
            "type": "record-component",
            "label": "项目记录单组成项",
            "isFormalManagementProduct": false,
            "provenance": "manual-verbatim"
        },
        "parent": {
            "code": "A13",
            "name": "项目记录单",
            "href": "product.html#entity-项目记录单",
            "provenance": "manual-verbatim"
        },
        "summary": {
            "text": "保留质量活动的计划与实际结果，记录失败、处置和复验，不覆盖历史。",
            "provenance": "project-synthesis"
        },
        "definition": {
            "label": "定义",
            "text": "项目记录单的一个组件，用于标识计划的或已发生的所有质量控制活动，并为阶段竣工报告和项目竣工报告提供信息。",
            "sourceHref": "../chapters/glossary.html?v=quality-delivery-1#source-quality-register-definition",
            "provenance": "manual-verbatim"
        },
        "purpose": {
            "label": "用途",
            "text": "质量登记单的目的是汇总已计划或已发生的所有质量管理活动。项目经理和项目保证会把质量登记单作为审查进展的一部分来使用。",
            "sourceHref": "../chapters/ch08.html?v=quality-delivery-1#source-quality-register-purpose",
            "provenance": "manual-verbatim"
        },
        "sourceNote": "原文：定义、用途、组成。归纳：角色、生命周期。",
        "composition": {
            "title": "组成内容",
            "kicker": "第 8 章 · 七项原文字段",
            "note": "活动与结果入单；证明材料另存关联。",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "组成内容原文",
                    "href": "../chapters/ch08.html?v=quality-delivery-1#source-quality-register-composition"
                }
            ],
            "items": [
                {
                    "label": "质量标识符",
                    "text": "质量活动的唯一参考编号",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "产品标识符",
                    "text": "受质量活动约束的产品的标识符",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "质量方法",
                    "text": "活动中涉及到的质量方法",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "日期",
                    "text": "活动的计划日期和实际日期",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "职责",
                    "text": "所涉及的个人或职能及其各自的角色和职责",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "结果",
                    "text": "产品是否通过；指示产品未通过时的应对措施",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "记录",
                    "text": "与活动关联的文件列表及其位置",
                    "provenance": "manual-verbatim"
                }
            ]
        },
        "roles": {
            "title": "角色和动作",
            "kicker": "依据手册使用与质量职责归纳",
            "note": "管理、检查与接受职责分别列示。",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "质量实践的角色职责",
                    "href": "../chapters/ch08.html#pn-32"
                }
            ],
            "items": [
                {
                    "name": "项目经理",
                    "relation": "审查与使用",
                    "actions": [
                        "审查",
                        "安排处置"
                    ],
                    "description": "用活动记录审查进展，根据质量结果协调处置和后续检查。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "项目支持",
                    "relation": "准备和维护",
                    "actions": [
                        "准备",
                        "登记",
                        "更新"
                    ],
                    "description": "维护质量登记单，保留计划和实际日期及质量证据的关联。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "小组经理",
                    "relation": "实施与汇编记录",
                    "actions": [
                        "实施",
                        "记录",
                        "报告"
                    ],
                    "description": "落实工作包约定的质量控制，汇编记录并报告产品质量状态。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "项目保证",
                    "relation": "独立审查",
                    "actions": [
                        "审查",
                        "核查"
                    ],
                    "description": "用登记单和证据审查质量活动，确认质量程序的实施情况。",
                    "provenance": "project-synthesis"
                }
            ],
            "boundary": {
                "title": "返工不抹去失败",
                "text": "失败结果应保留，后续复验另有记录。登记了计划检查不代表已经检查，返工完成也不等于产品通过验收。",
                "provenance": "project-synthesis"
            }
        },
        "lifecycle": {
            "title": "生命周期",
            "kicker": "流程使用关系",
            "note": "",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "质量实践的管理产品",
                    "href": "../chapters/ch08.html#pn-31"
                },
                {
                    "label": "A13 使用表",
                    "href": "../chapters/appendix_a.html#source-project-log-usage"
                }
            ],
            "items": [
                {
                    "processCode": "IP",
                    "action": "建立计划活动",
                    "description": "准备质量登记单，关联产品与质量方法，记录计划日期和责任。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "CS/MP",
                    "action": "执行并更新",
                    "description": "登记实际活动、结果及不通过时的应对，持续维护证明材料索引。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "SB",
                    "action": "阶段审查",
                    "description": "核对已完成和未完成质量活动，支持阶段竣工报告和下一阶段安排。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "CP",
                    "action": "收尾核对",
                    "description": "用质量活动记录支持项目竣工报告，区分已通过、未通过和未执行事项。",
                    "provenance": "project-synthesis"
                }
            ]
        },
        "caseEntry": {
            "href": "../cases/waterproof-quality-records.html",
            "relatedLabel": "防水质量证据包",
            "relatedKind": "关联依据："
        },
        "caseView": {
            "identity": {
                "label": "住宅装修质量活动",
                "provenance": "fictional-case"
            },
            "summary": {
                "text": "以 QL-017 卫生间防水闭水检查为索引，分别呈现首次检查不通过和第二次检查待执行，保留各自的日期、版本与结果。",
                "provenance": "fictional-case"
            },
            "definition": {
                "label": "案例记录",
                "text": "QL-017 质量活动索引关联 WPF-011 防水系统。QA-WPF-01 为首次检查记录，QA-WPF-02 为已建立但待执行的复验记录。",
                "provenance": "fictional-case"
            },
            "purpose": {
                "label": "本次使用",
                "text": "跟踪检查是否实施、产品是否通过，以及不通过后的返工和复验。将活动结果与产品版本、证据包对应，不将返工完成写成验收通过。",
                "provenance": "fictional-case"
            },
            "sourceNote": "教学虚构案例；质量数值为项目约定，复验结果与接受决定待填写。",
            "composition": {
                "title": "组成内容",
                "kicker": "七项字段对应防水检查",
                "note": "",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "首次检查",
                        "href": "../cases/waterproof-quality-records.html#first-inspection"
                    },
                    {
                        "label": "失败与返工",
                        "href": "../cases/waterproof-quality-records.html#failure-rework"
                    },
                    {
                        "label": "待执行复验",
                        "href": "../cases/waterproof-quality-records.html#reinspection"
                    },
                    {
                        "label": "质量管理方法",
                        "href": "product-detail-v2.html?entry=quality-management-approach&mode=case"
                    },
                    {
                        "label": "工作包描述",
                        "href": "product-detail-v2.html?entry=work-package-description&mode=case"
                    }
                ],
                "items": [
                    {
                        "label": "质量标识符",
                        "text": "QL-017：卫生间防水闭水检查活动索引。首次检查记录为 QA-WPF-01，复验记录为 QA-WPF-02。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "产品标识符",
                        "text": "首次检查对象 WPF-011 v1.0；返工后复验对象 WPF-011 v1.1。共同依据 PD-WPF-11 v1.0。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "质量方法",
                        "text": "按产品描述 S06 进行闭水观察，复验同时核对 S04 节点连续性；核对水位、相邻区域湿痕及过程照片。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "日期",
                        "text": "首次实际开始 6 月 15 日 09:00，21:10 提前终止；原约定连续观察不少于 24 小时。复验计划 6 月 18 日 09:00 至 6 月 19 日 09:00，实际日期待填写。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "职责",
                        "text": "王志衡、赵建国检查；赵建国组织返工与自检；陈默决定停止交接并安排复验；许静维护记录关联。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "结果",
                        "text": "首次不通过：次卫门口出现湿痕，停止交接，局部返工。返工已完成，第二次检查待执行，尚无通过结论。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "记录",
                        "text": "关联 QR-WPF-01 失败处置、现场观察与影像索引、返工记录、QA-WPF-02 空白表。附件状态：仅有案例索引，未附工程文件。",
                        "provenance": "fictional-case"
                    }
                ]
            },
            "roles": {
                "title": "角色和动作",
                "kicker": "沿用证据包列明的动作",
                "note": "复验待执行。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "处置与人员记录",
                        "href": "../cases/waterproof-quality-records.html#failure-rework"
                    }
                ],
                "items": [
                    {
                        "name": "陈默 · 独立装修项目经理",
                        "relation": "项目经理",
                        "actions": [
                            "停止交接",
                            "安排复验"
                        ],
                        "description": "接受局部返工方案并安排第二次检查，不提前作出通过判断。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "许静 · 资料与协调专员",
                        "relation": "项目支持",
                        "actions": [
                            "登记",
                            "关联"
                        ],
                        "description": "关联失败处置、返工证据、版本和待复验表。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "赵建国 · 施工包工头",
                        "relation": "小组经理",
                        "actions": [
                            "报告失败",
                            "返工",
                            "自检"
                        ],
                        "description": "组织节点返工并提交自检证据。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "王志衡 · 第三方监理",
                        "relation": "项目保证",
                        "actions": [
                            "核查"
                        ],
                        "description": "核查失败事实、返工范围和复验前提。",
                        "provenance": "fictional-case"
                    }
                ],
                "boundary": {
                    "title": "复验结果留空",
                    "text": "WPF-011 v1.1 当前待复验；PD-WPF-11 仍为 v1.0。QA-WPF-01 的不通过结果保留，不被 QA-WPF-02 覆盖。",
                    "provenance": "fictional-case"
                }
            },
            "lifecycle": {
                "title": "生命周期",
                "kicker": "现有记录与后续审查",
                "note": "",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "质量活动总览",
                        "href": "../cases/waterproof-quality-records.html#overview"
                    }
                ],
                "items": [
                    {
                        "processCode": "IP",
                        "action": "安排检查",
                        "description": "闭水方法、日期与责任；建单日期待确认。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "CS/MP",
                        "action": "检查与复验",
                        "description": "首次不通过；返工后 v1.1 待复验，结果待填写。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "SB",
                        "action": "阶段审查（待开展）",
                        "description": "核对复验结果与未完成活动，确认阶段质量完成条件。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "CP",
                        "action": "收尾核对（待开展）",
                        "description": "汇集验收结论与移交证据；当前未收尾。",
                        "provenance": "fictional-case"
                    }
                ]
            }
        }
    };

    const qualityManagementApproach = {
        "slug": "quality-management-approach",
        "name": "质量管理方法",
        "englishName": "Quality management approach",
        "code": "A12",
        "kind": "management-approach",
        "identity": {
            "type": "management-approach",
            "label": "项目启动文件中的管理方法",
            "isFormalManagementProduct": false,
            "provenance": "manual-verbatim"
        },
        "parent": {
            "code": "A12",
            "name": "项目启动文件",
            "href": "product.html#entity-项目启动文件",
            "provenance": "manual-verbatim"
        },
        "summary": {
            "text": "明确项目采用的质量技术、标准、资源和责任，为各产品的质量控制提供共同安排。",
            "provenance": "project-synthesis"
        },
        "definition": {
            "label": "定义",
            "text": "对项目期间要应用的质量技术和标准，以及达到所需质量规格和验收准则的角色和职责的描述。",
            "sourceHref": "../chapters/glossary.html?v=quality-delivery-1#source-quality-management-approach-definition",
            "provenance": "manual-verbatim"
        },
        "purpose": {
            "label": "用途",
            "text": "质量管理方法的目的是描述在项目期间要应用的质量技术和标准，以及达到规定的质量规格和验收准则所需的角色和职责。",
            "sourceHref": "../chapters/ch08.html?v=quality-delivery-1#source-quality-management-approach-purpose",
            "provenance": "manual-verbatim"
        },
        "sourceNote": "原文：定义、用途、组成。归纳：角色、生命周期。",
        "composition": {
            "title": "组成内容",
            "kicker": "第 8 章 · 七项原文字段",
            "note": "归属：A12 项目启动文件。",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "组成内容原文",
                    "href": "../chapters/ch08.html?v=quality-delivery-1#source-quality-management-approach-composition"
                }
            ],
            "items": [
                {
                    "label": "范围",
                    "text": "描述质量管理方法范围内的产品和工作",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "质量管理程序",
                    "text": "描述项目质量计划和质量控制活动（例如，验收产品的程序）；应突出说明与业务标准的任何差异，同时提供差异的理由",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "职责",
                    "text": "定义质量计划和控制活动的职责（这应包括项目保证中用户、业务和支持组织之间的职责分工。）",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "资源",
                    "text": "用于质量计划、控制和保证活动，例如所需的任何测试设备",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "支持工具和技术",
                    "text": "用于质量计划和控制活动，包括要使用的任何系统及其使用方法，以及任何特定技术，例如测试、检查、原型制作",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "标准",
                    "text": "适用于质量管理的任何标准，包括质量登记单和其他质量记录的组成和格式",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "参考资料",
                    "text": "用于任何相关文件或产品，例如业务或供应商的质量管理体系",
                    "provenance": "manual-verbatim"
                }
            ]
        },
        "roles": {
            "title": "角色和动作",
            "kicker": "依据手册使用与质量职责归纳",
            "note": "管理、检查与接受职责分别列示。",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "质量实践的角色职责",
                    "href": "../chapters/ch08.html#pn-32"
                }
            ],
            "items": [
                {
                    "name": "项目经理",
                    "relation": "组织准备",
                    "actions": [
                        "咨询",
                        "准备",
                        "落实"
                    ],
                    "description": "咨询利益相关方准备方法，确保小组经理实施协定的质量控制。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "项目总监",
                    "relation": "批准",
                    "actions": [
                        "批准"
                    ],
                    "description": "批准质量管理方法。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "高级用户",
                    "relation": "用户质量需求",
                    "actions": [
                        "协定",
                        "提供资源"
                    ],
                    "description": "协定方法，提供执行用户质量活动和产品验收所需的人员资源。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "高级供应商",
                    "relation": "供应商质量安排",
                    "actions": [
                        "协定",
                        "提供资源"
                    ],
                    "description": "协定技术工具，提供供应商质量活动的人员和资源。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "小组经理",
                    "relation": "实施质量程序",
                    "actions": [
                        "实施",
                        "汇编",
                        "报告"
                    ],
                    "description": "实施工作包约定的质量程序，汇编记录并报告质量状态。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "项目保证",
                    "relation": "建议与保证",
                    "actions": [
                        "建议",
                        "确认"
                    ],
                    "description": "提出方法建议，确认与业务政策的一致性并保证实施情况。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "项目支持",
                    "relation": "行政支持",
                    "actions": [
                        "维护记录",
                        "协助应用"
                    ],
                    "description": "提供质量控制行政支持，维护相关登记单，协助应用程序。",
                    "provenance": "project-synthesis"
                }
            ],
            "boundary": {
                "title": "方法、规格和记录各有用途",
                "text": "方法规定技术、标准和责任；产品描述规定具体质量规格；质量登记单记录计划和结果，不能互相替代。",
                "provenance": "project-synthesis"
            }
        },
        "lifecycle": {
            "title": "生命周期",
            "kicker": "流程使用关系",
            "note": "",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "质量实践的管理产品",
                    "href": "../chapters/ch08.html#pn-31"
                }
            ],
            "items": [
                {
                    "processCode": "IP",
                    "action": "制定并协定",
                    "description": "结合初始产品描述制定方法，协定质量技术、标准和职责，按职权批准后作为管理基础。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "CS/MP",
                    "action": "应用到交付",
                    "description": "将质量安排落实到工作包和产品检查，记录活动与结果。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "SB/CP",
                    "action": "审查与改进",
                    "description": "结合阶段和收尾审查使用记录，识别偏差及可复用经验，需变更的安排按控制程序处理。",
                    "provenance": "project-synthesis"
                }
            ]
        },
        "caseEntry": {
            "href": "../cases/product-description-waterproofing.html",
            "relatedLabel": "防水产品描述与现有记录",
            "relatedKind": "关联依据："
        },
        "caseView": {
            "identity": {
                "label": "住宅装修质量方法教学拟稿",
                "provenance": "fictional-case"
            },
            "summary": {
                "text": "住宅装修项目的质量范围、检查程序、人员分工与记录要求。",
                "provenance": "fictional-case"
            },
            "definition": {
                "label": "案例拟稿",
                "text": "住宅装修质量管理方法，拟作为项目启动文件的组成部分。文件状态：教学拟稿，待协定、待批准。",
                "provenance": "fictional-case"
            },
            "purpose": {
                "label": "本次拟定",
                "text": "统一质量范围、程序、分工、资源和记录要求，以防水检查作为具体应用。需要周诚批准及用户、供应商协定的事项保持待确认。",
                "provenance": "fictional-case"
            },
            "sourceNote": "教学拟稿 · 待协定、待批准。法规及合同标准、设备清单待确认。",
            "composition": {
                "title": "组成内容",
                "kicker": "七项原文字段对应管理安排",
                "note": "待协定、待批准。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "整屋质量期望",
                        "href": "../cases/project-product-description.html#expectations"
                    },
                    {
                        "label": "防水质量规格",
                        "href": "../cases/product-description-waterproofing.html#specification"
                    },
                    {
                        "label": "质量登记单",
                        "href": "product-detail-v2.html?entry=quality-register&mode=case"
                    },
                    {
                        "label": "工作包描述",
                        "href": "product-detail-v2.html?entry=work-package-description&mode=case"
                    }
                ],
                "items": [
                    {
                        "label": "范围",
                        "text": "覆盖住宅设计、施工、固定安装和移交。WPF-011 防水系统适用本方法；整体验收依据项目产品描述。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "质量管理程序",
                        "text": "拟采用：先确定质量规格和检查方法，再执行并登记；不通过则停止交接、记录处置、返工后复验。与业务标准的差异及理由需在协定时核对。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "职责",
                        "text": "陈默组织管理；林悦代表用户质量期望；陆明远协调供应商资源；赵建国实施与自检；王志衡独立核查；许静维护记录。周诚批准本方法的安排尚待确认。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "资源",
                        "text": "拟安排施工检查人员、独立核查时间、闭水观察及影像记录条件。测试设备型号、预算与资源落实情况：待确认。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "支持工具和技术",
                        "text": "使用现场观察、闭水试验、照片索引和登记单追踪。按产品编号、描述版本及活动编号关联记录，失败与复验分别保存。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "标准",
                        "text": "引用已列明的 PD-WPF-11 v1.0 质量规格和项目产品描述验收条件。案例闭水不少于 24 小时为项目约定；实际适用法规、合同或企业标准清单待专业确认。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "参考资料",
                        "text": "项目产品描述、各产品描述、质量证据包及登记单。尚未提供独立的业主或供应商质量管理体系文件，不能声称已经符合该体系。",
                        "provenance": "fictional-case"
                    }
                ]
            },
            "roles": {
                "title": "角色和动作",
                "kicker": "拟定职责 · 待签认",
                "note": "协定、批准与资源承诺待确认。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "现有质量责任",
                        "href": "../cases/product-description-waterproofing.html#responsibility"
                    }
                ],
                "items": [
                    {
                        "name": "陈默 · 独立装修项目经理",
                        "relation": "项目经理",
                        "actions": [
                            "组织拟定"
                        ],
                        "description": "汇总质量安排，咨询参与方，检查工作包与方法一致。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "周诚 · 业主",
                        "relation": "项目总监",
                        "actions": [
                            "待批准"
                        ],
                        "description": "拟负责本方法批准。批准状态：待确认。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "林悦 · 业主",
                        "relation": "高级用户",
                        "actions": [
                            "待协定"
                        ],
                        "description": "确认用户质量期望及参与验收的安排。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "陆明远 · 装修公司负责人",
                        "relation": "高级供应商",
                        "actions": [
                            "待协定资源"
                        ],
                        "description": "确认供应商检查技术、人员和资源条件。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "赵建国 · 施工包工头",
                        "relation": "小组经理",
                        "actions": [
                            "实施质量程序"
                        ],
                        "description": "按协定程序组织施工自检、记录及问题反馈。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "王志衡 · 第三方监理",
                        "relation": "项目保证",
                        "actions": [
                            "提出建议",
                            "核查"
                        ],
                        "description": "独立核查程序和证据，不替代施工自检。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "许静 · 资料与协调专员",
                        "relation": "项目支持",
                        "actions": [
                            "维护登记单"
                        ],
                        "description": "维护质量记录与产品版本的关联。",
                        "provenance": "fictional-case"
                    }
                ],
                "boundary": {
                    "title": "拟稿不等于批准基准",
                    "text": "产品描述已批准；质量管理方法待协定、待批准，尚未生效。",
                    "provenance": "fictional-case"
                }
            },
            "lifecycle": {
                "title": "生命周期",
                "kicker": "拟定、应用与后续审查",
                "note": "批准记录待补充。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "质量实践的管理产品",
                        "href": "../chapters/ch08.html#pn-31"
                    }
                ],
                "items": [
                    {
                        "processCode": "IP",
                        "action": "拟定并待协定",
                        "description": "汇总现有材料，明确范围、技术、标准和职责，提交用户、供应商协定及项目总监批准。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "CS/MP",
                        "action": "以防水活动检验安排",
                        "description": "现有案例已记录首次失败和返工，借此检查方法是否覆盖停止交接、处置、复验及记录保留。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "SB/CP",
                        "action": "后续：审查和改进",
                        "description": "将缺少的标准清单、资源落实和实施效果作为审查事项，需变更的安排按授权处理。",
                        "provenance": "fictional-case"
                    }
                ]
            }
        }
    };

    const workPackageDescription = {
        "slug": "work-package-description",
        "name": "工作包描述",
        "englishName": "Work package description",
        "code": "A15",
        "kind": "baseline",
        "identity": {
            "type": "baseline",
            "label": "正式管理产品 · 基准",
            "isFormalManagementProduct": true,
            "provenance": "manual-verbatim"
        },
        "summary": {
            "text": "在项目经理与小组经理之间明确交付工作、产品、约束和控制安排。",
            "provenance": "project-synthesis"
        },
        "definition": {
            "label": "定义",
            "text": "与交付一个或多个产品相关的成套信息。它将包含要执行的活动的描述、所涉及的资源的识别、要交付的产品的相关产品描述，以及任何生产约束的细节。",
            "sourceHref": "../chapters/glossary.html?v=quality-delivery-1#source-work-package-description-definition",
            "provenance": "manual-verbatim"
        },
        "purpose": {
            "label": "用途",
            "text": "工作包描述的目的是描述如何生产和交付一个或多个产品。它用于将工作职责正式传递给小组经理或小组成员。",
            "sourceHref": "../chapters/appendix_a.html?v=quality-delivery-1#source-work-package-description-purpose",
            "provenance": "manual-verbatim"
        },
        "sourceNote": "原文：定义、用途、组成。归纳：角色、生命周期。",
        "composition": {
            "title": "组成内容",
            "kicker": "附录 A15 · 十一项原文字段",
            "note": "工作与授权安排；产品要求及完成证据另行关联。",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "组成内容原文",
                    "href": "../chapters/appendix_a.html?v=quality-delivery-1#source-work-package-description-composition"
                }
            ],
            "items": [
                {
                    "label": "待完成工作描述",
                    "text": "工作说明书和相关的工作分解结构",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "小组经理或授权人员",
                    "text": "负责工作包的小组经理或个人的姓名",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "产品描述",
                    "text": "与工作包关联的产品描述",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "技术和程序",
                    "text": "关于如何完成工作的需求",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "变更控制需求",
                    "text": "对工作包范围内的项目和产品基线的控制安排",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "约束",
                    "text": "对工作的限制，如授权工作时间、安全和安保措施",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "监视、控制和报告",
                    "text": "描述如何监视、控制和报告工作包",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "目标和容许偏差",
                    "text": "工作包的范围、成本和时间的容许偏差",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "参考资料",
                    "text": "来自更高阶层计划的适用参考资料",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "批准",
                    "text": "批准已完成产品的人员",
                    "provenance": "manual-verbatim"
                },
                {
                    "label": "协议",
                    "text": "项目经理和小组经理之间工作包的初始授权和最终完成情况的记录",
                    "provenance": "manual-verbatim"
                }
            ]
        },
        "roles": {
            "title": "角色和动作",
            "kicker": "依据手册使用与质量职责归纳",
            "note": "管理、检查与接受职责分别列示。",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "A15 使用表",
                    "href": "../chapters/appendix_a.html?v=quality-delivery-1#source-work-package-description-usage"
                }
            ],
            "items": [
                {
                    "name": "项目经理",
                    "relation": "创建与控制",
                    "actions": [
                        "创建",
                        "审查",
                        "更新"
                    ],
                    "description": "在阶段控制中创建、审查和更新工作包描述。",
                    "provenance": "project-synthesis"
                },
                {
                    "name": "小组经理",
                    "relation": "接收与交付",
                    "actions": [
                        "验收",
                        "审查",
                        "检查"
                    ],
                    "description": "在产品交付管理中接收工作包安排并审查、检查相关工作。",
                    "provenance": "project-synthesis"
                }
            ],
            "boundary": {
                "title": "工作包接收与产品接受不同",
                "text": "小组经理接收工作包，不等于用户已接受产品。工作包描述中的批准人员和初始授权、最终完成记录应明确区分。",
                "provenance": "project-synthesis"
            }
        },
        "lifecycle": {
            "title": "生命周期",
            "kicker": "流程使用关系",
            "note": "",
            "provenance": "project-synthesis",
            "evidence": [
                {
                    "label": "A15 使用表",
                    "href": "../chapters/appendix_a.html?v=quality-delivery-1#source-work-package-description-usage"
                }
            ],
            "items": [
                {
                    "processCode": "CS",
                    "action": "阶段控制：创建、审查、更新",
                    "description": "项目经理明确工作、产品、约束、控制及授权安排。",
                    "provenance": "project-synthesis"
                },
                {
                    "processCode": "MP",
                    "action": "产品交付管理：验收、审查、检查",
                    "description": "小组经理与项目经理就交付工作达成协定，实施并反馈完成情况。",
                    "provenance": "project-synthesis"
                }
            ]
        },
        "caseEntry": {
            "href": "../cases/product-description-waterproofing.html",
            "relatedLabel": "防水产品描述与现有记录",
            "relatedKind": "关联依据："
        },
        "caseView": {
            "identity": {
                "label": "防水工作包描述教学拟稿",
                "provenance": "fictional-case"
            },
            "summary": {
                "text": "WPF-011 防水系统的交付范围、质量要求、控制条件与双方职责。",
                "provenance": "fictional-case"
            },
            "definition": {
                "label": "案例拟稿",
                "text": "卫生间防水工作包描述，交付对象为 WPF-011。文件状态：教学拟稿，授权待确认。",
                "provenance": "fictional-case"
            },
            "purpose": {
                "label": "本次拟定",
                "text": "把交付工作、责任、质量要求、变更控制和完成条件写清楚。未提供的授权日期、工作包预算和容许偏差留待双方协定。",
                "provenance": "fictional-case"
            },
            "sourceNote": "教学拟稿 · 工作包授权、预算、工期及容许偏差待协定；接收与完成签认待确认。",
            "composition": {
                "title": "组成内容",
                "kicker": "十一项字段对应防水交付",
                "note": "WPF-011；授权及控制条件待协定。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "产品定义与边界",
                        "href": "../cases/product-description-waterproofing.html#definition"
                    },
                    {
                        "label": "开发方法",
                        "href": "../cases/product-description-waterproofing.html#method"
                    },
                    {
                        "label": "质量登记单",
                        "href": "product-detail-v2.html?entry=quality-register&mode=case"
                    },
                    {
                        "label": "质量管理方法",
                        "href": "product-detail-v2.html?entry=quality-management-approach&mode=case"
                    }
                ],
                "items": [
                    {
                        "label": "待完成工作描述",
                        "text": "完成卫生间防水系统及相关检查记录，涵盖基层交接、节点加强、防水施工、闭水检查和保护交接。当前失败处置为局部返工并复验。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "小组经理或授权人员",
                        "text": "拟由赵建国，施工包工头兼施工小组经理负责；正式接收工作包的协议记录待双方确认。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "产品描述",
                        "text": "PD-WPF-11 v1.0；实际产品 WPF-011 返工后为 v1.1、待复验。描述文件与实际产品版本分别管理。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "技术和程序",
                        "text": "依据既有开发方法组织基层、节点、分遍施工和检查；返工按局部处理方案完成后复验。不新增未经确认的施工标准。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "变更控制需求",
                        "text": "拟要求范围、材料、质量规格和交付条件变化先由陈默组织评估并按授权处理。本次返工未改变质量规格，不自动升级产品描述。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "约束",
                        "text": "遵守物业作业限制及现场安全安排，保护未交接成果。当前墙地面饰面仍停止；具体授权时段和安全措施清单待核对。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "监视、控制和报告",
                        "text": "赵建国报告质量、进度及偏差，许静维护证据索引，陈默审查并安排处置。检查点报告频率尚未给定，须协定，不另造每日或每周承诺。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "目标和容许偏差",
                        "text": "范围限于约定防水成果及证据；成本、时间目标与容许偏差未在既有文件中单列，待协定。不能沿用整项目 42 万元、16 周作为工作包授权。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "参考资料",
                        "text": "引用现有阶段计划摘要、PD-WPF-11 v1.0、整屋验收条件和防水质量记录。阶段计划的工作包资源与时段明细仍需核对。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "批准",
                        "text": "既有防水案例中由陈默根据检查结果决定接受、拒绝或复验；本拟稿采用该安排，仍需在工作包协议中确认，不推广为所有项目的默认职权。",
                        "provenance": "fictional-case"
                    },
                    {
                        "label": "协议",
                        "text": "初始授权与最终完成情况应分别记录。当前没有本工作包独立授权签认；复验未执行，也没有最终接受或工作包完成签认。",
                        "provenance": "fictional-case"
                    }
                ]
            },
            "roles": {
                "title": "角色和动作",
                "kicker": "项目经理与小组经理协定",
                "note": "人员分工：拟定；工作包授权：待确认。",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "现有交付责任",
                        "href": "../cases/product-description-waterproofing.html#responsibility"
                    }
                ],
                "items": [
                    {
                        "name": "陈默 · 独立装修项目经理",
                        "relation": "项目经理",
                        "actions": [
                            "拟定",
                            "协定",
                            "控制"
                        ],
                        "description": "明确交付边界、容许偏差和报告安排，审查结果并控制交接。正式授权待确认。",
                        "provenance": "fictional-case"
                    },
                    {
                        "name": "赵建国 · 施工包工头",
                        "relation": "小组经理",
                        "actions": [
                            "接收协定",
                            "组织交付",
                            "反馈"
                        ],
                        "description": "核对工作与资源条件，按协定实施并报告结果；不把返工结束视为最终完成。",
                        "provenance": "fictional-case"
                    }
                ],
                "boundary": {
                    "title": "返工完成，工作包尚不能据此关闭",
                    "text": "当前 WPF-011 v1.1 待复验。质量结果、产品接受与工作包最终完成签认分别待确认。",
                    "provenance": "fictional-case"
                }
            },
            "lifecycle": {
                "title": "生命周期",
                "kicker": "从约定工作到确认交付",
                "note": "",
                "provenance": "fictional-case",
                "evidence": [
                    {
                        "label": "A15 使用表",
                        "href": "../chapters/appendix_a.html?v=quality-delivery-1#source-work-package-description-usage"
                    }
                ],
                "items": [
                    {
                        "processCode": "CS",
                        "action": "拟定与控制：补齐授权条件",
                        "description": "陈默与赵建国核对工作、预算、时限、容许偏差、报告频率和接受条件；缺失条件待协定。",
                        "provenance": "fictional-case"
                    },
                    {
                        "processCode": "MP",
                        "action": "实施与反馈：复验仍待执行",
                        "description": "既有案例中返工已经完成，但产品仍待复验。小组经理反馈实际结果后，再依据协定确认交付和完成。",
                        "provenance": "fictional-case"
                    }
                ]
            }
        }
    };

    // 问题实例以现有防水证据包为依据，字段映射与纸面记录共用数据。
    var issueRecord = {
        id: "ISS-WPF-001", title: "次卫门口防水节点不连续，首次闭水不通过",
        summary: ["不合格项", "陈默 · 项目经理（拟任）", "已采取行动 · 待复验"],
        fields: [
            ["问题标识符", "ISS-WPF-001 · 关联 WPF-011 卫生间防水系统。"],
            ["问题描述", [["发现", "首次闭水约 12 小时后，次卫门口外侧墙根出现约 120 mm 湿痕，检查提前终止。"], ["原因", "剥检确认门口右端附加层局部不连续，未满足 S04、S06 准则。"], ["影响", "停止产品交接及后续饰面；实际返工成本、工期影响待评估。"]]],
            ["问题类型", "不合格项"],
            ["分级", [["优先级", "待评定"], ["严重性", "待评定"], ["现场控制", "保持交接及饰面暂停，复验通过后再确认放行。"]]],
            ["问题负责人", "陈默 · 项目经理，拟任；问题负责人任命待确认。"],
            ["状态", [["当前", "已采取行动，返工完成，复验待执行；未关闭。"], ["决策", "陈默接受局部返工并复验的处置方案，停止交接；原失败结果保留。"], ["执行", "赵建国组织返工，王志衡核查，许静关联记录；实际产品由 v1.0 更新为 v1.1，产品描述仍为 v1.0。"], ["关闭条件", "取得 QA-WPF-02 复验结果，确认交接条件及问题解决情况；关闭决定待记录。"]]],
            ["问题相关日期", [["事件发现", "6 月 15 日 21:10，原记录未注明年份。"], ["登记／上次审查", "待补充。"], ["计划复验", "6 月 18 日 09:00 至 6 月 19 日 09:00；执行结果待填写。"], ["行动截止／解决日期", "待确认／未关闭。"]]]
        ],
        sources: [
            ["QA-WPF-01 · 首次检查", "../cases/waterproof-quality-records.html#first-inspection"],
            ["QR-WPF-01 / RW-WPF-01 · 处置与返工", "../cases/waterproof-quality-records.html#failure-rework"],
            ["QA-WPF-02 · 待执行复验", "../cases/waterproof-quality-records.html#reinspection"],
            ["质量登记单", "product-detail-v2.html?entry=quality-register&mode=case"],
            ["关联风险 RISK-007", "product-detail-v2.html?entry=risk-register&mode=case#lesson-detail-RISK-007"]
        ],
        missing: "独立问题报告：未附；分级、影响评估及关闭记录：待补充。"
    };
    var issueFieldPairs = [
        ["问题标识符", "问题的唯一参考"], ["问题描述", "问题摘要"],
        ["问题类型", "难点问题、关注、外部事件、商业机会、变更请求和不合格项"],
        ["分级", "优先级和严重性的评级"], ["问题负责人", "负责问题的方方面面"],
        ["状态", "问题的当前状态，例如，已记录、已审查、已采取行动、已上报和已解决"],
        ["问题相关日期", "例如，提出日期、上次审查日期、行动截止日期和解决日期"],
        ["记录", "与问题关联的文件列表及其位置"]
    ];
    var issueEvidence = [{ label: "问题登记单原文", href: "../chapters/ch10.html#source-issue-register-practice" }];
    var issueRegister = {
        slug: "issue-register", name: "问题登记单", englishName: "Issue register", code: "A13", kind: "record-component",
        identity: { type: "record-component", label: "项目记录单组成项", isFormalManagementProduct: false, provenance: "manual-verbatim" },
        parent: { code: "A13", name: "项目记录单", href: "product.html#entity-项目记录单", provenance: "manual-verbatim" },
        summary: { text: "问题、决策、行动及解决状态。", provenance: "project-synthesis" },
        definition: { label: "定义", text: "用于捕获和维护有关正式管理的所有问题的信息的登记单。问题登记单应该由项目经理定期进行监视。", sourceHref: "../chapters/glossary.html#source-issue-register-definition", provenance: "manual-verbatim" },
        purpose: { label: "用途", text: "问题登记单的目的是，记录在项目生命周期中提交的所有问题报告、报告的当前状态和关闭日期。", sourceHref: "../chapters/ch10.html#source-issue-register-purpose", provenance: "manual-verbatim" },
        sourceNote: "定义：术语表。用途：第 10 章。字段：附录 A13。角色与生命周期：项目归纳。",
        composition: {
            title: "组成内容", kicker: "附录 A13 · 八项字段", note: "第 10 章另列“决策”，案例在状态详情中保留。", provenance: "project-synthesis",
            evidence: [{ label: "附录八项字段", href: "../chapters/appendix_a.html#source-issue-register-composition" }].concat(issueEvidence),
            items: issueFieldPairs.map(function (pair) { return { label: pair[0], text: pair[1], provenance: "manual-verbatim" }; })
        },
        roles: {
            title: "角色和动作", kicker: "管理、执行与记录", note: "", provenance: "project-synthesis",
            evidence: [{ label: "问题实践角色职责", href: "../chapters/ch10.html#pn-26" }],
            items: [
                { name: "项目经理", relation: "管理问题", actions: ["评估", "协调", "上报"], description: "管理问题处理程序，维护登记单并实施纠正行动；超出权限的事项上报。" },
                { name: "小组经理", relation: "工作包执行", actions: ["报告", "纠正"], description: "执行工作包约定的问题处理程序，反馈纠正行动结果。" },
                { name: "项目支持", relation: "记录维护", actions: ["登记", "关联"], description: "维护记录、基线及关联资料，协助准备问题报告。" },
                { name: "项目保证", relation: "独立审查", actions: ["建议", "核查"], description: "审查问题评估与解决是否符合问题管理方法。" }
            ],
            boundary: { title: "登记单与问题报告", text: "登记单持续维护问题及其状态；需要进一步分析的问题另附问题报告。并非每条登记都需要独立报告。", provenance: "project-synthesis" }
        },
        lifecycle: {
            title: "生命周期", kicker: "持续维护", note: "", provenance: "project-synthesis",
            evidence: [{ label: "项目记录单使用", href: "../chapters/appendix_a.html#source-project-log-usage" }],
            items: [
                { processCode: "IP", action: "建立登记单", description: "建立正式记录，必要时承接准备阶段日志中的问题。" },
                { processCode: "CS", action: "审查与处理", description: "更新影响、分级、责任、决策与状态；按权限处理或上报。" },
                { processCode: "MP", action: "执行与反馈", description: "记录工作包纠正行动、结果及相关证据。" },
                { processCode: "SB", action: "阶段审查", description: "核对未解决问题及下一阶段影响，更新行动与责任。" },
                { processCode: "CP", action: "收尾与移交", description: "确认解决情况；遗留事项明确接收方和后续安排。" }
            ]
        },
        caseEntry: { href: "../cases/waterproof-quality-records.html#failure-rework", relatedLabel: "防水处置证据", relatedKind: "关联记录：" },
        caseRecords: [issueRecord],
        caseView: {
            identity: { label: "住宅装修教学案例", provenance: "fictional-case" },
            summary: { text: "防水不合格处置：返工完成，复验待执行。", provenance: "fictional-case" },
            definition: { label: "案例记录", text: "ISS-WPF-001 · 次卫门口防水节点不连续。", provenance: "fictional-case" },
            purpose: { label: "处理目标", text: "恢复节点连续性，通过复验并确认产品交接条件。", provenance: "fictional-case" },
            sourceNote: "教学虚构案例 · 依据防水检查与返工记录。",
            composition: {
                title: "组成内容", kicker: "ISS-WPF-001 · 八项字段", note: "", provenance: "fictional-case",
                evidence: [{ label: "防水证据包", href: "../cases/waterproof-quality-records.html#overview" }],
                items: issueRecord.fields.map(function (pair) { return { label: pair[0], text: Array.isArray(pair[1]) ? pair[1].map(function (part) { return part[0] + "：" + part[1]; }).join(" ") : pair[1], provenance: "fictional-case" }; }).concat([{ label: "记录", text: "QA-WPF-01、QR-WPF-01、RW-WPF-01、QA-WPF-02；关联质量登记单及 RISK-007。", provenance: "fictional-case" }])
            },
            roles: {
                title: "角色和动作", kicker: "防水处置分工", note: "", provenance: "fictional-case",
                evidence: [{ label: "返工处置分工", href: "../cases/waterproof-quality-records.html#failure-rework" }],
                items: [
                    { name: "陈默 · 项目经理", relation: "处置协调", actions: ["决定", "安排"], description: "接受返工方案，停止交接，安排复验；问题负责人任命待确认。" },
                    { name: "赵建国 · 施工包工头", relation: "施工小组经理", actions: ["报告", "返工"], description: "报告失败，组织局部返工并提交自检证据。" },
                    { name: "王志衡 · 监理", relation: "项目保证", actions: ["核查"], description: "核查失败事实、返工范围与复验前提。" },
                    { name: "许静 · 资料协调", relation: "项目支持", actions: ["登记", "关联"], description: "关联失败、返工证据和产品版本。" }
                ]
            },
            lifecycle: {
                title: "处置进程", kicker: "事实、行动与待办", note: "", provenance: "fictional-case",
                evidence: [{ label: "处置与复验", href: "../cases/waterproof-quality-records.html#overview" }],
                items: [
                    { processCode: "CS", action: "发现与记录", description: "6 月 15 日首次闭水不通过，停止产品交接；年份未注明。" },
                    { processCode: "CS", action: "决定处置", description: "确认局部缺陷，陈默接受局部返工并复验的方案。" },
                    { processCode: "MP", action: "完成返工", description: "赵建国组织返工，形成 WPF-011 v1.1，描述文件仍为 v1.0。" },
                    { processCode: "CS", action: "复验待执行", description: "QA-WPF-02 计划 6 月 18 日至 19 日执行，结果待填写。" },
                    { processCode: "CS", action: "关闭待确认", description: "复验结果、交接条件及问题关闭决定待记录。" }
                ]
            }
        }
    };


    const planFieldPairs = [["范围","计划范围（项目、阶段、团队和例外）的描述"],["依赖关系","计划所依赖的外部产品或活动"],["计划假设和先决条件","计划所基于的假设以及计划取得成功所必须建立或保持的任何基础方面"],["包括的经验教训","已经过审查并纳入本计划的，以前类似项目的相关经验教训细节"],["要交付的产品","计划范围内的产品分解结构、产品流程图和产品描述"],["要执行的工作","通过工作分解结构和相关的工作包描述显示的计划范围内的工作"],["预算","项目成本，包括风险预算和变更预算"],["进度表","项目阶段和活动、项目持续时间和顺序的表示形式，例如甘特图"],["目标和容许偏差","绩效目标，以及计划层面上的范围、成本和时间容许偏差。阶段计划和小组计划还可能包括可持续性和风险容许偏差"],["监视、控制和报告安排","描述如何监视和控制项目以及报告程序和职责"]];
    const planEvidence = [{ label: "附录 A9 概括性内容", href: "../chapters/appendix_a.html#source-plan-composition" }];
    const planSummaries = [
        "128㎡住宅全屋装修，交付可入住住宅及竣工资料包；不含前期搬迁和入住后维护。",
        "物业作业条件、家庭需求确认、材料交期与资金安排；相关确认凭据待补。",
        "住宅可按约定移交施工，关键产品描述可供执行；进场条件及采购提前期待确认。",
        "封闭前检查留照、定位样板、长周期主材预警；纳入审查及应用效果待核验。",
        "HOME-025 与 HAN-024 为最终交付，专业系统按既有台账编号分解并保留验收依赖。",
        "陈默统筹设计、拆除、隐蔽工程、饰面、定制安装和交接工作；以工作包分派责任。",
        "沿用商业论证六项分配，合计42万元，含5万元风险余量；变更预算划分待确认。",
        "目标16周，案例第8周进行阶段边界复查；周序起算日期与供应排产待确认。",
        "总投入不突破42万元，目标16周、最多延后1周；防水和用电安全不接受降级。",
        "周度检查工作包及交付预测，阶段边界审查剩余计划；超出容许偏差预测上报。"
    ];
    const projectPlan = {
        slug: "project-plan", name: "项目计划", englishName: "Project plan", code: "A9", kind: "plan-type",
        identity: { type: "plan-type", label: "计划类型", isFormalManagementProduct: false, provenance: "manual-verbatim",
            evidence: [{ label: "计划层级", href: "../chapters/ch07.html#pn-7" }] },
        parent: { code: "A9", name: "计划", href: "product.html#entity-计划", provenance: "manual-verbatim" },
        summary: { text: "项目层交付、阶段边界、资源和成本安排。", provenance: "project-synthesis" },
        legacyHref: "product.html#entity-项目计划",
        definition: { label: "定义", text: "一项说明项目的主要产品及其交付日期、交付方式和相应成本的高层次计划。",
            provenance: "manual-verbatim", sourceHref: "../chapters/ch07.html#source-project-plan-definition" },
        purpose: { label: "用途", text: "项目计划的目的是为项目管理委员会提供信心，即项目将完成其商业论证。项目计划还告知项目管理团队，他们有一种可行的方法在批准的资源和容许偏差范围内交付所需的产品。",
            provenance: "manual-verbatim", sourceHref: "../chapters/ch07.html#source-project-plan-purpose" },
        sourceNote: "定义与用途：第7章原文。组成：附录A9。职责与生命周期：项目归纳。",
        composition: { title: "组成内容", kicker: "附录 A9 · 十项内容", note: "", provenance: "manual-verbatim", evidence: planEvidence,
            items: planFieldPairs.map(function (pair) { return { label: pair[0], text: pair[1], provenance: "manual-verbatim" }; }) },
        roles: { title: "角色和动作", kicker: "编制、保证与授权", note: "", provenance: "project-synthesis",
            evidence: [{ label: "A9 使用表", href: "../chapters/appendix_a.html#source-plan-usage" }],
            items: [
                { name: "项目经理", relation: "计划管理", actions: ["编制", "检查", "更新"], description: "在项目启动编制项目计划，在阶段边界检查和更新，在收尾审查。" },
                { name: "项目管理委员会", relation: "项目层授权", actions: ["批准", "审查", "检查"], description: "批准项目计划，并审查影响基线和项目继续开展的变更。" },
                { name: "项目保证", relation: "独立保证", actions: ["建议", "审查"], description: "在项目启动和阶段边界提供建议，检查计划是否现实、可行。" },
                { name: "项目支持", relation: "记录支持", actions: ["整理", "关联"], description: "协助维护版本、产品台账和审查资料，不替代批准职权。" }
            ],
            boundary: { title: "计划类型", text: "阶段计划细化一个管理阶段；小组计划用于执行工作包且可选。例外计划用于获授权的重新规划，不是固定的第四个层级。", provenance: "project-synthesis" } },
        lifecycle: { title: "生命周期", kicker: "编制、授权与复查", note: "", provenance: "project-synthesis",
            evidence: [{ label: "项目计划使用", href: "../chapters/ch07.html#pn-8" }, { label: "A9 使用表", href: "../chapters/appendix_a.html#source-plan-usage" }],
            items: [
                { processCode: "IP", action: "编制项目计划", description: "明确主要产品、工作包、阶段边界、资源和成本，提交项目管理委员会。" },
                { processCode: "DP", action: "批准与设定基线", description: "批准后提供衡量进展的基线；审查与批准凭据随版本保留。" },
                { processCode: "SB", action: "检查与更新", description: "比较实际进展和剩余预测，更新项目计划并准备下一阶段计划。" },
                { processCode: "DP", anchor: "DP-review", action: "审查变更与继续授权", description: "必要的项目计划变更由项目管理委员会批准；超差按例外程序处理。" },
                { processCode: "CP", action: "收尾审查", description: "对照计划核对交付与绩效，记录差异和遗留事项。" }
            ] },
        caseEntry: { href: "../cases/renovation.html#full-business-case", title: "住宅装修计划关联", description: "启动、阶段边界与收尾。", linkLabel: "打开项目时间线" },
        caseView: {
            identity: { label: "住宅装修教学案例", provenance: "fictional-case" },
            summary: { text: "16周交付安排 · 42万元投资边界 · 第8周阶段复查。", provenance: "fictional-case" },
            definition: { label: "计划范围", text: planSummaries[0], provenance: "fictional-case" },
            purpose: { label: "交付目标", text: "形成可安全入住住宅，完成家庭验收及资料移交。", provenance: "fictional-case" },
            sourceNote: "教学虚构案例 · 计划拟稿 · 授权状态待确认。",
            composition: { title: "组成内容", kicker: "项目层计划", note: "", provenance: "fictional-case",
                evidence: [{ label: "完整商业论证", href: "product-detail-v2.html?entry=full-business-case&mode=case" }],
                items: planFieldPairs.map(function (pair, index) { return { label: pair[0], text: planSummaries[index], provenance: "fictional-case" }; }) },
            roles: { title: "角色和动作", kicker: "计划责任分工", note: "", provenance: "fictional-case",
                evidence: [{ label: "人物与项目组织", href: "../cases/renovation.html#people-title" }],
                items: [
                    { name: "陈默 · 独立装修项目经理", relation: "项目经理", actions: ["编制", "复查", "上报"], description: "统筹产品、资源、进度和成本预测，准备阶段边界审查材料。" },
                    { name: "周诚 · 业主，林悦 · 业主，陆明远 · 装修公司负责人", relation: "项目管理委员会", actions: ["审查", "批准"], description: "分别代表业务、用户和供应方审查项目层计划；签认资料待补。" },
                    { name: "王志衡 · 第三方监理", relation: "项目保证", actions: ["核查", "建议"], description: "核查关键检查点、证据与计划可行性，不代替用户验收。" },
                    { name: "许静 · 资料协调专员", relation: "项目支持", actions: ["维护", "关联"], description: "维护计划版本、台账、问题和质量资料的交叉引用。" }
                ] },
            lifecycle: { title: "计划管理历程", kicker: "时点与核验状态", note: "", provenance: "fictional-case",
                evidence: [{ label: "项目时间线", href: "../cases/renovation.html#full-business-case" }],
                items: [
                    { processCode: "IP", action: "第2至3周：编制", description: "依据商业论证汇总16周目标、42万元边界及产品交付安排，形成拟稿。" },
                    { processCode: "DP", action: "授权：待确认", description: "周诚、林悦、陆明远审查目标、需求与供应能力；计划批准凭据待补。" },
                    { processCode: "SB", action: "第8周：拟复查", description: "核对隐蔽工程产品、实际成本、定制交期及下一阶段资源；结果待记录。" },
                    { processCode: "DP", anchor: "DP-review", action: "变更：按需审查", description: "陈默提交影响分析，项目管理委员会在授权范围内决定；具体决定待记录。" },
                    { processCode: "CP", action: "第16周：拟收尾", description: "对照HOME-025和HAN-024核对家庭验收、资料移交及遗留问题；结果待记录。" }
                ] }
        }
    };
    window.PRINCE2_PRODUCT_DETAILS_V2 = Object.freeze({
        version: "2026-08-12",
        provenanceLabels: provenanceLabels,
        entries: Object.freeze({
            "outline-business-case": outlineBusinessCase,
            "full-business-case": fullBusinessCase,
            "product-register": productRegister,
            "product-description": productDescription,
            "project-brief": projectBrief,
            "project-product-description": projectProductDescription,
            "risk-register": riskRegister,
            "issue-register": issueRegister,
            "lessons-log": lessonsLog,
            "quality-register": qualityRegister,
            "quality-management-approach": qualityManagementApproach,
            "work-package-description": workPackageDescription,
            "project-plan": projectPlan
        })
    });
}());
