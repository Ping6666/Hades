const date_convert = function (str) {
    if (Number(str) === 'NaN') {
        // make it parseable
        str = "'" + str + "'";
    }

    const c_date = new Date(str);

    return c_date.toLocaleDateString('zh', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

const date_add_year = function (str, year) {
    if (Number(str) === 'NaN') {
        // make it parseable
        str = "'" + str + "'";
    }

    const c_date = new Date(str);
    const _year = Number(year);

    c_date.setFullYear(c_date.getFullYear() + _year);

    return this.date_convert(c_date);
};

export default {
    date_convert,
    date_add_year,
};
