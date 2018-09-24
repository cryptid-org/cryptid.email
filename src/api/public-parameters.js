const Boom = require('boom');
const { Maybe } = require('monet');

const { IbeParametersService } = require('../ibe-parameters/IbeParametersService');

const GET = {
    method: 'GET',
    path: '/public-parameters/{id?}',
    async handler(request) {
        const id = Maybe.fromNull(request.params.id).map(encodeURIComponent);

        if (id.isJust()) {
            const parameters = await IbeParametersService.getPublicParametersForId(id.just());

            return parameters.orJust(Boom.badRequest('Could not find the parameters corresponding to the specified ID!'));
        } else {
            const parameters = await IbeParametersService.getCurrentPublicParameters();

            return parameters.orJust(Boom.internal('Could not retrieve the current parameters.'));
        }
    },
    options: {
        description: 'Returns the current public parameters.'
    }
}

module.exports = {
    GET
};
