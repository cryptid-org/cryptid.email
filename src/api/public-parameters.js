const { IbeParametersService } = require('../ibe-parameters/IbeParametersService');

const GET = {
    method: 'GET',
    path: '/public-parameters',
    handler(request, h) {
        return IbeParametersService.getCurrentPublicParameters();
    },
    options: {
        description: 'Returns the current public parameters.'
    }
}

module.exports = {
    GET
};
