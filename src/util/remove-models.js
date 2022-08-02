import mongoose from 'mongoose';
export default function removeModels() {
    mongoose.connections.filter(connection => connection.name).map(connection =>connection.models = {});
}