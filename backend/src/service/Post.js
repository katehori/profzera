const repository = require("../domain/Repository");

const PostService = {
    findAll: async () => {
        return await repository.findAll();
    },
    findById: async id => {
        return await repository.findById(id);
    },
    deleteById: async id => {
        return await repository.deleteById(id);
    }
}

module.exports = PostService;