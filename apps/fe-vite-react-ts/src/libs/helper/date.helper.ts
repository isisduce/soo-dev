import dayjs from "dayjs";

const DateHelper = {
    // ====================================================================================================

    toString: (
        strDt: string | undefined | null,
        options?: {
            yy?: boolean,
            mm?: boolean,
            dd?: boolean,
            h?: boolean,
            m?: boolean,
            s?: boolean,
        }
    ): string => {
        var s = '';
        var date = strDt ? new Date(strDt): new Date();
        if (options?.yy) {                  s += `${       date.getFullYear()}`; }
        if (options?.mm) { if (s) s += '-'; s += `${String(date.getMonth() + 1).padStart(2, '0')}`; }
        if (options?.dd) { if (s) s += '-'; s += `${String(date.getDate()).padStart(2, '0')}`; }
        if (options?.h)  { if (s) s += ' '; s += `${String(date.getHours()).padStart(2, '0')}`; }
        if (options?.m)  { if (s) s += ':'; s += `${String(date.getMinutes()).padStart(2, '0')}`; }
        if (options?.s)  { if (s) s += ':'; s += `${String(date.getSeconds()).padStart(2, '0')}`; }
        return s;
    },

    getYY:          (strDt: string | undefined | null): string => { return DateHelper.toString(strDt, { yy: true, }); },
    getYYMM:        (strDt: string | undefined | null): string => { return DateHelper.toString(strDt, { yy: true, mm: true, }); },
    getYYMMDD:      (strDt: string | undefined | null): string => { return DateHelper.toString(strDt, { yy: true, mm: true, dd: true, }); },
    getYYMMDDh:     (strDt: string | undefined | null): string => { return DateHelper.toString(strDt, { yy: true, mm: true, dd: true, h: true, }); },
    getYYMMDDhm:    (strDt: string | undefined | null): string => { return DateHelper.toString(strDt, { yy: true, mm: true, dd: true, h: true, m: true, }); },
    getYYMMDDhms:   (strDt: string | undefined | null): string => { return DateHelper.toString(strDt, { yy: true, mm: true, dd: true, h: true, m: true, s: true, }); },
    getMM:          (strDt: string | undefined | null): string => { return DateHelper.toString(strDt, { mm: true, }); },
    getMMDD:        (strDt: string | undefined | null): string => { return DateHelper.toString(strDt, { mm: true, dd: true }); },
    getDD:          (strDt: string | undefined | null): string => { return DateHelper.toString(strDt, { dd: true }); },
    geth:           (strDt: string | undefined | null): string => { return DateHelper.toString(strDt, { h: true, }); },
    gethm:          (strDt: string | undefined | null): string => { return DateHelper.toString(strDt, { h: true, m: true, }); },
    gethms:         (strDt: string | undefined | null): string => { return DateHelper.toString(strDt, { h: true, m: true, s: true, }); },

    // ====================================================================================================

    getToday:           ()            =>                      dayjs(),
    getYYMMDDToday:     ()            => DateHelper.getYYMMDD(dayjs().toISOString()),
    getYYMMDDPrevYear:  (v: number)   => DateHelper.getYYMMDD(dayjs().subtract(v, 'year').toISOString()),
    getYYMMDDPrevMonth: (v: number)   => DateHelper.getYYMMDD(dayjs().subtract(v, 'month').toISOString()),
    getYYMMDDPrevDay:   (v: number)   => DateHelper.getYYMMDD(dayjs().subtract(v, 'day').toISOString()),

    // ====================================================================================================

    getThisYY: () => (dayjs().year()),
    getThisMM: () => (dayjs().month() + 1), // month is 0-based
    getThisDD: () => (dayjs().date()),
    getThisHH: () => (dayjs().hour()),

    // ====================================================================================================

    getNextMonth: (strDt: string | undefined | null): string => { const date = strDt ? dayjs(strDt) : dayjs(); return date.add(1, 'month').format('YYYY-MM-DD'); },
    getPrevMonth: (strDt: string | undefined | null): string => { const date = strDt ? dayjs(strDt) : dayjs(); return date.subtract(1, 'month').format('YYYY-MM-DD'); },

    // ====================================================================================================

    getNextWeek: (strDt: string | undefined | null): string => { const date = strDt ? dayjs(strDt) : dayjs(); return date.add(1, 'week').format('YYYY-MM-DD'); },
    getPrevWeek: (strDt: string | undefined | null): string => { const date = strDt ? dayjs(strDt) : dayjs(); return date.subtract(1, 'week').format('YYYY-MM-DD'); },

    // ====================================================================================================

};

export default DateHelper;
