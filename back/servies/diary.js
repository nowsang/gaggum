const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getDiaries(){
  const rows = await db.query(
    `SELECT * from diaries WHERE diary_isdelete = 0 ORDER BY diary_date DESC`
  );
  const data = helper.emptyOrRows(rows);

  return {
    data
  }
}
async function getDiariesByDate(param){
    console.log(param);
    const rows = await db.query(
      `SELECT * from diaries WHERE diary_date LIKE "${param}%"
       AND diary_isdelete = 0`
    );
    const data = helper.emptyOrRows(rows);
    console.log(rows);
    return {
      data
    }
  }
  async function getDiariesByName(param){
    console.log(param);
    const rows = await db.query(
      `select * from
      diaries d join plants p ON d.plant_number = p.plant_number
      WHERE p.plant_name LIKE "${param}%" AND diary_isdelete = 0`
    );
    const data = helper.emptyOrRows(rows);
    console.log(rows);
    return {
      data
    }
  }
  async function editDiary(body){
    const rows = await db.query(
      `UPDATE diaries
      SET diary_title = "${body.diary_title}", diary_memo = "${body.diary_memo}"
      WHERE diary_number = ${body.diary_number}`
    );
    const data = helper.emptyOrRows(rows);
    console.log(rows);
    return {
      data
    }
  }
  async function deleteDiary(body){
    const rows = await db.query(
      `UPDATE diaries
      SET diary_isdelete = 1
      WHERE diary_number = ${body.diary_number}`
    );
    const data = helper.emptyOrRows(rows);
    console.log(rows);
    return {
      data
    }
  }
module.exports = {
  getDiaries,
  getDiariesByDate,
  getDiariesByName,
  editDiary,
  deleteDiary,
}