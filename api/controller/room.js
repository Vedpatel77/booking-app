import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createRoom = async (req, res, next) => {
    try {
        const hotelId = req.params.hotelId;
        const newRoom = new Room(req.body);
        const room = await newRoom.save();

        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: {
                    rooms: room._id
                }
            })
        } catch (error) {
            next(error);
        }
        res.status(201).json(room)
    } catch (error) {
        next(error);
    }
}


export const updateRoom = async (req,res,next) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{ new: true })
        res.status(200).json(updatedRoom);        
    } catch (error) {
        next(error);
    }
}

export const deleteRoom = async (req,res,next) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        try {
            await Hotel.findByIdAndUpdate(req.params.hotelId, {
                $pull: {
                    rooms: req.params.id
                }
            })
        } catch (error) {
            next(error);
        }
        res.status(200).json("Room deleted successfully.");        
    } catch (error) {
        next(error);
    }
}

export const getRoom = async (req,res,next) => {
    try {
        const room = await Room.findById(req.params.id);
        res.status(200).json(room);        
    } catch (error) {
        next(error);
    }
}

export const getRooms = async (req,res,next) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);        
    } catch (error) {
        next(error);
    }
}