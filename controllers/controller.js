const { selectAllTopics, selectAllEndPoints, selectArticlesById, selectArticles, selectCommentsById, addCommentsById, updateArticleVotes, deleteComment, allUsers } = require("../models/model");

exports.getAllTopics = (request, response, next) => {
    selectAllTopics()
    .then((topics) => {
        response.status(200).send({topics});
    })
    .catch((err) => {
        next(err);
    });
};

exports.getAllEndPoints = (request, response, next) => {
    selectAllEndPoints()
    .then((allEndPoints) => {
        response.status(200).send(allEndPoints)
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticlesById = (request, response, next) => {
    const { article_id } = request.params;
    selectArticlesById(article_id)
    .then((article) => {
        response.status(200).send(article)
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticles = async (request, response, next) => {
    const { topic } = request.query;
    selectArticles(topic)
    .then((articles) => {
        response.status(200).send({articles})
    })
    .catch((err) => {
        next(err);
    });
};

exports.getCommentsById = (request, response, next) => {
    const { article_id } = request.params;
    selectArticlesById(article_id)
        .then((article) => {
            return selectCommentsById(article_id);
        })
        .then((comments) => {
            response.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
};

exports.postCommentsById = (request, response, next) => {
    const { username, body } = request.body;
    const { article_id } = request.params;
    selectArticlesById(article_id)
        .then((article) => {
            return addCommentsById(article_id, username, body)
            .then((comment) => {
                response.status(201).send({comment})
            })
        })
    .catch((err) => {
        next(err)
    })
};

exports.patchArticleById = (request, response, next) => {
    const { inc_votes } = request.body;
    const { article_id } = request.params;
    updateArticleVotes(article_id, inc_votes)
        .then((updatedArticle) => {
            response.status(200).send(updatedArticle);
        })
        .catch((err) => {
            next(err);
        });
};

exports.deleteCommentById = (request, response, next) => {
    const { comment_id } = request.params;
    deleteComment(comment_id)
    .then((comment) => {
        response.status(204).send();
    })
    .catch((err) => {
        next(err)
    })
};

exports.getUsers = (request, response, next) => {
    allUsers()
    .then((users) => {
        response.status(200).send({users})
    })
    .catch((err) => {
        next(err)
    })
}