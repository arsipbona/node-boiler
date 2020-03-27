const Sequelize = require('sequelize');
class DataTable {
    constructor(request, db, table, primaryKey, columns, model) {
        this.request = request;
        this.db = db;
        this.table = table;
        this.primaryKey = primaryKey;
        this.columns = columns;
        this.model = model;
    }
    limit() {
        return (this.request.start != "") && (this.request.length != "") ?
            ` LIMIT ${parseInt(this.request.start)},${parseInt(this.request.length)} ` :
            "";
    }
    order() {
        let order = "";
        var orderBy = [];

        if (this.request.order.length > 0) {
            let dtColumns = DataTable.pluck(this.columns, "dt");
            this.request.order.forEach((element, index) => {
                // Convert the column index into the column data property
                let columnIdx = parseInt(this.request.order[index]["column"]);

                let requestColumn = this.request.columns[columnIdx];

                columnIdx = dtColumns[requestColumn["data"]];

                let column = this.columns[columnIdx];

                if (requestColumn["orderable"] == "true") {
                    let dir =
                        this.request["order"][index]["dir"] === "asc" ? "ASC" : "DESC";

                    orderBy.push(column["db"] + " " + dir);
                }
            });

            if (orderBy.length > 0) {
                order += " ORDER BY " + orderBy.join(", ");
            }
        }
        return order;
    }
    filter() {
        let globalSearch = [];

        let dtColumns = DataTable.pluck(this.columns, "dt");

        if (this.request.search != "" && this.request.search.value != "") {
            const searchStr = this.request.search["value"];
            // Get columns search
            this.request.columns.forEach((ele, index) => {
                let requestColumn = this.request.columns[index];

                let columnIdx = dtColumns[requestColumn["data"]];

                let column = this.columns[columnIdx];

                if (requestColumn.searchable == "true") {
                    globalSearch.push(` ${column["db"]}  LIKE '%${searchStr}%' `);
                }
            });
        }


        // Combine the filters in the single string
        let where = "";
        if (globalSearch.length > 0) {
            where = ` (${globalSearch.join(" OR ")})`;
        }

        if (where !== "") {
            where = ` WHERE ${where} `;
        }
        return where;
    }

    buildQuery() {
        // Build SQL query string from the request
        const limit = this.limit();
        const order = this.order();
        const where = this.filter();

        // Check if table is table name or SQL query
        if (DataTable.isValidSQL(this.table)) {
            // It is a custom SQL query so make it a subquery by wrapping it arround ()temp
            this.table = `(${this.table})temp`
        }

        return `SELECT id,${DataTable.pluck(this.columns, "db").join(", ")} FROM ${this.table} ${where} ${order} ${limit}`;
    }

    async output(callback) {
        const queryString = this.buildQuery();
        const db = this.db;
        const model = this.model;
        // console.log(this.model);
        await db.query(queryString, { type: db.QueryTypes.SELECT })
            .then(users => {
                const filteredRecords = users.length;
                model.findAll({
                    attributes: [[db.fn('count', db.col(this.primaryKey)), 'resultCount']],
                    raw: true,
                }).then(data => {
                    let totalRecords = data[0].resultCount;
                    let output = {
                        draw: this.request["draw"] != "" ? this.request["draw"] : 0,
                        recordsTotal: totalRecords,
                        recordsFiltered: filteredRecords,
                        data: DataTable.mapData(this.columns, users)
                    };
                    // excute the callback
                    if (typeof callback === 'function') {
                        callback(null, output)
                    }
                    else {
                        throw new Error('Provide a callable function!')
                    }
                }).catch(err => {
                    callback(new Error(err), null)
                });

                // We don't need spread here, since only the results will be returned for select queries
            })
            .catch(err => {
                callback(new Error(err), null)
            });
        // callback('', limit);
    }
    //static function
    static mapData(columns, data) {
        let out = [];

        data.forEach((ele, index) => {
            let row = new Object();
            let idx=0;
            columns.forEach((column, i) => {
                row[column["dt"]] = data[index][column["db"]];
                idx++;
            });
            row[idx]=`
            <button  data-id="/users/edit/${data[index]['id']}" class="btn btn-warning openModal" data-type="edit" type="button"><span class="fas fa-edit"></span></button>
            <button  data-id="/users/delete/${data[index]['id']}" class="btn btn-danger openModal" data-type="delete" type="button"><span class="fas fa-trash"></span></button>
            `;

            out.push(row);
        });

        return out;
    }
    static pluck(dataArray, prop) {
        let out = [];

        dataArray.forEach((element, index) => {
            out.push(dataArray[index][prop]);
        });

        return out;
    }
    static isValidSQL(query) {
        const arr = query.toString().split(' ');

        if (arr.length > 1 || arr.includes("SELECT") || arr.includes("select")) {
            return true
        }

        return false
    }
}
module.exports = DataTable;