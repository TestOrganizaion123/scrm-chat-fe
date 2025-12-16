<template>
    <button ref="dateRangePicker" class="w-[42px] h-[42px] rounded-[12px] border border-[#e4e6eb] flex items-center justify-center text-[#1a1a1a] bg-white hover:bg-[#f5f5f5] cursor-pointer transition-colors">
        <img src="/icon/icon-calender.svg" alt="" />
    </button>
</template>

<script>
export default {
    mounted() {
        const $ = window.$
        const moment = window.moment

        if (!$) {
            console.error('jQuery is not loaded')
            return
        }
        if (!moment) {
            console.error('Moment.js is not loaded')
            return
        }

        const el = $(this.$refs.dateRangePicker)

        el.daterangepicker(
            {
                opens: 'left',
                showDropdowns: true,
                alwaysShowCalendars: true,
                ranges: {
                    'Tất cả thời gian': [moment('2020-01-01'), moment()],
                    'Hôm nay': [moment(), moment()],
                    'Hôm qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '7 ngày qua': [moment().subtract(6, 'days'), moment()],
                    '30 ngày qua': [moment().subtract(29, 'days'), moment()],
                    'Tuần này': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                    'Tuần trước': [moment().subtract(1, 'week').startOf('isoWeek'), moment().subtract(1, 'week').endOf('isoWeek')],
                    'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                    'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                locale: {
                    format: 'DD/MM/YYYY',
                    separator: ' - ',
                    applyLabel: 'Cập nhật',
                    cancelLabel: 'Hủy',
                    fromLabel: 'Từ',
                    toLabel: 'Đến',
                    customRangeLabel: 'Tùy chỉnh',
                    weekLabel: 'W',
                    daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                    monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                    firstDay: 1
                }
            },
            (start, end, label) => {
                this.$emit('change', { start, end, label })
            }
        )
    },

    methods: {}
}
</script>

<style>
/* Custom styles for daterangepicker to match the design */
.daterangepicker {
    font-family: 'Inter', sans-serif;
    border: 1px solid #e4e6eb;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 12px;
}

.daterangepicker .ranges li {
    font-size: 13px;
    background-color: #fff;
    border-radius: 6px;
    color: #1a1a1a;
    padding: 8px 12px;
    margin-bottom: 2px;
}

.daterangepicker .ranges li:hover {
    background-color: #f5f5f5;
    color: #1a1a1a;
}

.daterangepicker .ranges li.active {
    background-color: #e7f3ff;
    color: #1a56db;
    font-weight: 600;
}

.daterangepicker .calendar-table th,
.daterangepicker .calendar-table td {
    font-size: 13px;
}

.daterangepicker td.active,
.daterangepicker td.active:hover {
    background-color: #1a56db;
}

.daterangepicker td.in-range {
    background-color: #e7f3ff;
    color: #1a1a1a;
}

.daterangepicker .drp-buttons .btn {
    font-size: 13px;
    font-weight: 500;
    padding: 6px 16px;
    border-radius: 6px;
}

.daterangepicker .drp-buttons .btn-primary {
    /* background-color: #1a56db; */
    border: 1px solid #e4e6eb;
}

.daterangepicker .drp-buttons .btn-default {
    background-color: #fff;
    border: 1px solid #e4e6eb;
    color: #1a1a1a;
}

.daterangepicker .drp-selected {
    font-size: 13px;
    color: #65676b;
}

/* Custom footer text "Từ ngày... Đến ngày..." */
.daterangepicker .drp-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    border-top: 1px solid #e4e6eb;
    padding: 12px;
}
</style>
