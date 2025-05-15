import mongoose from 'mongoose';

const clusterSchema = new mongoose.Schema({
    clusterName: {
        type: String,
        required: true,
    },
    clusterValues:{
        type: [String],
        required: true,
    }
});

const Cluster = mongoose.model('Cluster', clusterSchema);

const masterProjectSchema = new mongoose.Schema({
    masterProjectName:{
        type: String,
        required: true,
    },
    projectName:{
        type: [String],
        required: true,

    }
})

const MasterProject = mongoose.model('MasterProject', masterProjectSchema);

export {Cluster, MasterProject};