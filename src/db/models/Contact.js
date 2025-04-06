import { Schema, model } from "mongoose";


const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isFavourite: {
        type: Boolean,
        default: false,
        required: true
    },
    contactType: {
        type: String,
        enum: ['work', 'home', 'personal'],
        required: true,
        default: 'personal'
    },
}, {
    timestamps: true
});

const contactModel = model("contact", contactSchema);

export default contactModel;