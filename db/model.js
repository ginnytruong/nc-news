const db = require("./connection");
const fs =require("fs/promises");

exports.selectAllTopics = () => {
    const topicsSqlStr = `SELECT * FROM topics`;

    return db.query(topicsSqlStr)
    .then((topics) => {
        if(!topics.rows.length) {
            return Promise.reject({status: 404, msg: "Not found"})
        }
        return topics.rows;
    });
};

exports.selectAllEndPoints = () => {
    return fs.readFile("endpoints.json", "utf-8")
    .then((data) => {
        return JSON.parse(data);
    });
    };

exports.selectArticles = (article_id) => {
    if (!Number(article_id)) {
		return Promise.reject({ status: 400, msg: "Bad request" });
	}
    const articleSqlStr = `SELECT * FROM articles WHERE article_id = $1`;
    return db.query(articleSqlStr, [article_id])
    .then((article) => {
		if (article.rows.length === 0) {
			return Promise.reject({ status: 404, msg: "Not found" });
		}
		return article.rows[0];
	});
};


    