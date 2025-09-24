const LibraryView = {
    formatResponse : (data) => {
        if(!data){
            return JSON.stringify({
                status: "error",
                message: "❌ No se pudo realizar la operación."
            }, null, 2)
        }
            return JSON.stringify({
            status: "success",
            [type]: data

        }, null, 2);
    }
    
};

export default LibraryView;
















