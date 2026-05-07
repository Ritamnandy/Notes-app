
import mongoose from "mongoose";



const COLOR = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "brown",
    "white",
    "gray"
],

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    isComplete: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        trim: true,
        enum: COLOR,
        default: "gray"

    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })


const Note = mongoose.model("Note", noteSchema);

export { Note }