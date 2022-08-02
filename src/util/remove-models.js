import mongoose from 'mongoose';
export default removeModels = () => {
    mongoose.connections.filter(connection => connection.name).map(connection =>connection.models = {});
}