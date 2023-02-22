var fs = require('fs');
var { parse } = require('csv-parse');

const read_scv = async function (filename) {
    try {
        const _promise = new Promise((resolve, reject) => {
            const csv_data = [];
            const fs_readstream = fs.createReadStream(filename);

            fs_readstream.pipe(parse({
                delimiter: ",", from_line: 1,
            })).on('data', function (c_row) {
                csv_data.push(c_row);
            }).on('end', function () {
                console.log('\nend');

                resolve(csv_data);
            });
        });

        const [header, rows] = await _promise.then((value) => {
            const csv_data = value;
            const header = [];
            const rows = [];

            for (let i = 0; i < csv_data.length; i++) {
                const c_text = csv_data[i];

                if (i == 0) {
                    // header

                    for (let j = 0; j < c_text.length; j++) {
                        const _colvalue = c_text[j];

                        header.push(_colvalue);
                    }
                } else {
                    // rows

                    const _row = {};

                    for (let j = 0; j < header.length; j++) {
                        const _colname = header[j];
                        const _colvalue = c_text[j];

                        _row[_colname] = _colvalue;
                    }

                    rows.push(_row);
                }
            }

            return [header, rows];
        });

        console.log(header);
        console.log(rows);

    } catch (err) {
        console.log(err);
    } finally {
        console.log('bye');
    }
};

module.exports = {
    read_scv,
};
