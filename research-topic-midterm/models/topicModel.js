const db = require('../config/db');

function getAll(keyword = '') {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM topics';
    let params = [];
    if (keyword) {
      sql += ` WHERE code LIKE ?
               OR title LIKE ?
               OR student_name LIKE ?
               OR field LIKE ?`;
      const search = `%${keyword}%`;
      params = [search, search, search, search];
    }
    sql += ' ORDER BY id DESC';
    db.all(sql, params, (err, rows) =>
      err ? reject(err) : resolve(rows)
    );
  });
}

function getById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM topics WHERE id = ?', [id], (err, row) =>
      err ? reject(err) : resolve(row)
    );
  });
}

function create(data) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO topics(code, title, student_name, field, advisor, status)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql,
      [data.code, data.title, data.student_name, data.field, data.advisor, 'Đề xuất'],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

function update(id, data) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE topics SET title=?, student_name=?, field=?, advisor=? WHERE id=?',
      [data.title, data.student_name, data.field, data.advisor, id],
      err => err ? reject(err) : resolve()
    );
  });
}
function deleteTopic(id) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM topics WHERE id=?',
      [id],
      err => err ? reject(err) : resolve()
    );
  });
}

module.exports = { getAll, getById, create, update, deleteTopic };
