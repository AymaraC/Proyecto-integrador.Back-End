import PublisherModel from "../models/publishersModel.js";
import LibraryView from "../views/viewResponse.js";

const PublisherController = {
    getPublishers : () => {
        const publishers = PublisherModel.getPublishers();

        if(publishers.length === 0){
            return LibraryView.formatResponse(`❌ No hay editoriales disponibles.`)
        } else {
            return LibraryView.formatResponse(publishers)
        };
    },

    addPublisher : (name) => {
        const newPublisher = PublisherModel.addPublisher(name);
        if(!newPublisher){
            return LibraryView.formatResponse(`❌ La editorial '${name}' ya se encuentra registrada.`)
        } else {
            return LibraryView.formatResponse(`✅ Editorial ${name} agregada con éxito.`);
        }
    },

    findPublisher : (name) => {
        const found = PublisherModel.findPublisher(name);

        if(!found){
            return LibraryView.formatResponse(`La editorial '${name}' no se encuentra en nuestra bibliotca.`);
        } else {
            return LibraryView.formatResponse(found)
        };
    }
};

export default PublisherController;
















