const db = require("../db/connection");
const endpoints = require("../endpoints.json");

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
    return Promise.resolve(endpoints);
};

exports.selectArticlesById = (article_id) => {
    const articleSqlStr = `SELECT 
    articles.article_id,
    articles.author,
    articles.title,
    articles.body,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id) :: INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY 
    articles.article_id, 
    articles.author, 
    articles.title, 
    articles.body, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url`
        
    return db.query(articleSqlStr, [article_id])
    .then((article) => {
        if (!article.rows.length) {
            return Promise.reject({ status: 404, msg: "Not found" });
        }
        return article.rows[0];
    });
};
    

exports.selectArticles = async (topic) => {
    let queryParams = [];
    if (topic) {
        queryParams = [topic];
        const topicExists = await db.query('SELECT * FROM topics WHERE slug = $1', queryParams);
        if (!topicExists.rows.length) {
            return Promise.reject({ status: 404, msg: "Not found" });
        }
    }
    let articlesSqlStr = `SELECT 
        articles.article_id,
        articles.author,
        articles.title,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url, 
        COUNT(comments.comment_id) :: INT AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`;

    if (topic) {
        articlesSqlStr += ' WHERE articles.topic = $1';
    }

    articlesSqlStr += ` GROUP BY 
        articles.article_id,
        articles.author,
        articles.title,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url
        ORDER BY articles.created_at DESC`;
        
    const articles = await db.query(articlesSqlStr, queryParams);
    return articles.rows;
};

exports.selectCommentsById = (article_id) => {
    const commentSqlStr = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;
    return db.query(commentSqlStr, [article_id])
        .then((comments) => {
            return comments.rows;
        });
};

exports.addCommentsById = (article_id, username, body) => {
    if (!username || !body) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }
    const insertCommentSqlStr = `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`;
    return db.query(insertCommentSqlStr, [article_id, username, body])
        .then((result) => {
            return result.rows[0];
        });
}

exports.updateArticleVotes = (article_id, inc_votes) => {
    const updateSqlStr = `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *
    `;
    return db.query(updateSqlStr, [inc_votes, article_id])
        .then((result) => {
            if (!result.rows.length) {
                return Promise.reject({ status: 404, msg: "Not found" });
            }
            return result.rows[0];
        });
};

exports.deleteComment = (comment_id) => {
    const deleteSqlStr = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
`;
return db.query(deleteSqlStr, [comment_id])
    .then((comment) => {
        if(!comment.rows.length){
            return Promise.reject({status: 404, msg: "Not found"})
        }
        return comment.rows[0];
    });
};

exports.allUsers = () => {
    const usersSqlStr = `
    SELECT username, name, avatar_url
    FROM users
`;
    return db
    .query(usersSqlStr)
    .then((user) => {
        return user.rows;
    })
};