const { IbeParametersService } = require('../ibe-parameters/IbeParametersService');

const GET = {
    method: 'GET',
    path: '/public-parameters',
    handler(request, h) {
        const { id } = request.query;

        if (!id) {
            return IbeParametersService.getCurrentPublicParameters();
        } else {
            return IbeParametersService.getParametersForId(id);
        }        
    },
    options: {
        description: 'Returns the current public parameters.'
    }
}

module.exports = {
    GET
};
