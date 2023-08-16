import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show } from './controller'
import { schema } from './model'
export Voto, { schema } from './model'

const router = new Router()
const { idUsuario, idVotacao, idCandidato } = schema.tree

/**
 * @api {post} /votos Create voto
 * @apiName CreateVoto
 * @apiGroup Voto
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam idUsuario Voto's idUsuario.
 * @apiParam idVotacao Voto's idVotacao.
 * @apiParam idCandidato Voto's idCandidato.
 * @apiSuccess {Object} voto Voto's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Voto not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ idUsuario, idVotacao, idCandidato }),
  create)

/**
 * @api {get} /votos Retrieve votos
 * @apiName RetrieveVotos
 * @apiGroup Voto
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of votos.
 * @apiSuccess {Object[]} rows List of votos.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get('/',
  token({ required: true, roles: ['admin'] }),
  query(),
  index)

/**
 * @api {get} /votos/:id Retrieve voto
 * @apiName RetrieveVoto
 * @apiGroup Voto
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} voto Voto's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Voto not found.
 * @apiError 401 admin access only.
 */
router.get('/:id',
  token({ required: true, roles: ['admin'] }),
  show)

export default router
