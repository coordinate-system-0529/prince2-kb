(function (global) {
    'use strict';

    global.PRINCE2_PRODUCT_TAXONOMY = {
        edition: 'PRINCE2 7',
        source: 'Appendix A',
        counts: {
            total: 15,
            baseline: 7,
            report: 7,
            record: 1
        },
        typeLabels: {
            baseline: '基准',
            report: '报告',
            record: '项目记录单'
        },
        products: [
            {
                id: 'business-case',
                code: 'A1',
                name: '商业论证',
                type: 'baseline',
                detailId: 'entity-商业论证',
                components: ['概要商业论证', '完整商业论证']
            },
            { id: 'checkpoint-report', code: 'A2', name: '检查点报告', type: 'report', detailId: 'entity-检查点报告', components: [] },
            { id: 'end-project-report', code: 'A3', name: '项目竣工报告', type: 'report', detailId: 'entity-项目竣工报告', components: [] },
            { id: 'end-stage-report', code: 'A4', name: '阶段竣工报告', type: 'report', detailId: 'entity-阶段竣工报告', components: [] },
            { id: 'exception-report', code: 'A5', name: '例外报告', type: 'report', detailId: 'entity-例外报告', components: [] },
            { id: 'highlight-report', code: 'A6', name: '要点报告', type: 'report', detailId: 'entity-要点报告', components: [] },
            { id: 'issue-report', code: 'A7', name: '问题报告', type: 'report', detailId: 'entity-问题报告', components: [] },
            { id: 'lessons-report', code: 'A8', name: '经验教训报告', type: 'report', detailId: 'entity-经验教训报告', components: [] },
            {
                id: 'plan',
                code: 'A9',
                name: '计划',
                type: 'baseline',
                detailId: 'entity-计划',
                components: ['项目计划', '阶段计划', '例外计划', '小组计划']
            },
            { id: 'product-description', code: 'A10', name: '产品描述', type: 'baseline', detailId: 'entity-产品描述', components: [] },
            { id: 'project-brief', code: 'A11', name: '项目概述文件', type: 'baseline', detailId: 'entity-项目概述文件', components: [] },
            {
                id: 'project-initiation-documentation',
                code: 'A12',
                name: '项目启动文件',
                type: 'baseline',
                detailId: 'entity-项目启动文件',
                components: [
                    '收益管理方法',
                    '变更管理方法',
                    '商务管理方法',
                    '沟通管理方法',
                    '数字化和数据管理方法',
                    '问题管理方法',
                    '质量管理方法',
                    '风险管理方法',
                    '可持续性管理方法'
                ]
            },
            {
                id: 'project-log',
                code: 'A13',
                name: '项目记录单',
                type: 'record',
                detailId: 'entity-项目记录单',
                components: ['日志', '问题登记单', '经验教训记录单', '产品登记单', '质量登记单', '风险登记单']
            },
            { id: 'project-product-description', code: 'A14', name: '项目产品描述', type: 'baseline', detailId: 'entity-项目产品描述', components: [] },
            { id: 'work-package-description', code: 'A15', name: '工作包描述', type: 'baseline', detailId: 'entity-工作包描述', components: [] }
        ]
    };
}(window));
