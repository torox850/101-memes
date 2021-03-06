module.exports = dtb => {
    return dtb.model("Medias", new dtb.Schema({
        name: {type: String, maxLength: 50, trim: true, required: true},
        path: {type: String, required: true},
        author: {type: String, required: true},
        type: {type: String, enum: ["video/mp4", "video/webm", "image/jpg", "image/jpeg", "image/png", "image/gif"], required: true},
        tags: {
            type     : Array,
            required : true,
            validate : {
                validator : function(array) {
                    return (array.length <= 3 && array.every((v) => {
                        return (typeof v === "string" && v.length <= 25); 
                    }));
                }
            }
        },
        width: {type: Number, required: true},
        height: {type: Number, required: true},
        deleted: {type: Boolean, default: false},
        createDate: {type: Date, required: true},
        votes: {type: Array, required: true}
    }));
};


